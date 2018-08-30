/**
*   @author jerryxu
*   @methodName ActionCreator
*   @params type
*   @description 事件生成器
*
*/
import Storage from '../store';
import {packageReqData, aesDecrypt} from './encrypt-util'
import {Toast,} from 'antd-mobile';
import { apiUrl,isMock } from '../config/api'
import {showSingleBtnModal} from "../compoents/ModalAlert";
import { jsNative } from "sx-jsbridge";
const  { nativeLogin, nativeQuitLogon, nativeRequestBaseParams } = jsNative;

export const ActionCreator = (type, url, method, data, key ,cancel = false) => {
    return () => {
        return {
            types: [...type],
            payload: key,
            promise: ()=>fetchPromise(url, method = 'GET', data, true,true)

        }
    }
}


/**
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

/**
 *   @author jerryxu
 *   @description 网络请求方法
 *
 */
export const  fetchPromise = async (url, method = 'GET', data, cancel = false, isRedux =false) => {
  const reqParams = await nativeRequestBaseParams().then((reqParams) => {
    Storage.dispatch({type:'syncData',data:reqParams})
    return {
      APPVERSION: reqParams['APP_VERSIONS'],
      OSVERSION: reqParams['PHONE_VERSIONS'],
      PLATFORM: reqParams['PHONE_PLATFORM'],
      TOKEN_ID: reqParams['TOKEN_ID'],
      CHANNEL_NO: reqParams['channelNo'],
    }})
  if(isMock){
    return fetchMockData(data);
  }

  //let baseUrl = 'http://172.16.135.174:8080/phoneclient/notify.htm'; //开发服务器
  let baseUrl = apiUrl;//'http://172.16.42.28:8080/lemon-mobile/phoneclient/notify.htm'; //李建
  if(window.location.host.indexOf('mpmw.vbill.cn')>-1 ){
    baseUrl = 'https://mp.vbill.cn/phoneclient/notify.htm'
  }  else if(window.location.host.indexOf('mpmw-rc.vbill.cn')>-1){
    baseUrl ='https://mp-rc.vbill.cn/phoneclient/notify.htm'
  } else if(window.location.host.indexOf('mpmw-alpha.vbill.cn')>-1){
    baseUrl ='https://mp-alpha.vbill.cn:8084/phoneclient/notify.htm'
  }
  const isnv = 1;//是否sha256
  const encflag = 1;//是否AES

  Storage.dispatch({type: "REQUEST", data: true});
  let queryData = '';
  const dataBody = packageReqData({...data,...reqParams}, isnv, encflag)
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
    }).finally(()=>{
      Storage.dispatch({type: "FINISH", data: false});
    })
  );
  if (cancel) {
    PromiseList.addPromise(x);
  }
  return x;
}

const fetchMockData = (data)=>new Promise((resolve,reject)=>{
  const { TRDE_CODE } = data;
  return fetch(`http://172.16.135.175:8080/app/mock/16/${TRDE_CODE}`, {
    method: "GET",
    headers: {...headers, 'Access-Control-Allow-Origin': '*',},
    mode: 'cors',
  }).then(checkStatus).then((response)=>{
    if (response.ok || response.status == '400') {
      return response.json()
    } else {
      return {err: {msg: '请求异常', code: '7777'}}
    }
  }).then((data)=>{
    if (data["RETURNCODE"] === "0000" ||data["RESULTCODE"] === "0000") {
      return data;
    } else {
      let error = null;
      if(data['RESULTMSG']){
        error = new Error(data['RESULTMSG'])
      } else {
        error = new Error(data['RETURNCON'])
      }

      Toast.info(error.message, 2)
      throw error
    }
  }).then((data) => {
    resolve(data)
  }).catch((err) => {
    reject({err})
  })
})


/**
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

/**
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

/***
 *   @author jerryxu
 *   @description 请求头部设置
 */
export const headers = {
  "Content-Type": "application/json;charset=UTF-8",
  'Access-Control-Allow-Origin': '*',
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
}

/**
 *   @author jerryxu
 *   @description 统一处理网络请求数据
 */
export function filterResponse(data) {
  data = JSON.parse(aesDecrypt(data));
  const { RETURNCODE , RESULTCODE} = data;
  if(typeof  RESULTCODE != 'undefined'){
    const { RESULTMSG } = data;
    if (RESULTCODE === "0000" || RESULTCODE === "1001" || RESULTCODE == "1000") {
      return data;
    }  else {
      let error = null;
      error = new Error(RESULTMSG)
      Toast.info(error.message, 2)
      throw error
    }
  } else if(typeof RETURNCODE != 'undefined'){
    const { RETURNCON } = data;
    if (RETURNCODE === "0000" ) {
      return data;
    } else if(RETURNCODE === "1004"){
      checkReLoginFlow({message:'请重新登录'},()=>{ return },()=>{window.location.href = '/home/index'})
      let error = null;
      error = new Error(RETURNCON)
      throw error
    }else {
      let error = null;
      error = new Error(RETURNCON)
      Toast.info(error.message, 2)
      throw error
    }
  }
}

/**
 * 打包公共参数
 * @param nativeParams    android/ios 原生返回接口基础参数
 * @param TRDE_CODE       接口标识
 * @returns {{APPVERSION: app版本号, OSVERSION: 手机系统版本, PLATFORM: ios/android, channelNo: 个人版/商务版, TOKEN_ID: token}}
 */
export const packagePublicParams = (nativeParams, TRDE_CODE) => ({
  APPVERSION: nativeParams['APP_VERSIONS'],
  OSVERSION: nativeParams['PHONE_VERSIONS'],
  PLATFORM: nativeParams['PHONE_PLATFORM'],
  TOKEN_ID: nativeParams['TOKEN_ID'],
  CHANNEL_NO: nativeParams['CHANNEL_NO'],
  TRDE_CODE,
});

/**
 * 处理重新登录回调
 * @param message
 * @param successCall
 * @param cancelCall
 */
export const checkReLoginFlow = (err, successCall = () => {}, cancelCall = () => {}) => {
    if(window.loginAlert){
      return
    }
    window.loginAlert =true;
    showSingleBtnModal({
      title: err.message, onOk: () => {
        window.loginAlert = false;
        nativeQuitLogon();
        nativeLogin((params) => {
          if (params.errorCode == '0000') { // 登录成功
            successCall(params);
          } else {
            /* 登录取消 */
            cancelCall();
          }
        });
      }
    });
    return true;
};