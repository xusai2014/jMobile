import 'babel-polyfill';// 必须放在头部解决，React16 语法不兼容问题
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import store from './store';
import Routers from './router';
import FixedContent from './compoents/FixedContent';
import './style/style.less';
import 'moment/locale/zh-cn';
import initFunc from './utils/init';

const historyAPi = createBrowserHistory();
/**
 *   @author jerryxu
 *   初始化系统方法
 */
initFunc(historyAPi, store);
const container: HTMLElement | null = document.getElementById('content');

if (container !== null) {
  if (container.hasChildNodes()) {
    ReactDOM.hydrate(
      <Provider store={store}>
        <Router history={historyAPi}>
          <FixedContent>
            <Routers />
          </FixedContent>
        </Router>
      </Provider>,
      container,
    );
  } else {
    ReactDOM.render(
      <Provider store={store}>
        <Router history={historyAPi}>
          <FixedContent>
            <Routers />
          </FixedContent>
        </Router>
      </Provider>,
      container,
    );
  }
}
