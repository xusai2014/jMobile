/*
*   @author jerryxu
*   @description 此文件由自动生成，不允许修改！！！！
*/
import React from 'react';
import { Switch,Route} from 'react-router-dom';
import pathList from './config';
import Loadable from 'react-loadable';
import Loading from '../compoents/Loading';
import HomeIndex from '../page/home/Index.jsx';
import CardsList from '../page/cardsPackage/CardsList.jsx';

export default ()=>(<Switch><Route exact={false} path={'/home/index'} component={HomeIndex} />
<Route exact={false} path={'/cards/cardslist'} component={CardsList} />
</Switch>)