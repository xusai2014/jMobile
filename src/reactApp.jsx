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
initJSBridge(true,{TOKEN_ID:"0f9487276da1451c9ea54428e2316af2"});

nativeJs.informLoginStatus(() => {
  jsNative.nativeRequestBaseParams().then((reqParams) => {
    Storage.dispatch({type:'syncData',data:reqParams})
  })
});

sa.init({
  server_url: process.env.mode != 'production' ? 'https://sc.suixingpay.com/sa?project=MPOS_TEST' : 'https://sc.suixingpay.com/sa?project=MPOS_PROD',
  heatmap: {
    //是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
    clickmap: 'not_collect',
    //是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
    scroll_notice_map: 'not_collect',
    show_log: true,
    is_single_page: true,

  }
});

function reactRender() {
  ReactDOM.render(<Provider store={store}><Router history={createBrowserHistory()}><FixedContent><Routers /></FixedContent></Router></Provider>, document.getElementById('content'))
}

if (JSBridge) {
  JSBridge.register('rebuild', reactRender)
}

reactRender();
