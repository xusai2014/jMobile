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
const {loginHelper, nativeOpenNewWebView} = jsNative;


@InitDecorator((state) => {
  return {
    billList: state.BillReducer.billList,
    huandaoData: state.BillReducer.huandaoData,
    freeIntrestData: state.BillReducer.freeIntrestData,
    activities: state.CardsReducer.activities
  }
})
export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interestShow: false, //免息期弹窗展示,
      visible: false,//弹出框
      sycnModal:false,
      authSts:'-1'
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

  componentWillMount() {
    if (this.props.isLogged) {
      this.getUserInfo();
      this.getBillList();
      this.props.dispatch(getActivities()).then(() => {
        }, () => {
      });
    }
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.isLogged && this.props.isLogged != nextProps.isLogged) {
      this.getUserInfo();
      this.getBillList();
      this.props.dispatch(getActivities())
    }
  }

  getUserInfo() {
    this.props.dispatch(getIndetiyInfo({
      appType: 'mpos'
    })).then((result) => {
      const {data} = result;
      const {authSts} = data;
      this.setState({
        authSts: authSts
      })
    }, () => {
    })
  }

  async getFreeData() {
    const reqParams = await this.props.getBaseParams();
    this.props.dispatch(getFreeInterest({
      ...reqParams
    })).then((result) => {
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
    nativeOpenNewWebView({
      url:`https://mpcw${judgeEnv()}.vbill.cn/cca/home`
      //url:'http://172.16.40.34:3100/cca/home'
    })
    //https://mpcw-test.vbill.cn/cca/home
  }

  loginEnter(type, params) {
    loginHelper(() => {
      switch (type) {
        case 1:
          //展示免息期
          this.setState({interestShow: true}, () => {
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
          this.openCardMarket();
          return;
        case 5:
          //还款
          this.setState({visible: true})
          return
      }
    })
  }

  render() {
    const {interestShow, visible, sycnModal,authSts} = this.state;
    const {isLogged, billList = {}, freeIntrestData = [], activities = []} = this.props;
    const {waitPaymentAmount = '0.00', waitPaymentNumber = '0', baseResponseBillDtoList = []} = billList
    return [<div key={'a'} style={{background: '#FFFFFF', paddingBottom: "0.7rem"}}>
      <div style={styles.top}>
        <div style={styles.topText}>7日内待还
          <span style={styles.topSubText}>
          {isLogged ? waitPaymentNumber : '--'}笔
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
                  if(authSts == '01'){
                    this.loginEnter(3, {action})
                  } else if( authSts == '-1') {
                    //数据尚未装载完毕不处理
                  } else {
                    jsNative.nativeGoRealName()
                  }

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
        {isLogged ? [1,2,3,4].map((v, k) => {
          const {logoUri = '', gameUri, gameName = ''} = activities[v]?activities[v]:{};
          return <div onClick={() => {
            window.location.href = gameUri
          }} key={k} style={{display: "inline-block", textAlign: 'center'}}>
            <img style={{width: '0.74rem'}} src={logoUri}/>
            <div>{gameName}</div>
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
                isNew,
                abbr,
              } = v;
              return <BillCard card_num={card_num}
                               bank_name={bank_name}
                               bill_type={bill_type}
                               current_bill_amt={current_bill_amt}
                               payment_due_date={payment_due_date}
                               task_id={task_id}
                               bill_id={bill_id}
                               bill_date={bill_date}
                               logo_uri={logo_uri}
                               importBillType={importBillType}
                               real={true}
                               isNew={isNew}
                               abbr={abbr}
                               key={k}
                               repay={(e) => {
                                  e.stopPropagation()
                                  this.setState({visible: true})
                               }}
                               importModal={()=>{this.setState({sycnModal:true})}}
              />
            })
            :
            [{
              card_num: "29999",
              bank_name: "lee",
              bill_type: 'DONE',
              current_bill_amt: "1000000",
              payment_due_date: "2018-09-01",
              task_id: "11111111111",
              bill_id: "11111111",
              bill_date: "2018-08-28",
              logo_uri: '/static/img/招商银行@2x.png',
              importBillType: "",
              isNew: '00',
              abbr:"CMB"
            }].map((v, k) => <BillCard
              real={false}
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
              const {bank_logo: imgSrc, credit_limit, balance, bank_name, payment_due_date, card_number} = v;
              const freeInterest = parseInt(moment(payment_due_date).diff(moment(), 'days')) + parseInt(moment().daysInMonth())
              return <FreeItem key={k}
                               credit_limit={credit_limit}
                               imgSrc={imgSrc}
                               title={bank_name}
                               card_number={card_number}
                               freeInterest={freeInterest}
                               balance={balance}
                               {...v}
              />
            })
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