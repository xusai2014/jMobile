// @flow
import sa from 'sa-sdk-javascript';
import Promise from 'promise-polyfill';
import { initJSBridge, jsNative, nativeJs } from 'sx-jsbridge';
import type { BrowserHistory } from 'history/createBrowserHistory';
import { fetchPromise, PromiseList } from './fetch-middleware';
import uam from './deviceMark';// ua mark
import * as moment from 'moment';

export default (historyApi: BrowserHistory, store: any) => {
  // To add to window, 定义全局变量
  if (!window.Promise) {
    window.Promise = Promise;
  }
  if (!window.$) {
    window.$ = {};
  }
  window.fetchPromise = fetchPromise;
  window.promiseList = new PromiseList();
  window.uam = uam;
  window.sa = sa;

  moment.locale('zh-cn');
  /**
   * 初始化js briadge, True 表示启用 Mock 模式， TOKEN_ID 是自定义用户身份凭证
   */
  initJSBridge(false, { TOKEN_ID: '2c05565c36ae48b69ebbab43eb3801a6' });
  /**
   *  用户状态发生变化后，同步用户信息，跟新页面视图
   */
  nativeJs.informLoginStatus(() => {
    jsNative.nativeRequestBaseParams().then((reqParams) => {
      window.location.href = '/home/index'
      store.dispatch({ type: 'syncData', data: reqParams });
    });
  });

  /**
   *  神策数据统计，初始化
   */
  sa.init({
    server_url: process.env.mode !== 'production' ? 'https://sc.vbill.cn/sa?project=MPOS_TEST' : 'https://sc.vbill.cn/sa?project=SXF_PLUS',
    heatmap: {
      // 是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
      clickmap: 'default',
      // 是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
      scroll_notice_map: 'default',
      is_single_page: true
    },
    show_log: false
  });

  /**
   * 启用全埋点
   */
  window.onload = () => sa.quick('autoTrack', {
    platForm: 'h5',
    $screen_name: '信用卡管理',
    $title: '信用卡管理首页'
  });
  historyApi.listen(() => {
    // 单页应用设置，pageview数据采集
    sa.quick('autoTrackSinglePage', {
      platForm: 'h5',
      $screen_name: '信用卡管理',
      $title: document.title
    });
  });
};
