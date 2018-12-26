/*
*   @author jerryxu
*   @description 此文件由自动生成，不允许修改！！！！
*/
import React from 'react';
import { Switch,Route} from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from '../compoents/Loading';
import NoMatch from '../page/NoMatch';
export default ()=>(<Switch><Route exact={false} path={'/home/index'} component={ Loadable({loader: () => import('../page/home/Index.jsx'),loading: Loading,})} />
<Route exact={false} path={'/cards/cardslist'} component={ Loadable({loader: () => import('../page/cardsPackage/CardsList.jsx'),loading: Loading,})} />
<Route exact={false} path={'/result/:type'} component={ Loadable({loader: () => import('../page/result/Result.jsx'),loading: Loading,})} />
<Route exact={false} path={'/load/:type'} component={ Loadable({loader: () => import('../page/result/LoadingStatus.jsx'),loading: Loading,})} />
<Route exact={false} path={'/cards/edit'} component={ Loadable({loader: () => import('../page/cardsPackage/EditCard.jsx'),loading: Loading,})} />
<Route exact={false} path={'/bill/method'} component={ Loadable({loader: () => import('../page/bill/MethodList.jsx'),loading: Loading,})} />
<Route exact={false} path={'/bill/cardlist'} component={ Loadable({loader: () => import('../page/bill/BankCardList.jsx'),loading: Loading,})} />
<Route exact={false} path={'/manual/handlebill'} component={ Loadable({loader: () => import('../page/manual/HandleBill.jsx'),loading: Loading,})} />
<Route exact={false} path={'/manual/add'} component={ Loadable({loader: () => import('../page/manual/AddBill.jsx'),loading: Loading,})} />
<Route exact={false} path={'/email/manager'} component={ Loadable({loader: () => import('../page/email/EmailManager.jsx'),loading: Loading,})} />
<Route exact={false} path={'/email/add'} component={ Loadable({loader: () => import('../page/email/EmailAdd.jsx'),loading: Loading,})} />
<Route exact={false} path={'/bill/detail/:billId'} component={ Loadable({loader: () => import('../page/bill/BillDetail.jsx'),loading: Loading,})} />
<Route exact={false} path={'/cyber/login/:bankId'} component={ Loadable({loader: () => import('../page/cyber/CyberBank.jsx'),loading: Loading,})} />
<Route exact={false} path={'/3.4.0/importbills'} component={ Loadable({loader: () => import('../page/3.4.0/ImportBills.jsx'),loading: Loading,})} />
<Route exact={false} path={'/3.4.0/choosebank'} component={ Loadable({loader: () => import('../page/3.4.0/ChooseBank.jsx'),loading: Loading,})} />
<Route exact={false} path={'/3.4.0/email/emailadd'} component={ Loadable({loader: () => import('../page/3.4.0/email/EmailAdd.jsx'),loading: Loading,})} />
<Route exact={false} path={'/3.4.0/email/EmailManager'} component={ Loadable({loader: () => import('../page/3.4.0/email/EmailManager.jsx'),loading: Loading,})} />
<Route exact={false} path={'/3.4.0/bankcardlist'} component={ Loadable({loader: () => import('../page/3.4.0/BankCardList.jsx'),loading: Loading,})} />
<Route component={NoMatch}/></Switch>)