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
