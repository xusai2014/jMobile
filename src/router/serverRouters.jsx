/*
*   @author jerryxu
*   @description 此文件由自动生成，不允许修改！！！！
*/
import React from 'react';
import { Switch,Route} from 'react-router-dom';
import HomeIndex from '../page/home/Index.jsx';
import CardsList from '../page/cardsPackage/CardsList.jsx';
import Result from '../page/result/Result.jsx';
import LoadingStatus from '../page/result/LoadingStatus.jsx';
import CardsEdit from '../page/cardsPackage/EditCard.jsx';
import BillMethodList from '../page/bill/MethodList.jsx';
import BankCardList from '../page/bill/BankCardList.jsx';
import HandleBill from '../page/manual/HandleBill.jsx';
import AddBill from '../page/manual/AddBill.jsx';
import EmailManager from '../page/email/EmailManager.jsx';
import EmailAdd from '../page/email/EmailAdd.jsx';
import BillDetail from '../page/bill/BillDetail.jsx';
import CyberBank from '../page/cyber/CyberBank.jsx';

export default ()=>(<Switch><Route exact={false} path={'/home/index'} component={HomeIndex} />
<Route exact={false} path={'/cards/cardslist'} component={CardsList} />
<Route exact={false} path={'/result/:type'} component={Result} />
<Route exact={false} path={'/load/:type'} component={LoadingStatus} />
<Route exact={false} path={'/cards/edit'} component={CardsEdit} />
<Route exact={false} path={'/bill/method'} component={BillMethodList} />
<Route exact={false} path={'/bill/cardlist'} component={BankCardList} />
<Route exact={false} path={'/manual/handlebill'} component={HandleBill} />
<Route exact={false} path={'/manual/add'} component={AddBill} />
<Route exact={false} path={'/email/manager'} component={EmailManager} />
<Route exact={false} path={'/email/add'} component={EmailAdd} />
<Route exact={false} path={'/bill/detail/:billId'} component={BillDetail} />
<Route exact={false} path={'/cyber/login/:bankId'} component={CyberBank} />
</Switch>)