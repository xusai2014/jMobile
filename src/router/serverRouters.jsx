/*
*   @author jerryxu
*   @description 此文件由自动生成，不允许修改！！！！
*/
import React from 'react';
import { Switch,Route} from 'react-router-dom';
import NoMatch from '../page/NoMatch';
import MyappIndex from '../page/home/Home.jsx';
import ExchangeRecord from '../page/exchangeRecord/ExchangeRecord.jsx';

export default ()=>(<Switch><Route exact={false} path={'/myapp/index'} component={MyappIndex} />
<Route exact={false} path={'/myapp/exchangeRecord'} component={ExchangeRecord} />
<Route component={NoMatch}/></Switch>)