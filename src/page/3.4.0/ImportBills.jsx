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
import { goResult } from "../../utils/util";
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
  *   @methodName 跳转结果页面
  *   @params  loginType: '01' 网银， 03 邮箱 status: 1 是成功 2是无数据 3是失败
  *   @description loginType 账单导入方式 status 账单导入结果 description 账单导入结果描述
  */
  goResult(loginType, status, description){
    if(status == 1){
      if(loginType == '01'){
        this.props.history.push('/result/cybersuccess',{
          result:description
        })
      } else if(loginType == '03'){
        this.props.history.push('/result/esuccess',{
          result:description
        })
      }
    } else if(status == 2){
      if(loginType == '01'){
        this.props.history.push('/result/cybernodata',{
          result:description
        })
      } else if(loginType == '03'){
        this.props.history.push('/result/enodata',{
          result:description
        })
      }
    }else if(status == 3) {
      if(loginType == '01'){
        this.props.history.push('/result/cyberfailed',{
          result:description
        })
      } else if(loginType == '03'){
        this.props.history.push('/result/efailed',{
          result:description
        })
      }
    }
  }

  /**
  *   @author jerryxu
  *   @methodName 邮箱账单更新
  *   @params v 用户信息
  *   @description
  */

  billDetail = (v) => {
    const { account = '@', password, emailType } = v;
    const type = account.split('@')[1];
    JSBridge.invoke('emailImport', response => {
      debugger;
      const {
        errorCode,
        errorMsg,
        result,
        moxieData,
      } = response;
      if(result === 'SUCCESS'){
        goResult('03',1,'导入成功',this.props)
      } else if(result === 'FAIL'){
        goResult('03',3,errorMsg,this.props)
      } else if(result === 'CANCEL'){

      }
    }, {
      type: "update",
      userInfo: {
        mailName: emailType,
        accountName: account,
        password: password
      }
    });
  }

  getEmailAccount = () => {
    this.props.history.push('/3.4.0/email/EmailManager');
  }
  /**
  *   @author jerryxu
  *   @methodName 新建邮箱账单导入
  */
  importEmail = () => {

    JSBridge.invoke('emailImport', response => {
      const {
        errorCode,
        errorMsg,
        result,
        moxieData,
      } = response;
      if(result === 'SUCCESS'){
        goResult('03',1,'导入成功',this.props);
      } else if(result === 'FAIL'){
        goResult('03',1,errorMsg,this.props);
      } else if(result === 'CANCEL'){

      }
    }, {
      type: "add",
      userInfo: {
        mailName: "",
        accountName: "",
        password: ""
      }
    });
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
          const {
            errorCode,
            errorMsg,
            result,
            moxieData,
          } = response;
          if(result === 'SUCCESS'){
            goResult('01',1,'导入成功',this.props)
          } else if(result === 'FAIL'){
            goResult('01',3,errorMsg,this.props)
          } else if(result === 'CANCEL'){

          }
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

  /**
  *   @author jerryxu
  *   @methodName 新建网银账单
  */
  netSilverList = () => {
    JSBridge.invoke('bankImport', response => {
      const {
        errorCode,
        errorMsg,
        result,
        moxieData,
      } = response;
      if(result === 'SUCCESS'){
        goResult('01',1,'导入成功',this.props)
      } else if(result === 'FAIL'){
        goResult('01',3,errorMsg,this.props)
      } else if(result === 'CANCEL'){

      }
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
      if (k <= 7) return (<CardList echoData={v} key={v.name} bankCardLogin={this.cardLogin}/>)
      if (k === 8) return (
        <CardList echoData={moreIcon} key={moreIcon.name} bankCardLogin={this.showBankAll}/>)
      else return null;
    })
    const cardListAll = bankList.map((v) =><CardList echoData={v} key={v.name} bankCardLogin={this.cardLogin}/>)

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