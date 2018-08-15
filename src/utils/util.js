import {Toast} from "antd-mobile";
import 'antd-mobile/lib/toast/style/index.css'


export function runGenerator(generator){
  var it = generator();

  function go(result){
    if(result.done) {
      // console.log(result.value);
      return result.value;
    }
    return result.value.then(function(value){
      return go(it.next(value));
    },function(error){
      return go(it.throw(error));
    });
  }

  go(it.next());
}

export const createMeta = (data = {}) => {
    let oMeta = document.createElement('meta');
    let keys = Object.keys(data);
    keys.map((v) => {
        oMeta.setAttribute(v, data[v])
    })
    oMeta.setAttribute("id", "share")
    document.getElementsByTagName('head')[0].appendChild(oMeta);
}

export const removeMeta = () => {
    let parent = document.getElementsByTagName('head')[0]
    let current = document.getElementById("share")
    !!current ? parent.removeChild(current) : undefined
}

/**
 * 调用分享接口，获取相关数据
 * @param mobileNo
 * @param type
 * @param cardId
 */
export const share = (mobileNo, type, cardId) => {
    let patt = /[a-z]/i
    console.log(mobileNo, 'mod323')
    return new Promise(function (resolve, reject) {
        let params = {
            mobileNo, type
        }
        params = cardId ? {...params, cardId} : params
        params = patt.test(mobileNo) ? {...params, isEnc: true} : params
        console.log(params, '===params====')
        fetchPromise('/api', 'POST', {
            "TRDE_CODE": 'M0318',
            ...params
        }).then((result) => {
            console.log(11111)
            if (result.RETURNCODE == '0000') {
                let url = !!cardId ? `${result.RETURNURL[0]['shareUrl']}/${cardId}` : result.RETURNURL[0]['shareUrl']
                let data = {
                    url: `${window.location.origin}/cca/creditApply/${result.RETURNURL[0].recommendPhoneEnc}/${result.RETURNURL[0].channelCode}/${ encodeURIComponent(url)}`,
                    iconUrl: result.RETURNURL[0].sharePic,
                    description: result.RETURNURL[0].shareDescribe,
                    title: result.RETURNURL[0].shareTitle,
                }
                console.log(data, '---')
                createMeta(data);
                resolve(result.RETURNURL[0])
            } else {
                reject()
            }
        })

    })

}

export const getChannelId = () => {
    let u = navigator.userAgent
    if (u.indexOf('SuiXingPay-Mpos') > -1) {
        return '1000'
    } else if (u.indexOf('Xlm-app') > -1) {
        return '1001'
    }
    return ''
}

export const getDataFromApp = () => {
    return new Promise(function (resolve, reject) {
        setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler('getAuthInfo', function (response) {
                let resObj = {}

                if(typeof(response) =='string'){
                    resObj = JSON.parse(response);

                } else if(typeof(response) == 'object'){
                    resObj = response;

                } else if(typeof(response) == 'undefined'){

                    Toast.fail('请升级APP!',3,()=>{
                        reject({err:'err'})
                    });

                }
                if(resObj.STATUS == '02'){
                    Toast.fail('请先进行实名认证！',3,()=>{
                        reject({err:'err'})
                    });

                }else{
                    try {
                        console.log('JS got response', response)
                        typeof response == 'string' ? response = JSON.parse(response) : response
                        let username = response.name
                        let phone = response.mobile
                        fetchPromise('/api', 'POST', {
                            "TRDE_CODE": 'M0315',
                            applyName: username,
                            channelId: getChannelId(),
                            applyPhone: phone,
                            isEnc: true,
                        }).then((data) => {
                            sessionStorage.setItem("mobileNo", phone)
                            sessionStorage.setItem("uuid", data.UUID)
                            sessionStorage.setItem("getChannelId", getChannelId())
                            resolve(response)
                        },(err)=>{
                            reject(err)
                        })
                    } catch (e) {
                        console.log('error======>', e)
                    }
                }

            })
        })
    })
}

export const getSearch = (props) => {
    let search = ""
    let pathname = decodeURIComponent(props.location.search)
    let url = pathname.match(/\$(\S*)\$/) ? pathname.match(/\$(\S*)\$/)[1] : "";

    if (!!url) {
        search = JSON.parse(url)
    }

    return search
}

export const trim = (str = '') =>{ //删除左右两端的空格
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

export const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
export const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/