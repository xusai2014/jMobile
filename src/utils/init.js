// @flow
// import sa from 'sa-sdk-javascript';
import Promise from 'promise-polyfill';
import type { BrowserHistory } from 'history/createBrowserHistory';
import * as moment from 'moment';
import fetchUtil from "./fetchUtil";
import { envApi } from "../config/api";

export default (historyApi: BrowserHistory, store: any) => {
  // To add to window, 定义全局变量
  if (!window.Promise) {
    window.Promise = Promise;
  }
  if (!window.$) {
    window.$ = {};
  }

  window.fetchPromise = new fetchUtil(envApi(), {
    beforeSend: async (data) => {
      const params = await nativePromiseBaseParams();
      return {
        data: rsaUtill.encrypt(data),
        headers: {
          'PHONE-IMEI': params['PHONE_IMEI'],
          'PHONE-IMSI': params['PHONE_IMSI'],
          'PHONE-FIRM': params['PHONE_FIRM'],
          'PHONE-MODLE': params['PHONE_MODLE'],
          'PHONE-PLATFORM': 'H5',
          'PHONE-VERSION': params['PHONE_VERSIONS'],
          'PHONE-LANGUAGE': params['PHONE_LANGUAGE'],
          'PHONE-NETWORK': params['PHONE_NETWORK'],
          'PHONE-MAC': params['PHONE_MAC'],
          'APP-VERSION': params['APP_VERSIONS'],
          ROOTED: params['ROOTED'],
          'APP-TYPE': params['APP-TYPE'],
          TOKEN: encodeURIComponent(rsaUtill.encrypt(params['TOKEN_ID']))
        }
      };
    },
    mode: 'cors',
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
      const str = DES3.decrypt(rsaUtill.decrypt(key),data);
      const result = JSON.parse(str)
      return result;
    }
  });

  moment.locale('zh-cn');



  /**
   * 启用全埋点
   */
  // window.sa = sa;
  // sa.init({
  //   server_url: !window.location.href.includes('mpmw.vbill.cn') ? 'https://sc.vbill.cn/sa?project=MPOS_TEST' : 'https://sc.vbill.cn/sa?project=SXF_PLUS',
  //   heatmap: {
  //     // 是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
  //     clickmap: 'default',
  //     // 是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
  //     scroll_notice_map: 'default',
  //     is_single_page: true
  //   },
  //   show_log: false
  // });
  // window.onload = () => sa.quick('autoTrack', {
  //   platForm: 'h5',
  //   $screen_name: '信用卡管理',
  //   $title: '信用卡管理首页'
  // });
  // historyApi.listen(() => {
  //   // 单页应用设置，pageview数据采集
  //   sa.quick('autoTrackSinglePage', {
  //     platForm: 'h5',
  //     $screen_name: '信用卡管理',
  //     $title: document.title
  //   });
  // });

};
