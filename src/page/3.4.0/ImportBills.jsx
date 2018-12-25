import React from 'react';
import Header from '../../compoents/Header';
import PayMethodList from './components/PayMethodList';
import CardList from './components/CardList';
import AllCount from './components/AllCount';
import styles from './ImportBills.less';
import {directImport, getBankList, getEmailList} from "../../actions/reqAction";
import {InitDecorator} from "../../compoents/InitDecorator";
import {Toast} from "antd-mobile";

@InitDecorator((state) => {
    return {
        bankList: state.BillReducer.bankList,
        requestStaus: state.GlobalReducer.requestStaus
    }
})
export default class ImportBills extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAllBank: false,
            showAllCount: false,
            account: '',
            task_id: ''
        }
    }

    async componentWillMount() {
        this.props.dispatch(getBankList()).then((result) => {
        }, (err) => {
        });
        this.props.dispatch(getEmailList()).then((result) => {
            const {data = []} = result;
            if (data.length > 0) {
                this.setState({
                    showAllCount: true,
                    account: result.data[0].account,
                    task_id: result.data[0].task_id,
                })
            } else {
                this.setState({
                    showAllCount: false
                })
            }
        }, (err) => {
        });
    }
    billDetail = () => {
        const {task_id} = this.state;
        Toast.loading('请稍后', 0, null, true)
        if (this.props.requestStaus) {
            return;
        }
        this.props.dispatch(directImport({
            task_id,
        })).then((result) => {
            const {data: taskId = ''} = result;
            this.props.history.push('/load/email', {taskId, loginType: "03"})
            Toast.hide();
        }, (err) => {
            Toast.hide();
        });
    }
    getEmailAccount = () => {
        this.props.history.push('/email/manager');
    }
    importEmail = () => {
        this.props.dispatch(getEmailList({})).then((result) => {
            const {data = []} = result;
            if (data.length > 0) {
                this.props.history.push('/email/manager');
            } else {
                this.props.history.push('/email/add');
            }
        }, (err) => {
        });
    }
    WriteBillByHand = () => {
        this.props.history.push('/bill/cardlist');
    }
    cardLogin = () => {
        //TODO
        //跳转到对应网银的登录页面
    }
    netSilverList = () => {
        this.props.history.push('/3.4.0/choosebank');
    }
    showBankAll = () => {
        this.setState(
            {
                showAllBank: true
            }
        )
    }
    cardListLayout(condition, value) {
        if (condition) {
            return (<CardList echoData={value} key={value.name} noMarginRight={true} bankCardLogin={this.cardLogin}/>)
        } else {
            return (<CardList echoData={value} key={value.name} noMarginRight={false} bankCardLogin={this.cardLogin}/>)
        }
    }
    componentDidMount() {
    }

    render() {
        const {echoData = [], bankList = []} = this.props;
        const {showAllBank, showAllCount, account} = this.state;
        const moreIcon = {logo_uri: '/static/img/3.4.0/more@2x.png', name: '全部银行'}
        const {
            sourceData = [{
                img: "/static/img/email@2x.png",
                name: "邮箱导入",
                describe: "绑定账单后去邮箱，一键获取信用卡账单",
            }, {
                img: "/static/img/shoushu@2x.png",
                name: "手输账单",
                describe: "没有邮箱，网银账单？请手动输入账单",
            }]
        } = echoData;
        const allCountList = {email: account, des: '全部账号'};
        const cardList = bankList.map((v, k) => {
            const cond = !!((k + 1) % 3 == 0);
            if (k <= 7) return (this.cardListLayout(cond, v))
            if (k === 8) return (<CardList echoData={moreIcon} key={moreIcon.name} noMarginRight={true} bankCardLogin={this.showBankAll}/>)
            else return null;
        })
        const cardListAll = bankList.map((v, k) => {
            const condition = !!((k + 1) % 3 == 0);
            return (this.cardListLayout(condition, v));
        })
        return (
            <div className={styles.container} style={{minHeight: gloablMinHeight}}>
                <Header title="添加账单"/>
                <PayMethodList echoData={sourceData[0]} exportEmail={this.importEmail} key={sourceData[0].name}/>
                <div className={styles.accountInfo}>
                    {showAllCount ? <AllCount echoData={allCountList} getEmailAccount={this.getEmailAccount}
                                              billProcess={this.billDetail} key={allCountList.des}/> : null}
                </div>
                <PayMethodList echoData={sourceData[1]} exportEmail={this.WriteBillByHand} key={sourceData[1].name}/>
                <div className={styles.margin}></div>
                <div className={styles.Content}>
                    <div className={styles.text}>
                        <span className={styles.contentName} onClick={this.netSilverList}>
                        通过网银查询账单
                        </span>
                        <span className={styles.contentDescribe}>
                            实时获取账单、额度、消费明细、积分信息
                        </span>
                    </div>
                    <img src="/static/img/3.4.0/goNext.png" onClick={this.netSilverList}/>
                </div>
                <div className={styles.cardList}>
                    <div className={styles.firstLine}>
                        {showAllBank ? cardListAll : cardList}
                    </div>
                </div>
            </div>
        )

    }
}