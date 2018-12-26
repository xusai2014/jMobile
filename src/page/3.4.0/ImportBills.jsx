import React from 'react';
import Header from '../../compoents/Header';
import PayMethodList from './components/PayMethodList';
import CardList from './components/CardList';
import AllCount from './components/AllCount';
import styles from './ImportBills.less';
import { getBankList, getEchoForm, getEmailList } from "../../actions/reqAction";
import { InitDecorator } from "../../compoents/InitDecorator";
import { Toast } from "antd-mobile";
import { jsNative } from 'sx-jsbridge';

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
      accountList: [],
    }
  }

  async componentWillMount() {
    this.props.dispatch(getBankList()).then((result) => {
    }, (err) => {
    });
    this.props.dispatch(getEmailList()).then((result) => {
      const { data = [] } = result;
      this.setState({
        accountList: data,
      })
    }, (err) => {
    });
  }

  billDetail = (v) => {
    JSBridge.invoke('emailImport', response => {

    }, {
      type: "update",
      userInfo: {
        mailName: "163.com",
        accountName: "18800102517@163.com",
        password: "shizhibuyu@163.com"
      }
    });
  }

  getEmailAccount = () => {
    this.props.history.push('/email/manager');
  }

  importEmail = () => {

    JSBridge.invoke('emailImport', response => {

    }, {
      type: "add",
      userInfo: {
        mailName: "",
        accountName: "",
        password: ""
      }
    });
  }

  WriteBillByHand = () => {

  }

  cardLogin = (abbr) => {

    this.props.dispatch(getEchoForm({ bankName: abbr })).then((result) => {
      if (result) {
        const { data = [] } = result;
        const userInfo = data.map((v, k) => {
          const {
            bankLoginType,
            password,
            username,
            uuid,
          } = v;
          let [nameVal, username1] = username.split(username.indexOf(','))
          return {
            loginType: bankLoginType,
            name: nameVal,
            name1: username1,
            password: password,
            uuid,
          }
        })
        JSBridge.invoke('bankImport', response => {
        }, {
          type: "update",
          runModel: "foreground",
          bankCode: abbr,
          userInfo,
        });

      }
    }, (err) => {
    })
  }
  netSilverList = () => {
    JSBridge.invoke('bankImport', response => {
    }, {
      type: "add",
      userInfo: []
    });
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
    const { echoData = [], bankList = [] } = this.props;
    const { showAllBank, accountList } = this.state;
    const moreIcon = { logo_uri: '/static/img/3.4.0/more@2x.png', name: '全部银行' }
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
    const cardList = bankList.map((v, k) => {
      const cond = !!((k + 1) % 3 == 0);
      if (k <= 7) return (this.cardListLayout(cond, v))
      if (k === 8) return (
        <CardList echoData={moreIcon} key={moreIcon.name} noMarginRight={true} bankCardLogin={this.showBankAll}/>)
      else return null;
    })
    const cardListAll = bankList.map((v, k) => {
      const condition = !!((k + 1) % 3 == 0);
      return (this.cardListLayout(condition, v));
    })

    return (
      <div className={styles.container} style={{ minHeight: gloablMinHeight }}>
        <Header title="添加账单"/>
        <PayMethodList echoData={sourceData[0]} exportEmail={this.importEmail} key={sourceData[0].name}/>
        <div className={styles.accountInfo}>
          <AllCount accountList={accountList}
                    getEmailAccount={this.getEmailAccount}
                    billProcess={this.billDetail}
          />
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