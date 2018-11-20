// @flow
/**
 *   @author jerryxu
 *   @methodName ActionCreator
 *   @params type
 *   @description 事件生成器
 *
 */

import { Toast } from 'antd-mobile';
import { jsNative } from 'sx-jsbridge';
import { apiUrl, isMock } from '../config/api';
import Storage from '../store';
import { aesDecrypt, aesEncrypt, generateSign, SIGN_KEY } from './encrypt-util';
import { showSingleBtnModal } from '../compoents/ModalAlert';

const { nativeLogin, nativeQuitLogon, nativeRequestBaseParams } = jsNative;

type actionParams = {
  type: string,
  method: string,
  key?: string,
  url?: string,
  data: any
}
export const ActionCreator = (args: actionParams): Function => {
  const {
    type,
    method = 'GET',
    key = '',
    url = '/api',
    data
  } = args;
  return () => ({
    payload: key,
    promise: () => fetchPromise(url, method, data, true),
    types: [...type]
  });
};

/**
 *   @author jerryxu
 *   Create a Class PromiseList
 *   @description 异步请求管理类
 *
 */
export class PromiseList {
  static list = [];

  static addPromise(promise: any): void {
    PromiseList.list.push(promise);
  }

  static cancel(): void {
    PromiseList.list.forEach((v) => {
      v.isCanceled = true;
    });
    PromiseList.list = [];
  }
}

/**
 *   @author jerryxu
 *   @description 网络请求方法
 *
 */

export const fetchPromise = async (url: string, method?: string = 'GET', data?: any = {}, cancel?: boolean = false) => {
  // 获取基础参数
  const reqParams = await nativeRequestBaseParams().then((params) => {
    Storage.dispatch({ type: 'syncData', data: params });
    return {
      APPVERSION: params['APP_VERSIONS'],
      OSVERSION: params['PHONE_VERSIONS'],
      PLATFORM: params['PHONE_PLATFORM'],
      TOKEN_ID: params['TOKEN_ID'],
      CHANNEL_NO: params['channelNo']
    };
  });
  data = { ...data, ...reqParams };
  if (isMock) {
    return fetchMockData(data);
  }
  let baseUrl = apiUrl;
  if (window.location.host.includes('mpmw.vbill.cn')) {
    baseUrl = 'https://mp.vbill.cn/phoneclient/notify.htm';
  } else if (window.location.host.includes('mpmw-rc.vbill.cn')) {
    baseUrl = 'https://mp-rc.vbill.cn/phoneclient/notify.htm';
  } else if (window.location.host.includes('mpmw-alpha.vbill.cn')) {
    baseUrl = 'https://mp-alpha.vbill.cn:8084/phoneclient/notify.htm';
  } else if (window.location.host.includes('mpmw-test.vbill.cn')) {
    baseUrl = 'https://mpos.suixingpay.com/phoneclient/notify.htm';
  }
  const isnv = 1; // 是否sha256
  const encflag = 1; // 是否AES

  Storage.dispatch({ type: 'REQUEST', data: true });
  data['isnv'] = isnv;
  data['encflag'] = encflag;
  data['sign'] = generateSign(data, SIGN_KEY);
  let requestBody = {};
  let queryBody = '';
  if (method.toUpperCase() === 'POST') {
    requestBody = { body: JSON.stringify({ DELICIOUS_DATA: aesEncrypt(JSON.stringify(data)) }) };
  } else if (method.toUpperCase() === 'GET') {
    queryBody = `?DELICIOUS_DATA=${aesEncrypt(JSON.stringify(data))}`;
  }
  const x = new Promise(
    (resolve, reject) => fetch(`${baseUrl}${queryBody}`, {
      method,
      ...requestBody
    })
      .then((p) => {
        if (!!x.isCanceled) {
          throw Error('取消请求');
        } else {
          return p;
        }
      })
      .then(checkStatus).then(parseJSON)
      .then(filterResponse)
      .then((result) => {
        resolve(result);
      })
      .catch(() => {
        reject(new Error(`接口异常${data}`));
      })
  ).finally(() => {
    Storage.dispatch({ type: 'FINISH', data: false });
  });
  if (cancel) {
    PromiseList.addPromise(x);
  }
  return x;
};

const fetchMockData = (data: any) => new Promise((resolve, reject) => {
  const { TRDE_CODE } = data;
  return fetch(`http://172.16.135.175:8080/app/mock/16/${TRDE_CODE}`, {
    method: 'GET',
    headers: { ...headers, 'Access-Control-Allow-Origin': '*' },
    mode: 'cors'
  })
    .then(checkStatus).then(
      (response: Response) => (response.ok || response.status === 400 ? response.json() : {
        err: {
          msg: '请求异常',
          code: '7777'
        }
      })
    )
    .then((params: any) => {
      if (params['RETURNCODE'] === '0000' || params['RESULTCODE'] === '0000') {
        return params;
      }
      let error = null;
      if (params['RESULTMSG']) {
        error = new Error(params['RESULTMSG']);
      } else {
        error = new Error(params['RETURNCON']);
      }
      Toast.info(error.message, 2);
      throw error;
    })
    .then((result) => {
      resolve(result);
    })
    .catch(() => {
      reject(new Error('Mock 请求异常'));
    });
});

/**
 *   @author jerryxu
 *   @description 检查响应状态
 *
 */
export function checkStatus(response: Response): Response {
  if (!!response && ((response.status >= 200 && response.status < 300) || response.status === 400)) {
    return response;
  }
  const err = new Error('网络异常');
  err.message = response.statusText;
  throw err;
}

/**
 *   @author jerryxu
 *   @description 解析response
 *
 */
export function parseJSON(response: Response): string | Object {
  return !!response && (response.ok || response.status === 400) ? response.text() : {
    err: {
      msg: '请求异常',
      code: '7777'
    }
  };
};

/**
 *   @author jerryxu
 *   @description 请求头部设置
 */
export const headers = {
  'Content-Type': 'application/json;charset=UTF-8'
};

/**
 *   @author jerryxu
 *   @description 统一处理网络请求数据
 */
export function filterResponse(data: any): any {
  data = JSON.parse(aesDecrypt(data));
  const { RETURNCODE, RESULTCODE } = data;
  if (typeof  RESULTCODE !== 'undefined') {
    const { RESULTMSG } = data;
    if (RESULTCODE === '0000' || RESULTCODE === '1001' || RESULTCODE === '1000') {
      return data;
    }
    const error = new Error(RESULTMSG);
    Toast.info(error.message, 2);
    throw error;
  } else if (typeof RETURNCODE !== 'undefined') {
    const { RETURNCON } = data;
    if (RETURNCODE === '0000') {
      return data;
    }
    if (RETURNCODE === '1004') {
      checkReLoginFlow({ message: '请重新登录' }, () => {
      }, () => {
        window.location.href = '/home/index';
      })
      const error = new Error(RETURNCON);
      throw error;
    } else {
      const error = new Error(RETURNCON);
      Toast.info(error.message, 2);
      throw error;
    }
  }
  throw Error('数据错误');
}

/**
 * 处理重新登录回调
 * @param message
 * @param successCall
 * @param cancelCall
 */
export const checkReLoginFlow = (
  err: any,
  successCall: Function = () => {},
  cancelCall: Function = () => {}
): any => {
  if (window.loginAlert) {
    return;
  }
  window.loginAlert = true;
  showSingleBtnModal({
    title: err.message,
    onOk: () => {
      window.loginAlert = false;
      nativeQuitLogon();
      nativeLogin((params) => {
        if (params.errorCode === '0000') { // 登录成功
          successCall(params);
        } else {
          /* 登录取消 */
          cancelCall();
        }
      });
    }
  });
};
