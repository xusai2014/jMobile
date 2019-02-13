/**
 *   @author jerryxu
 *   封装网络请求库
 */
import 'whatwg-fetch';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import { fetch } from 'whatwg-fetch';

// use native browser implementation if it supports aborting
const abortableFetch = ('signal' in new Request('')) ? window.fetch : fetch;


export default class fetchUtil {
  constructor(baseUrl, options) {
    const {
      headers = {}, // 网络请求协商定义头部
      beforeSend, // 数据发送前，处理数据
      checkStatus, // 处理HTTP请求状态
      transferBody, // 解析相应体
      handleData, // 统一处理数据
      success,  // 成功回调
      failed,   // 失败回调
      mode,
      mock
    } = options;

    if (mock) {
      this.mock = mock
    }
    this.headers = {
      ...this.headers,
      ...headers
    };
    if (transferBody) {
      this.transferBody = transferBody;
    }
    this.mode = mode;

    this.baseUrl = baseUrl;
    if (checkStatus) this.checkStatus = checkStatus;
    if (handleData) this.handleBody = handleData;
    if (success) this.successFunc = success;
    if (failed) this.failedFunc = failed;
    if (beforeSend) this.beforeSendFunc = beforeSend;
  }

  mode = 'cors';
  mock = false;
  baseUrl = '/';
  headers = {
    'Content-Type': 'application/json;charset=UTF-8'
  };

  beforeSendFunc = async (data, headers) => ({data, headers});

  requestQuene = [];

  checkStatus = (response) => {
    if (!!response && ((response.status >= 200 && response.status < 300) || response.status === 400)) {
      return response;
    }
    throw new Error(response.statusText);
  };

  transferBody = (response) => {
    const contentType = response.headers.get('content-type');
    if (contentType.includes('application/json')) {
      return response.json();
    } else if (contentType.includes('text/html')) {
      return response.text();
    } else {
      try {
        return response.json();
      } catch (e) {
        throw new Error(`[J-fetch]-transferBody`);
      }
    }
  }
  handleBody = (body) => body;
  successFunc = (data) => data;
  failedFunc = (err) => {
    return err;
  };


  get(path) {
    return this.common(path, '', 'GET');
  };

  post(path, data) {
    return this.common(path, data, 'POST');
  };

  put(path, data) {
    return this.common(path, data, 'PUT');
  };

  delete(path, data) {
    return this.common(path, data, 'DELETE')
  };

  abort() {
    this.requestQuene.map((v, k) => v.abort());
  };

  async common(path, data, method) {
    const controller = new AbortController()
    let options = {
      method: this.mock ? method : "GET",
      headers: this.headers,
      signal: controller.signal
    }
    const {data: bodyData, headers = {}} = await this.beforeSendFunc(JSON.stringify(data));
    if (options.method !== "GET" && bodyData) {
      options.body = bodyData;
    }
    if (headers) {
      options.headers = {
        ...options.headers,
        ...headers,
      }
    }
    this.requestQuene.push(controller);
    return new Promise((resolve, reject) => {
      abortableFetch(`${this.baseUrl}${path}`, options)
        .then((response) => {
          return this.checkStatus(response)
        }).then((response) => this.transferBody(response))
        .then(({body, response}) => this.handleBody(body, response.headers.get('paramKey')))
        .then((data) => {
          this.successFunc(data);
          resolve(data);
        })
        .catch((err) => {
          // 请求终止异常 错误静默
          if (err.name === 'AbortError') {
            console.log('request aborted')
            throw Error(err.message)
            return;
          }
          // 框架健壮性 错误静默
          if (!err.message.includes('J-fetch')) {
            console.log('J-fetch Exception')
            return;
          }
          this.failedFunc(err)
          reject(err);
        });
    });
  }
}
