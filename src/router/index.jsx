/*
*   @author jerryxu
*   @description 此文件由自动生成，不允许修改！！！！
*/
import React from 'react';
import { Switch,Route} from 'react-router-dom';
import pathList from './config';
import Loadable from 'react-loadable';
import Loading from '../compoents/Loading';
export default ()=>(<Switch><Route exact={false} path={'/home/index'} component={ Loadable({loader: () => import('../page/home/Index.jsx'),loading: Loading,})} />
<Route exact={false} path={'/cards/cardslist'} component={ Loadable({loader: () => import('../page/cardsPackage/CardsList.jsx'),loading: Loading,})} />
<Route exact={false} path={'/result/:type'} component={ Loadable({loader: () => import('../page/result/Result.jsx'),loading: Loading,})} />
<Route exact={false} path={'/cards/edit'} component={ Loadable({loader: () => import('../page/cardsPackage/EditCard.jsx'),loading: Loading,})} />
</Switch>)