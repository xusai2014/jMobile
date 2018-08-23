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

export const waitFunc = (time)=>{
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve()
    },time)
  })
}
export const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
export const regBankCard = /^[0-9]*$/
export const regMobile = /^[0-9]*$/
export const regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/

export const judgeEnv = ()=>{
  let env = '-test';
  if(window.location.host.indexOf('mpmw.vbill.cn')>-1 ){
    env = ''
  }  else if(window.location.host.indexOf('mpmw-rc.vbill.cn')>-1){
    env ='-rc'
  } else if(window.location.host.indexOf('mpmw-alpha.vbill.cn')>-1){
    env ='-alpha'
  } else if(window.location.host.indexOf('mpmw-test.vbill.cn')>-1){
    env ='-test'
  } else if(window.location.host.indexOf('mpmw-dev.vbill.cn')>-1) {
    env = '-dev'
  }
  return env;

}