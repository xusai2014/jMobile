import React from 'react';
import {Modal, Icon} from 'antd-mobile'
import BillCard from "./BillCard";
import Popup from "./components/Popup";
import {InitDecorator} from "../../compoents/InitDecorator";
import {loginHelper} from "../../interface/jsNative";
import FreeItem from "./components/FreeItem";
import {getBillList, getHUandao, getFreeInterest} from "../../actions/reqAction";


@InitDecorator((state)=>{
  return {
    billList:state.BillReducer.billList,
    huandaoData:state.BillReducer.huandaoData,
    freeIntrestData:state.BillReducer.freeIntrestData
  }
})
export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interestShow: false, //免息期弹窗展示,
      visible: false,//弹出框
    }
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

  async componentWillMount() {
    //const params = await this.props.getBaseParams();

    //fetchPromise('/api', 'POST', {
      //'TRDE_CODE': "M113",
      //...params
    //}, true).then((data) => {
    //}, () => {

    //})
    this.getBillList();
  }

  async getFreeData(){
    const reqParams = await this.props.getBaseParams();
    this.props.dispatch(getFreeInterest({
      ...reqParams
    })).then((result)=>{
      debugger
    },()=>{})
  }

  async getBillList(){
    const reqParams = await this.props.getBaseParams();
    this.props.dispatch(getBillList({
      ...reqParams
    }))
  }

  loginEnter(type, params) {
    loginHelper(() => {
      switch (type) {
        case 1:
          //展示免息期
          this.setState({interestShow: true},()=>{
            this.getFreeData()
          });

          return
        case 2:
          //添加账单
          this.props.history.push('/bill/method');
          return
        case 3:
          //进入卡包
          const {action: url} = params
          this.props.history.push(url);
          return
        case 4:
          //进入办卡中心
          const {action} = params;
          window.location.href = action;
          return;
        case 5:
          //还款
          this.setState({visible:true})
          return
      }
    })
  }

  async callHuandao(){
    const reqParams = await this.props.getBaseParams();
    this.props.dispatch(getHUandao({
      ...reqParams
    })).then((result)=>{
      const { data = {} } = result;
      const {telEnc,token} = data;
      location.href = `https://lns-front-test.vbillbank.com/transitionPageService?telNo=${telEnc}&token=${token}&appId=APP20170000000271&h5Channel=MPOS_XYKHK`
    },()=>{})


  }

  render() {
    const {interestShow, visible,} = this.state;
    const {isLogged,billList ={},freeIntrestData = []} = this.props;
    const { waitPaymentAmount ='', waitPaymentNumber ='',baseResponseBillDtoList =[] } = billList
    return [<div key={'a'} style={{background: '#FFFFFF', paddingBottom: "0.7rem"}}>
      <div style={styles.top}>
        <div style={styles.topText}>7日内待还
          <span style={styles.topSubText}>
          {isLogged ? waitPaymentNumber : '0'}笔
          </span>
        </div>
        <img onClick={() => {
          this.loginEnter(1)
        }} style={styles.img} src="/static/img/canlendar@2x.png"/>
        <span onClick={() => {
          this.loginEnter(2)
        }} style={styles.icon}><Icon type="plus" size="sm" color="#000"/></span>
      </div>
      <div style={{marginTop: "0.19rem"}}>
        <span style={styles.moneyStyle}>{isLogged ? waitPaymentAmount : '--'}
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
            return <div key={k}>
              <span style={styles.iconItem} onClick={() => {
                if (type == '0') {
                  this.loginEnter(3, {action})
                } else if (type == '1') {
                  this.loginEnter(4, {action})
                }
              }}>
                <img src={img} style={{width: '0.65rem'}}/>
              </span>
              <div style={styles.textStyle}>
                {text}
              </div>
            </div>
          })
        }
      </div>
      <div style={styles.activity}>
        {isLogged ? this.activity.map((v, k) => {
          const {imgSrc, action, title} = v;
          return <div key={k} style={{display: "inline-block"}}>
            <img style={{width: '0.74rem'}} src={imgSrc}/>
            <div>{title}</div>
          </div>
        }) : null
        }
      </div>
    </div>,
      <div key={'b'}>
        {
          isLogged ?
            baseResponseBillDtoList.map((v, k) => {
            const {
              card_num,
              bank_name,
              bill_type,//账单状态
              current_bill_amt,//本期账单总金额
              payment_due_date,//还款日
              bill_date,
              task_id,
              bill_id,// 账单编号,
              logo_uri,
              importBillType,//账单类型 01为网银 03为邮箱 02为手写账单
            } = v;

             return <BillCard card_num={card_num}
                              bank_name = {bank_name}
                              bill_type = {bill_type}
                              current_bill_amt = {current_bill_amt}
                              payment_due_date = {payment_due_date}
                              task_id = {task_id}
                              bill_id = {bill_id}
                              bill_date ={bill_date}
                              logo_uri={logo_uri}
                              importBillType={importBillType}
                              key={k} repay={() => this.setState({visible: true})}/>
            })
            :
            [{
              card_num:"29999",
              bank_name:"lee",
              bill_type :'DONE',
              current_bill_amt :"1000000",
              payment_due_date :"2018-06-09",
              task_id :"11111111111",
              bill_id :"11111111",
              bill_date :"2018-06-28",
              logo_uri:'/static/img/招商银行@2x.png',
              importBillType:""
            }].map((v, k) => <BillCard {...v} key={k} repay={(e) => {
              e.stopPropagation();
              e.preventDefault();
              this.loginEnter(5)
            }}/>)
        }
      </div>,
      <div key={'c'} style={styles.addBtn}
           onClick={() => this.loginEnter(2)}
      >
        <Icon type="plus" color="#999999" size="xs"/>
        <span style={styles.addText}>添加信用卡账单</span>

      </div>,
      <Modal
        key={'d'}
        visible={interestShow}
        transparent
        maskClosable={false}
        onClose={() => this.setState({interestShow: false})}
        title={<div style={{textAlign: 'left'}}>最长免息期</div>}
        wrapProps={{onTouchStart: this.onWrapTouchStart}}
        closable={true}
      >
        <div style={{height: '5.03rem', overflow: 'scroll'}}>
          {
            freeIntrestData.map((v, k) => {
              payment_due_date

              const {bank_logo:imgSrc,credit_limit,balance, bank_name, payment_due_date, card_number} = v;
              const  freeInterest = parseInt(moment(payment_due_date).diff(moment(),'days')) + parseInt(moment().daysInMonth())
              return <FreeItem key={k}
                               credit_limit={credit_limit}
                               imgSrc={imgSrc}
                               title={bank_name}
                               card_number={card_number}
                               freeInterest={freeInterest}
                               balance={balance}
                               {...v} />
            })
          }
        </div>
      </Modal>
      , visible ?
        <Popup
          key="e"
          title="选择还款方式"
          data={this.methodList(this)}
          visible={visible}
          setVisible={(v) => {
            this.setState({visible: v})
          }}
        />
        : null
    ]
  }

  methodList(HUAN_DAO) {
    return [
      {imgSrc: "/static/img/还@2x.png", name: '还到', action:this.callHuandao.bind(this), type: '0', des: '（授信额度30000元）', color: '#4d7cfe'},
      {
        imgSrc: "/static/img/qita@2x.png", name: '其它', action:()=>{}, type: '1', des: '', color: '', node: [
        {imgSrc: "/static/img/微信@2x.png", name: '微信', action: ()=>{}, type: '0', des: '', color: ''},
        {imgSrc: "/static/img/支付宝@2x.png", name: '支付宝', action: ()=>{}, type: '0', des: '', color: ''}
      ]
      },
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
    margin: '0.38rem 0 0 0.26rem',
    display: 'inline-block'
  },
  img: {
    width: '0.33rem',
    margin: '0.38rem 0.48rem 0 3.725rem '
  },
  topSubText: {
    color: '#151515',
    textAlign: 'center',
    lineHeight: '0.42rem',
    marginLeft: '0.1rem',
  },
  top: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    margin: '0.38rem 0 0 0 '
  },
  cover: {
    backgroundImage: 'linear-gradient(-141deg, #5E86FF 6%, #564CFE 88%)',
    borderRadius: '0.2rem',
    width: '6.94rem',
    height: '1.84rem',
    margin: '0.26rem auto 0 auto',
    display: 'flex',
    justifyContent: 'space-around'
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
    marginLeft: "0.045rem"
  },
  iconItem: {margin: "0.32rem 0 0 0", display: 'inline-block'},
  textStyle: {fontSize: '0.3rem', color: '#FFFFFF', letterSpacing: '0', textAlign: 'center'},
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
    marginLeft: '0.08rem'
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