import React from 'react';
import Header from '../../compoents/Header';
import PayMethodList from './components/PayMethodList';
import CardList from './components/CardList';
import AllCount from './components/AllCount';
import styles from './ImportBills.less';
import { getBankList, getEchoForm, getEmailList } from "../../actions/reqAction";
import { InitDecorator } from "../../compoents/InitDecorator";
import { addBank, addEmail, updateBankForeground, updateEmail } from "../../utils/BillSpider";
import DebounceButton from "../../compoents/DebounceButton"

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
    // 数据初始化
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

  /**
  *   @author jerryxu
  *   @methodName 邮箱账单更新
  *   @params v 用户信息
  *   @description
  */

  billDetail = (v) => {
    updateEmail(v,this.props);
  }

  getEmailAccount = () => {
    this.props.history.push('/3.4.0/email/EmailManager');
  }
  /**
  *   @author jerryxu
  *   @methodName 新建邮箱账单导入
  */
  importEmail = () => {
    addEmail(this.props);
  }

  // 手写账单跳转
  WriteBillByHand = () => {
    this.props.history.push('/manual/add')
  }
  /**
  *   @author jerryxu
  *   @methodName 指定银行网银账单导入
  *   @params abbr 银行编码
  *   @description 需要先拿到用户信息
  */
  cardLogin = (abbr) => {

    this.props.dispatch(getEchoForm({ bankName: abbr })).then((result) => {
      if (result) {
        const { data = [] } = result;
        const userInfo = data.map((v, k) => {
          const {
            bankLoginType,
            password,
            unMosaicUsername,
            uuid,
          } = v;
          let [nameVal, username1] = unMosaicUsername.split(unMosaicUsername.indexOf(','))
          return {
            loginType: bankLoginType,
            name: nameVal,
            name1: username1,
            password: password,
            uuid,
          }
        })
        updateBankForeground(abbr,userInfo,this.props);
      }
    }, (err) => {
    })
  }

  /**
  *   @author jerryxu
  *   @methodName 新建网银账单
  */
  netSilverList = () => {
    addBank(this.props);
  }

  showBankAll = () => {
    this.setState(
      {
        showAllBank: true
      }
    )
  }
  cardListShow = (conditon,v) => {
    if(conditon) return <CardList echoData={v} key={v.name}  addStyle={true} bankCardLogin={this.cardLogin}/>
    else return <CardList echoData={v} key={v.name} bankCardLogin={this.cardLogin}/>
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
      const cond=(k+1)%3;
      if (k <= 7) {return (this.cardListShow(!cond,v))}
      if (k === 8) return (
        <CardList echoData={moreIcon} key={moreIcon.name} bankCardLogin={this.showBankAll} addStyle={true}/>)
      else return null;
    })
    const cardListAll = bankList.map((v,k) =>{
      const cond=(k+1)%3;
      return (this.cardListShow(!cond,v));
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
        <DebounceButton onClick={this.netSilverList} className={styles.checkBill} activeOpen={true} activeClassName={styles.active}>
          <div className={styles.Content}>
            <span className={styles.text}>
                <span className={styles.contentName}>
                 通过网银查询账单
                </span>
                <span className={styles.contentDescribe}>
                    实时获取账单、额度、消费明细、积分信息
                </span>
            </span>
            <img src="/static/img/3.4.0/goNext.png"/>
          </div>
        </DebounceButton>
        <div className={styles.cardList}>
          <div className={styles.firstLine}>
            {showAllBank ? cardListAll : cardList}
          </div>
        </div>
      </div>
    )
  }
}

