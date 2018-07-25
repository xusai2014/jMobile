import Storage from '../store';
import {packageReqData, aesDecrypt} from './encrypt-util'
import {Toast} from 'antd-mobile';
import 'antd-mobile/lib/toast/style/index.css';
import { apiUrl } from '../config/api'
/*
*   @author jerryxu
*   @methodName ActionCreator
*   @params type
*   @description 事件生成器
*
*/
export const ActionCreator = (type, url, method, data, key) => {
    return () => {
        return {
            types: [...type],
            payload: key,
            promise: () => {
                return new Promise((resolve, reject) => {
                    fetch(url, {
                        method: method,//注意token获取不可抽取出来
                        headers: {
                            ...headers,
                            'auth-token': $.cookie('auth-token'),
                            'app-version': $.cookie('app-version'),
                        },
                        body: data ? JSON.stringify(data) : null,
                    }).then(checkStatus).then(parseJSON).then(filterResponse).then((data) => {
                        resolve(data);
                    }).catch((err) => {
                        reject({err});
                    });
                })
            }
        }
    }
}

export const syncToRedux = (args) => (p) => p

/*
*   @author jerryxu
*   Create a Class PromiseList
*   @description 异步请求管理类
*
*/
export class PromiseList {
    static list = [];

    constructor() {
    }

    static addPromise(promise) {
        PromiseList.list.push(promise)
    }

    cancel() {
        PromiseList.list.map((v, k) => {
            v.isCanceled = true;
        })

        PromiseList.list = [];
    }
};

/*
*   @author jerryxu
*   @description 网络请求方法
*
*/
export const fetchPromise = (url, method = 'GET', data, cancel = false) => {
    //let baseUrl = 'http://172.16.135.174:8080/phoneclient/notify.htm'; //开发服务器
    let baseUrl = apiUrl;//'http://172.16.42.28:8080/lemon-mobile/phoneclient/notify.htm'; //李建
    if(window.location.host.indexOf('mpaw.vbill.cn')>-1 ){
      baseUrl = '//mp.vbill.cn/phoneclient/notify.htm'
    }  else if(window.location.host.indexOf('mpaw-rc.vbill.cn')>-1){
        baseUrl ='https://mp-rc.vbill.cn/phoneclient/notify.htm'
    } else if(window.location.host.indexOf('mpaw-alpha.vbill.cn')>-1){
      baseUrl ='https://mp-alpha.vbill.cn:8084/phoneclient/notify.htm'
    }
    const isnv = 1;//是否sha256
    const encflag = 1;//是否AES

    Storage.dispatch({type: "REQUEST", data: true});

    let queryData = '';
    const dataBody = packageReqData(data, isnv, encflag)
    Object.keys(dataBody).map((v, k) => {
        queryData = queryData + v + '=' + dataBody[v] + '&'
    })
    const params = method != 'GET' && dataBody ? {body:JSON.stringify(dataBody)} : {}
    const x = new Promise((resolve, reject) =>
        fetch(`${baseUrl}?${queryData}`, {
            method: method,
            headers: {...headers, 'Access-Control-Allow-Origin': '*',},
            mode: 'cors',
            ...params
        }).then((p)=>{if(x.isCanceled){return;}else{return p}}).then(checkStatus).then(parseJSON).then(filterResponse).then((data) => {
            resolve(data)
        }).catch((err) => {
            reject({err})
        })
    );
    if (cancel) {
        PromiseList.addPromise(x);
    }
    return x;
}
// export const fetchPromise = ()=>{
//   const x = new Promise((resolve,reject)=>{
//     setTimeout(()=>{
//       if(true){
//         resolve();
//       }
//       reject();
//     },1000)
//   })
//   PromiseList.addPromise(x);
//    return x;
// }


/*
*   @author jerryxu
*   @description 检查响应状态
*
*/
export function checkStatus(response) {
    if ((response.status >= 200 && response.status < 300) || response.status == 400) {
        return response
    } else if (response.status === 401) {
        $.cookie('auth-token', '', {expires: -1, path: '/'});
        window.location.href = `${window.specialOrigin}/error-401.html`
        const err = new Error("token过期")
        err.response = response
        err.message = response.statusText
        throw err
    } else if (response.status === 403) {
        window.location.href = `${window.specialOrigin}/error-403.html`
        const err = new Error("没有权限")
        err.response = response
        err.message = response.statusText
        throw err
    } else if (response.status === 500) {
        window.location.href = `${window.specialOrigin}/error-500.html`
        const err = new Error("网络异常")
        err.response = response
        err.message = response.statusText
        throw err
    } else {
        const err = new Error("网络异常")
        err.response = response
        err.message = response.statusText
        throw err
    }
}

/*
*   @author jerryxu
*   @description 解析response
*
*/
export function parseJSON(response) {
    if (response.ok || response.status == '400') {
        return response.text();
    } else {
        return {err: {msg: '请求异常', code: '7777'}}
    }
}

/*
*   @author jerryxu
*   @description 请求头部设置
*/
export const headers = {
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
}

/*
*   @author jerryxu
*   @description 统一处理网络请求数据
*/
export function filterResponse(data) {
    data = JSON.parse(aesDecrypt(data));
    if (data["RETURNCODE"] === "0000") {
        return data;
    } else {
        const error = new Error(data['RETURNCON'])
        Toast.info(error.message, 2)
        throw error
    }

}