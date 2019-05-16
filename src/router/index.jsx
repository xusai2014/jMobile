/*
*   @author jerryxu
*   @description 此文件由自动生成，不允许修改！！！！
*/
import React from 'react';
import { Switch,Route} from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from '../compoents/Loading';
import NoMatch from '../page/NoMatch';
export default ()=>(<Switch><Route exact={false} path={'/myapp/index'} component={ Loadable({loader: () => import('../page/home/Home.jsx'),loading: Loading,})} />
<Route component={NoMatch}/></Switch>)