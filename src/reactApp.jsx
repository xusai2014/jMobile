import 'babel-polyfill';//必须放在头部解决，React16 语法不兼容问题
import { Provider } from 'react-redux'
import Router from 'react-router-dom/Router';
import createBrowserHistory from 'history/createBrowserHistory';
import store from './store';
import ReactDOM from 'react-dom';
import React from 'react';
import Routers from './router';
import FixedContent from './compoents/FixedContent';
import uam from './utils/deviceMark';//ua mark
import { fetchPromise, PromiseList } from './utils/fetch-middleware';
import sa from 'sa-sdk-javascript';
import Storage from './store'
/*
 * whatwg 是fetch API的统一版本，在不支持fetch的浏览器中处理兼容问题，同时引入轻量的promise库
 * */
import 'whatwg-fetch';

import Promise from 'promise-polyfill';
import {initJSBridge, jsNative, nativeJs} from 'sx-jsbridge';
import './style.less';

// To add to window, 定义全局变量
if (!window.Promise) {
  window.Promise = Promise;
}
window.fetchPromise = fetchPromise;
window.promiseList = new PromiseList();
window.uam = uam;
window.sa = sa;

if (module.hot) {
  module.hot.accept();
}
/**
* 初始化js briadge, True 表示启用 Mock 模式， TOKEN_ID 是自定义用户身份凭证
*/
initJSBridge(false,{TOKEN_ID:"2c05565c36ae48b69ebbab43eb3801a6"});

const historyAPi = createBrowserHistory()

/**
*  用户状态发生变化后，同步用户信息，跟新页面视图
*/
nativeJs.informLoginStatus(() => {
  jsNative.nativeRequestBaseParams().then((reqParams) => {
    window.location.href = '/home/index'
    Storage.dispatch({type:'syncData',data:reqParams})
  })
});

/**
 *  神策数据统计，初始化
 */
sa.init({
  server_url: process.env.mode != 'production' ? 'https://sc.vbill.cn/sa?project=MPOS_TEST' : 'https://sc.suixingpay.com/sa?project=MPOS_PROD',
  heatmap: {
    //是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
    clickmap: 'default',
    //是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
    scroll_notice_map: 'default',
    show_log: true,
    is_single_page: true,

  }
});
/**
 * 启用全埋点
 */
sa.quick('autoTrack',{
  platForm:'h5',
  $screen_name:"信用卡管理",
  $title:"首页",
});

const unlisten = historyAPi.listen((location, action) => {
  //单页应用设置，pageview数据采集
  sa.quick('autoTrackSinglePage',{
    platForm:'h5',
    $screen_name:"信用卡管理",
    $title:document.title,
  });
});

const reactRender = ()=> {
  ReactDOM.render(<Provider store={store}><Router history={historyAPi}><FixedContent><Routers /></FixedContent></Router></Provider>, document.getElementById('content'))
}

if (JSBridge) {
  JSBridge.register('rebuild', reactRender)
}
window.reactRender = reactRender;

reactRender();
