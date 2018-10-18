import React from 'react';
import {Modal,Toast} from 'antd-mobile'
import BillCard from "./BillCard";
import Popup from "./components/Popup";
import {InitDecorator} from "../../compoents/InitDecorator";
import {
  getBillList, getIndetiyInfo,
  getActivities, setMarkBill
} from "../../actions/reqAction";
import {jsNative,} from "sx-jsbridge";
import {judgeEnv} from "../../utils/util";
import globalStyle from "../../style";
import MoreItem from "./components/MoreItem";
import IconEnter from "./components/IconEnter";
import FreeInterest from "./components/FreeInterest";
const {loginHelper, nativeOpenNewWebView} = jsNative;
const {alert} = Modal;

@InitDecorator((state) => {
  return {
    billList: state.BillReducer.billList,
    huandaoData: state.BillReducer.huandaoData,
    activities: state.CardsReducer.activities,
    examineAccount: state.CardsReducer.examineAccount,
  }
})
export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interestShow: false, //免息期弹窗展示,
      visible: false,//弹出框
      authSts: '-1',// 是否实名认证
      freeItems: false,//免息期弹窗
      examineAccount: true,//是否是审核账号
      MERC_SN: '',// 用户商编
      moreAction: false, // 更多菜单
      level: 1,// 更多菜单展示的层级
      activeCard: {}, // 当前要处理账某个账单的详细数据
      syncfunc: () => {
      } //选中账单更新数据，注册的方法
    }
  }
  componentWillMount() {
    if (this.props.isLogged) {
      this.initData()
    }
  }
  initData() {
    this.getUserInfo();
    this.getBillList();
    this.props.dispatch(getActivities()).then(() => {
    }, () => {
    });
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.isLogged && this.props.isLogged != nextProps.isLogged) {
      // 全局组件订阅的登录状态，如Native 与 Server通知登录状态已切换，立即更新视图
      this.initData();
    }
  }
  /**
  *
  *   @methodName getUserInfo
  *   @description 获取用户基本信息，提供审核账号与实名认证状态
  */
  getUserInfo() {
    this.props.dispatch(getIndetiyInfo({
      appType: 'mpos'
    })).then((result) => {
      const {data} = result;
      const {authSts, MERC_SN = ''} = data;
      this.setState({
        authSts: authSts,
        examineAccount: MERC_SN != '700000000620451',
        MERC_SN
      })
    }, () => {
    })
  }

  getBillList() {
    this.props.dispatch(getBillList())
  }

  openCardMarket() {
    let url = '';
    if (window.location.host.indexOf('mpmw.vbill.cn') > -1) {
      url = `https://cca.vbill.cn/cca/home?source=creditCard`
    } else {
      url = `https://mpcw${judgeEnv()}.vbill.cn/cca/home?channelId=1000&source=creditCard`
    }
    nativeOpenNewWebView({ url })
  }

  identifyFunc(callback) {
    this.props.dispatch(getIndetiyInfo({
      appType: 'mpos'
    })).then((result) => {
      const {data} = result;
      const {authSts} = data;
      //  authSts 99:未认证，01：已认证，02：驳回，00：审核中
      if (authSts == '01') {
        callback();
      } else if (authSts == '-1') {
        //数据尚未装载完毕不处理
      } else if (authSts == '99') {
        alert(<span className="alert_title">您尚未通过实名认证，请先进行实名认证</span>, '', [
          {
            text: "取消", onPress: () => {
          },
            style: globalStyle.cancelStyle
          },
          {
            text: "去认证", onPress: () => {
            jsNative.nativeGoRealName()
          },
            style: globalStyle.sureStyle
          },
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
      switch (type) {
        case 1:
          //展示免息期
          this.setState({interestShow: true}, () => {
            document.body.style.position =  'fixed'
          });
          return;
        case 2:
          //添加账单
          this.identifyFunc(() => this.props.history.push('/bill/method'))
          return;
        case 3:
          //进入卡包
          this.identifyFunc(() => {
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

  openPPMoney(gameUri) {
    const {MERC_SN} = this.state
    if (!MERC_SN) {
      return;
    }
    if (localStorage.getItem(MERC_SN)) {
      jsNative.nativeOpenNewWebView({url: gameUri}, () => {
      });
    } else {
      alert(<span className="alert_title">免责声明</span>,
        <span className="alert_content">您所访问的页面将跳转到第三方网站，请自行对网站所提供的信息、服务加以辨别及判断，并承担使用内容而引起的所有风险</span>,
        [{
          text: '我知道了',
          onPress: () => {
            localStorage.setItem(MERC_SN, true);
            jsNative.nativeOpenNewWebView({url: gameUri}, () => {
            });
          },
          style: globalStyle.sureStyle
        }]
      );
    }
  }

  render() {
    const {interestShow, activeCard, visible, authSts, moreAction, level} = this.state;
    const {examineAccount} = this.props;
    const {isLogged, billList = {}, activities = []} = this.props;
    const {waitPaymentAmount = '0.00', waitPaymentNumber = '0', baseResponseBillDtoList} = billList
    return [<div key={'a'} style={styles.container}>
      <div style={styles.top}>
        <div style={styles.topText}>7日内待还
          <span style={styles.topSubText}>
          {isLogged ? (waitPaymentNumber ? waitPaymentNumber : 0) : '--'}笔
          </span>
        </div>
        <div style={styles.flexCenter}>
          <IconEnter action={() => {
            this.loginEnter(1)
          }}
                     des={'免息期'} icon={"/static/img/canlendar@2x.png"}
          />
          <span style={{width: '0.18rem'}}></span>
          <IconEnter action={() => {
            this.loginEnter(2)
          }}
                     des={'账单'} icon={"/static/img/indexadd@2x.png"}
          />
          <span style={{width: '0.3rem'}}></span>
        </div>
      </div>
      <div style={{marginTop: "0.19rem"}}>
        <span
          style={styles.moneyStyle}>{isLogged ? (waitPaymentAmount ? parseFloat(waitPaymentAmount).toFixed(2) : 0.00) : '--'}
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
            if (examineAccount && type == '1') {
              return null
            }
            return <div key={k} onClick={() => {
              if (type == '0') {
                this.loginEnter(3, {action})
              } else if (type == '1') {
                this.loginEnter(4, {action})
              }
            }}>
              <span style={styles.iconItem}>
                <img src={img} style={{width: '0.65rem'}}/>
              </span>
              <div style={styles.textStyle}>
                {text}
              </div>
            </div>
          })
        }
      </div>
      <div style={styles.shadowBlock}></div>
      <div style={styles.activity}>
        {isLogged ? (!this.props.examineAccount ? activities.map((v, k) => {
          const {logoUri = '', gameUri, gameName = ''} = activities[k] ? activities[k] : {};
          return <div onClick={() => {
            if (gameUri.indexOf('site=oldweb') > 0) {
              jsNative.nativeOpenOldWebView({url: gameUri}, () => {
              })
            } else {
              if (gameUri.indexOf('ppmoney.com') > -1) {
                this.openPPMoney(gameUri)
              } else {
                jsNative.nativeOpenNewWebView({url: gameUri}, () => {
                })
              }
            }
          }} key={k} style={{display: "inline-block", textAlign: 'center'}}>
            <img style={{width: '0.74rem', height: '0.74rem'}} src={logoUri}/>
            <div style={{fontWeight: 'bold',}}>{gameName}</div>
          </div>
        }) : null) : null
        }
      </div>
    </div>,
      <div key={'b'}>
        {
          isLogged ?
            (baseResponseBillDtoList ?
              (baseResponseBillDtoList.length == 0 ?
                this.example : baseResponseBillDtoList).map((v, k) => {
                return <BillCard {...v}
                                 showMoreAction={(task_id, importBillType, abbr, cardNum, bankId, bill_type, syncfunc) => this.setState({
                                   moreAction: true, activeCard: {
                                     task_id, importBillType, abbr, cardNum, bankId, bill_type
                                   }, syncfunc
                                 })}
                                 callSync={() => {
                                   this.setState()
                                 }}
                                 isLogged={isLogged}
                                 key={k}
                                 repay={(e) => {
                                   e.stopPropagation()
                                   this.setState({visible: true})
                                 }}
                                 examineAccount={examineAccount}
                                 authSts={authSts}
                                 updateData={() => this.initData()}
                />
              }) : null)
            :
            this.example.map((v, k) => <BillCard
              authSts={authSts}
              showMoreAction={() => this.setState({moreAction: true})}
              examineAccount={examineAccount}
              isLogged={isLogged}
              {...v}
              key={k}
              repay={(e) => {
                e.stopPropagation();
                e.preventDefault();
                this.loginEnter(5)
              }}
            />)
        }
      </div>,
      <div key={'c'} style={styles.addBtn}
           onClick={() => this.loginEnter(2)}
      >
        <img style={styles.addImg} src="/static/img/addCard@2x.png"/>
        <span style={styles.addText}>添加信用卡账单</span>
      </div>,
      <div>{(isLogged && !examineAccount) ?
        <div style={styles.enterCard} onClick={() => this.openCardMarket()}>
          <img src="/static/img/信用卡2x.png" style={{width: "0.41rem"}}/>
          <span style={styles.applyCard}>
          办信用卡
        </span>
          <img src="/static/img/Path 3@2x.png" style={{width: "0.1rem"}}/>
        </div> : null}
      </div>,
      <FreeInterest
        key="FreeInterest"
        parentParams={{
          isShow:interestShow,
          closeFunc:()=>this.setState({interestShow:false}),
          openFunc:()=>this.setState({interestShow:true}),
        }}
      />,
      <Popup
          key="Popup"
          title="选择还款方式"
          visible={visible}
          setVisible={(v) => {this.setState({visible: v})}}
      />,
      moreAction ?
        <MoreItem items={[
          {
            name: "更新账单",
            action: () => {
              this.setState({moreAction: false})
              this.state.syncfunc()
            },
          }, {
            name: "manual",
            action: (param) => {
              this.setState({moreAction: false});
              const {
                cardNum,
                bankId,
              } = activeCard;
              const {payStatus} = param
              this.props.dispatch(setMarkBill({
                cardNum,
                bankId,
                payStatus: payStatus
              })).then(() => {
                  Toast.info('设置还款状态成功');
                  this.initData()
              })

            },
          }, {
            name: "标记还部分",
            action: () => {
              this.setState({level: 2})
            },
          }
        ]}
                  cancelFunc={() => {
                    this.setState({moreAction: false})
                  }}
                  updateData = {()=>this.initData()}
                  level={level}
                  billData={{bank_id:activeCard.bankId,bill_type:activeCard.bill_type,card_num:activeCard.cardNum}}
                  setLevel={() => {
                    this.setState({level: 1})
                  }}/> :
        null
    ]
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
    abbr: "CMB",
    update_time: "2018-06-06",
    real: false,
  }]

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
  onWrapTouchStart = (e) => {
    // antd-mobile 提供的差异化处理，貌似没个卵用
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  }
}

const styles = {
  container: {background: '#FFFFFF', paddingBottom: "0.5rem"},
  topText: {
    fontSize: '0.3rem',
    color: '#999999',
    letterSpacing: "0",
    margin: '0rem 0 0 0.26rem',
    display: 'inline-block',
    fontWeight: 'bold',
  },
  img: {
    width: '0.2rem',
    height: '0.22rem',
    marginLeft: '0.19rem'
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
    justifyContent: 'space-between',
  },
  icon: {
    margin: '0rem 0 0 0 ',
    display: 'inline-block',
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
  textStyle: {fontSize: '0.3rem', fontWeight: 'bold', color: '#FFFFFF', letterSpacing: '0', textAlign: 'center'},
  activity: {
    display: "flex", justifyContent: "space-around",
    marginTop: '0.79rem',
    marginBottom: '0.3rem'
  },
  addBtn: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    background: '#FFFFFF', height: '0.84rem', widht: '7.5rem', margin: "0.2rem 0 0 0"
  },
  addImg:{color: "#999999", height: "0.25rem"},
  addText: {
    fontSize: '0.28rem',
    color: '#999999',
    letterSpacing: '0',
    textAlign: 'center',
    marginLeft: '0.08rem',
    fontWeight: 'bold',
    lineHeight: '0.28rem',
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
  }, shadowBlock: {
    boxShadow: 'rgba(115, 125, 255, 0.53) 0rem 0.37rem 0.27rem',
    width: '6.48rem',
    margin: '-0.35rem auto auto',
    height: '0.1rem',
  },
  applyCard:{
    fontWeight: 'bold',
    lineHeight: '0.28rem',
    margin: '0.08rem',
    fontSize: '0.28rem',
    color: '#4C7BFE',
    letterSpacing: '0'
  },
  enterCard:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0.82rem 0 1.56rem 0'
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