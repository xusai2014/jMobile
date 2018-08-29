import React from 'react';
import {Modal, Icon} from 'antd-mobile'
import BillCard from "./BillCard";
import Popup from "./components/Popup";
import {InitDecorator} from "../../compoents/InitDecorator";
import FreeItem from "./components/FreeItem";
import {
  getBillList, getFreeInterest, getIndetiyInfo,
  getActivities
} from "../../actions/reqAction";
import {jsNative,} from "sx-jsbridge";
import {judgeEnv} from "../../utils/util";
import globalStyle from "../../style";
const {loginHelper, nativeOpenNewWebView} = jsNative;
const { alert } = Modal;


@InitDecorator((state) => {
  return {
    billList: state.BillReducer.billList,
    huandaoData: state.BillReducer.huandaoData,
    freeIntrestData: state.BillReducer.freeIntrestData,
    activities: state.CardsReducer.activities,
    examineAccount:state.CardsReducer.examineAccount,
  }
})
export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interestShow: false, //免息期弹窗展示,
      visible: false,//弹出框
      sycnModal:false,
      authSts:'-1',
      freeItems:false,
      examineAccount:true
    }
  }

  generateStr(v){
    let unit = '';
    let ba = v;
    if(v/10000 >= 1){
      ba =v/10000
      unit= '万';
    } else if(v/1000>=1){
      ba =v/1000;
      unit= '千';
    }
    return <span>{ba.toFixed(2)}<span style = {styles.unitStyle}>{unit}</span></span>
  }

  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  }

  componentWillMount() {
    if (this.props.isLogged) {
      this.initData()
    }
  }

  initData(){
    this.getUserInfo();
    this.getBillList();
    this.props.dispatch(getActivities()).then(() => {
    }, () => {
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLogged && this.props.isLogged != nextProps.isLogged) {
      this.initData();
    }
  }

  getUserInfo() {
    this.props.dispatch(getIndetiyInfo({
      appType: 'mpos'
    })).then((result) => {
      const {data} = result;
      const {authSts,MERC_SN = ''} = data;
      this.setState({
        authSts: authSts,
        examineAccount:MERC_SN != '700000000620451'
      })
    }, () => {
    })
  }

  async getFreeData() {
    const reqParams = await this.props.getBaseParams();
    this.props.dispatch(getFreeInterest({
      ...reqParams
    })).then((result) => {
      this.setState({freeItems:true})
    }, () => {
    })
  }

  async getBillList() {
    const reqParams = await this.props.getBaseParams();
    this.props.dispatch(getBillList({
      ...reqParams
    }))
  }

  openCardMarket(){
    let url = '';
    if(window.location.host.indexOf('mpmw.vbill.cn')>-1 ){
      url = `https://cca.vbill.cn/cca/home?source=creditCard`
    } else {
      url = `https://mpcw${judgeEnv()}.vbill.cn/cca/home?channelId=1000&source=creditCard`
    }
    nativeOpenNewWebView({
      url
    })
  }

  identifyFunc(callback){
    this.props.dispatch(getIndetiyInfo({
      appType: 'mpos'
    })).then((result) => {
      const {data} = result;
      const {authSts} = data;
      //  authSts 99:未认证，01：已认证，02：驳回，00：审核中
      if(authSts == '01'){
        callback();
      } else if( authSts == '-1') {
        //数据尚未装载完毕不处理
      } else if(authSts == '99') {
        alert(<span className="alert_title">您尚未通过实名认证，请先进行实名认证</span>,'',[
          {text:"取消",onPress:()=>{},style: globalStyle.cancelStyle},
          {text:"去认证",onPress:()=>{jsNative.nativeGoRealName();},style: globalStyle.sureStyle},
        ])
      } else {
        jsNative.nativeGoRealName();
      }
      this.setState({
        authSts: authSts
      })
    }, () => {
    })


  }

  loginEnter(type, params) {
    loginHelper(() => {
      const {authSts} = this.state;
      switch (type) {
        case 1:
          //展示免息期
          this.setState({interestShow: true}, () => {
            this.getFreeData()
          });
          return;
        case 2:
          //添加账单
          this.identifyFunc(()=>this.props.history.push('/bill/method'))
          return;
        case 3:
          //进入卡包
          this.identifyFunc(()=>{
            const {action: url} = params
            this.props.history.push(url);
          })
          return;
        case 4:
          //进入办卡中心
          this.openCardMarket();
          return;
        case 5:
          //还款
          this.setState({visible: true})
          return;
      }
    })
  }

  example = [{
    card_num: "2886",
    bank_name: "招商银行",
    bill_type: 'UNDONE',
    current_bill_remain_amt: "4800.56",
    payment_due_date: moment().format('YYYY-MM-DD'),
    task_id: "11111111111",
    bill_id: "11111111",
    bill_date: moment().format('YYYY-MM-DD'),
    logo_uri: '/static/img/招商银行@2x.png',
    importBillType: "",
    isNew: '00',
    abbr:"CMB",
    update_time:"2018-06-06",
    real:false,
  }]

  render() {
    const {interestShow, visible,freeItems, sycnModal,authSts,} = this.state;
    const { examineAccount } =this.props;
    const {isLogged, billList = {}, freeIntrestData = [], activities = []} = this.props;
    const {waitPaymentAmount = '0.00', waitPaymentNumber = '0', baseResponseBillDtoList} = billList
    return [<div key={'a'} style={{background: '#FFFFFF', paddingBottom: "0.5rem"}}>
      <div style={styles.top}>
        <div style={styles.topText}>7日内待还
          <span style={styles.topSubText}>
          {isLogged ? (waitPaymentNumber?waitPaymentNumber:0) : '--'}笔
          </span>
        </div>
        <img onClick={() => {
          this.loginEnter(1)
        }} style={styles.img} src="/static/img/canlendar@2x.png"/>
        <div onClick={() => {
          this.loginEnter(2)
        }} style={styles.icon}><img src="/static/img/indexadd@2x.png" style={{height: '0.36rem',color:'#000'}} /></div>
      </div>
      <div style={{marginTop: "0.19rem"}}>
        <span style={styles.moneyStyle}>{isLogged ? (waitPaymentAmount?parseFloat(waitPaymentAmount).toFixed(2):0.00) : '--'}
          <span style={styles.unitStyle}>元</span>
        </span>
      </div>
      <div style={styles.cover}>
        {
          this.icons.map((v, k) => {
            const {img, text, action, type} = v;
            if (!isLogged && type == '1') {
              return null
            }
            if(examineAccount && type == '1'){
              return null
            }
            return <div key={k} onClick={() => {
              if (type == '0') {
                this.loginEnter(3, {action})
              } else if (type == '1') {
                this.loginEnter(4, {action})
              }
            }}>
              <span style={styles.iconItem} >
                <img src={img} style={{width: '0.65rem'}}/>
              </span>
              <div style={styles.textStyle}>
                {text}
              </div>
            </div>
          })
        }
      </div>
      <div style={{
        boxShadow: 'rgba(115, 125, 255, 0.53) 0rem 0.37rem 0.27rem',
        width: '6.48rem',
        margin: '-0.35rem auto auto',
        height: '0.1rem',
      }}></div>
      <div style={styles.activity}>
        {isLogged ?(!this.props.examineAccount? [1,2,3,4].map((v, k) => {
          const {logoUri = '', gameUri, gameName = ''} = activities[k]?activities[k]:{};
          return <div onClick={() => {
            if(gameUri.indexOf('site=oldweb')>0){
              jsNative.nativeOpenOldWebView({url:gameUri},()=>{})
            } else {
              jsNative.nativeOpenNewWebView({url:gameUri},()=>{})
            }

          }} key={k} style={{display: "inline-block", textAlign: 'center'}}>
            <img style={{width: '0.74rem',height:'0.74rem'}} src={logoUri}/>
            <div style={{fontWeight: 'bold',}}>{gameName}</div>
          </div>
        }):null) : null
        }
      </div>
    </div>,
      <div key={'b'}>
        {
          isLogged ?
            (baseResponseBillDtoList?
            (baseResponseBillDtoList.length == 0?
              this.example:baseResponseBillDtoList).map((v, k) => {
              const {
                card_num,
                bank_name,
                bill_type,//账单状态
                current_bill_remain_amt,//本期账单总金额
                payment_due_date,//还款日
                bill_date,
                task_id,
                bill_id,// 账单编号,
                logo_uri,
                importBillType,//账单类型 01为网银 03为邮箱 02为手写账单
                isNew,
                abbr,
                real= true,
                update_time,
              } = v;
              return <BillCard card_num={card_num}
                               bank_name={bank_name}
                               bill_type={bill_type}
                               current_bill_remain_amt={current_bill_remain_amt}
                               payment_due_date={payment_due_date}
                               task_id={task_id}
                               bill_id={bill_id}
                               bill_date={bill_date}
                               logo_uri={logo_uri}
                               importBillType={importBillType}
                               real={real}
                               isLogged={isLogged}
                               isNew={isNew}
                               abbr={abbr}
                               key={k}
                               repay={(e) => {
                                  e.stopPropagation()
                                  this.setState({visible: true})
                               }}
                               examineAccount={examineAccount}
                               authSts={authSts}
                               update_time ={ update_time }
                               importModal={()=>{this.setState({sycnModal:true})}}
                               updateData = {()=>this.initData()}
              />
            }):null)
            :
            this.example.map((v, k) => <BillCard
              authSts={authSts}
              examineAccount={examineAccount}
              isLogged={isLogged}
              {...v} key={k} repay={(e) => {
              e.stopPropagation();
              e.preventDefault();
              this.loginEnter(5)
            }}/>)
        }
      </div>,
      <div key={'c'} style={styles.addBtn}
           onClick={() => this.loginEnter(2)}
      >
        <img style={{ color:"#999999",height:"0.25rem"}} src="/static/img/addCard@2x.png" />
        <span style={styles.addText}>添加信用卡账单</span>

      </div>,<div>{
        (isLogged && !examineAccount)?<div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin:'0.82rem 0 1.56rem 0'
        }} onClick={()=>this.openCardMarket()}>
          <img src="/static/img/信用卡2x.png" style={{width: "0.41rem"}}/>
          <span style={{fontWeight: 'bold', lineHeight:'0.28rem',margin: '0.08rem', fontSize: '0.28rem', color: '#4C7BFE', letterSpacing: '0'}}>
          办信用卡
        </span>
          <img src="/static/img/Path 3@2x.png" style={{width: "0.1rem"}}/>
        </div>:null
      }</div>,
      <Modal
        style={{width:'6rem'}}
        key={'d'}
        visible={interestShow}
        transparent
        maskClosable={true}
        onClose={() => this.setState({interestShow: false})}
        title={<div style={{textAlign: 'left'}}>最长免息期</div>}
        wrapProps={{onTouchStart: this.onWrapTouchStart}}
        closable={true}
      >
        <div style={{height: '5.03rem', overflow: 'scroll'}}>
          {
            freeItems?(freeIntrestData.length == 0?<div style={{marginTop: '0.6rem'}}>
              <img style={{width:'1.55rem'}} src="/static/img/Bitmap@1x.png" />
              <div>未导入信用卡账单</div>
              <div>无记录查看</div>
            </div>
              :freeIntrestData.map((v, k) => {
              const {bank_logo: imgSrc, credit_limit, balance, bank_name, payment_due_date, card_number,bill_type} = v;
              const freeInterest = bill_type == 'DONE'? parseInt(moment(payment_due_date).diff(moment(), 'days')) + parseInt(moment().daysInMonth()):
                parseInt(moment(payment_due_date).diff(moment(), 'days'))
              return <FreeItem key={k}
                               credit_limit={credit_limit}
                               imgSrc={imgSrc}
                               title={bank_name}
                               card_number={card_number}
                               freeInterest={freeInterest}
                               balance={balance}
                               {...v}
              />
            })):null
          }
        </div>
      </Modal>,
      <Modal
        key="z"
        visible={sycnModal}
        transparent
        maskClosable={true}
        onClose={()=>{this.setState({sycnModal:false})}}
        wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        footer={[{ text: '我知道了', onPress: () => { this.setState({sycnModal:false})}}]}
      >
        <div style={{ height: 100, overflow: 'scroll' }}>
          <div style={{marginTop:"0.5rem",fontSize:"0.35rem",color:"#000"}} onClick={()=>this.props.history.push('/bill/method')}>请使用网银同步</div>
        </div>
      </Modal>
      , visible ?
        <Popup
          key="e"
          title="选择还款方式"
          visible={visible}
          setVisible={(v) => {
            this.setState({visible: v})
          }}
        />
        : null
    ]
  }


  icons = [{
    img: "/static/img/kabao@2x.png",
    text: "卡包",
    action: "/cards/cardslist",
    type: "0"
  }, {
    img: "/static/img/banka@2x.png",
    text: "办卡",
    action: "https://www.baidu.com",
    type: '1'
  }]

  activity = [{
    imgSrc: '/static/img/img_5049@2x.png',
    action: "",
    title: "等你抽奖"
  }, {
    imgSrc: '/static/img/img_5050@2x.png',
    action: "",
    title: "我的红包"
  }, {
    imgSrc: '/static/img/img_5051@2x.png',
    action: "",
    title: "免息35天"
  }, {
    imgSrc: '/static/img/img_5052@2x.png',
    action: "",
    title: "挖金币"
  }]

}

const styles = {
  container: {},
  topText: {
    fontSize: '0.3rem',
    color: '#999999',
    letterSpacing: "0",
    margin: '0rem 0 0 0.26rem',
    display: 'inline-block',
    fontWeight: 'bold',
  },
  img: {
    width: '0.33rem',
    margin: '0rem 0.48rem 0 3.725rem ',
    height: '0.36rem',
  },
  topSubText: {
    color: '#151515',
    textAlign: 'center',
    lineHeight: '0.42rem',
    marginLeft: '0.1rem',
    fontWeight: 'bold',
  },
  top: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '0.38rem',
  },
  icon: {
    margin: '0rem 0 0 0 ',
    display:'inline-block',
    height: '0.36rem',
  },
  cover: {
    backgroundImage: 'linear-gradient(-141deg, #5E86FF 6%, #564CFE 88%)',
    borderRadius: '0.2rem',
    width: '6.94rem',
    height: '1.84rem',
    margin: '0.26rem auto 0 auto',
    display: 'flex',
    justifyContent: 'space-around',
  },
  moneyStyle: {
    fontSize: '0.52rem',
    color: '#333333',
    letterSpacing: '0',
    textAlign: 'center',
    marginLeft: '0.26rem',
    fontWeight: 'bold'
  }, unitStyle: {
    fontSize: '0.26rem',
    color: '#333333',
    letterSpacing: '0',
    textAlign: 'center',
    marginLeft: "0.045rem",
    fontWeight: 'bold',
  },
  iconItem: {margin: "0.4rem 0 0 0", display: 'inline-block'},
  textStyle: {fontSize: '0.3rem',fontWeight: 'bold', color: '#FFFFFF', letterSpacing: '0', textAlign: 'center'},
  activity: {display: "flex", justifyContent: "space-around", marginTop: "0.49rem"},
  addBtn: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    background: '#FFFFFF', height: '0.84rem', widht: '7.5rem', margin: "0.2rem 0 0 0"
  },
  addText: {
    fontSize: '0.28rem',
    color: '#999999',
    letterSpacing: '0',
    textAlign: 'center',
    marginLeft: '0.08rem',
    fontWeight: 'bold',
    lineHeight: '0.28rem',
  }
}

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}