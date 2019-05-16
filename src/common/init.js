/**
 *   @author jerryxu
 *   应用初始化方法
 */
// import sa from 'sa-sdk-javascript';
import Promise from 'promise-polyfill';
import * as moment from 'moment';
import fetchUtil from "./fetchUtil";
import { envApi } from "./api";
import './style.less';
import 'moment/locale/zh-cn';


export default (historyApi, store) => {
  // To add to window, 定义全局变量
  if (!window.Promise) {
    window.Promise = Promise;
  }
  if (!window.$) {
    window.$ = {};
  }

  window.Jfetch = new fetchUtil(envApi(), {
    beforeSend: async (data) => {
      return {
        data,
        headers: {
          'PHONE-MAC': "*****",
        }
      };
    },
    mode: 'cors',
    mock: false,
    checkStatus: (response) => {
      if (!!response && ((response.status >= 200 && response.status < 300) || response.status === 400)) {
        return response;
      } if (response.status == 401) {
        console.log('Unauthorized');
        throw Error('Unauthorized');
      }
    },
    transferBody: response => {
      return new Promise((resolve,reject)=>{
        response.text().then((text)=>{
          resolve({body:text,response})
        }, err => reject(err))
      })
    },
    handleData: (data,key) => {
      return data;
    }
  });

  moment.locale('zh-cn');

};
