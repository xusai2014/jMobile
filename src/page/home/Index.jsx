// @flow
import * as React from 'react';
import { Toast } from 'antd-mobile'
import BillCard from "./BillCard";
import Popup from "./components/Popup";
import { InitDecorator } from "../../compoents/InitDecorator";
import { jsNative, } from "sx-jsbridge";
import { judgeEnv } from "../../utils/util";
import { enterMethodList, } from '../../utils/BillSpider';
import MoreItem from "./components/MoreItem";
import IconEnter from "./components/IconEnter";
import FreeInterest from "./components/FreeInterest";
import styles from './style/index.less'
import { ACTIVITY_CARD, BILL_LIST, GET_IDENTITY_INFO, MARK_BILL_STATUS } from "../../utils/ActionsType";
import ModalAlert from "../../compoents/ModalAlert";
import DebounceButton from "../../compoents/DebounceButton";
import _debounce from 'lodash/debounce';
import moment from "moment";

const { loginHelper, nativeOpenNewWebView } = jsNative;
type Props = {
  billList: any,
  huandaoData: any,
  activities: any,
  examineAccount: any,
  isLogged: boolean,
  apiDispatcher: Function,
  history: any,
}
type State = {
  interestShow: boolean, //免息期弹窗展示,
  visible: boolean,//弹出框
  authSts: string,// 是否实名认证
  freeItems: boolean,//免息期弹窗
  examineAccount: boolean,//是否是审核账号
  MERC_SN: string,// 用户商编
  moreAction: boolean, // 更多菜单
  level: number,// 更多菜单展示的层级
  activeCard: any, // 当前要处理账某个账单的详细数据
  syncfunc: Function,
}

@InitDecorator((state) => {
  return {
    billList: state.BillReducer.billList,
    huandaoData: state.BillReducer.huandaoData,
    activities: state.CardsReducer.activities,
    examineAccount: state.CardsReducer.examineAccount,
  }
})
export default class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      interestShow: false, // 免息期弹窗展示,
      visible: false,// 弹出框
      authSts: '-1',// 是否实名认证
      freeItems: false,//免息期弹窗
      examineAccount: true,//是否是审核账号
      MERC_SN: '',// 用户商编
      moreAction: false, // 更多菜单
      level: 1,// 更多菜单展示的层级
      activeCard: {}, // 当前要处理账某个账单的详细数据
      syncfunc: () => {
      } // 选中账单更新数据，注册的方法
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
    this.props.apiDispatcher(ACTIVITY_CARD)
  }


  componentWillReceiveProps(nextProps: Props) {
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
    this.props.apiDispatcher(GET_IDENTITY_INFO, { appType: 'mpos' })
      .then((result) => {
          const { data } = result;
          const { authSts, MERC_SN = '' } = data;
          this.setState({
            authSts: authSts,
            examineAccount: MERC_SN != '700000000620451',
            MERC_SN
          })
        },
      )
  }

  getBillList() {
    this.props.apiDispatcher(BILL_LIST)
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

  identifyFunc(callback: Function) {
    this.props.apiDispatcher(GET_IDENTITY_INFO, { appType: 'mpos' })
      .then((result) => {
        const { data } = result;
        const { authSts } = data;
        //  authSts 99:未认证，01：已认证，02：驳回，00：审核中
        if (authSts == '01') {
          callback();
        } else if (authSts == '-1') {
          //数据尚未装载完毕不处理
        } else if (authSts == '99') {
          ModalAlert({
            title: '您尚未通过实名认证，请先进行实名认证',
            leftText: '取消',
            rightText: '去认证',
            rightFunc: () => jsNative.nativeGoRealName()
          })
        } else {
          jsNative.nativeGoRealName();
        }
        this.setState({
          authSts: authSts
        })
      }, () => {
      })
  }

  loginEnter(type: number, params: any) {
    loginHelper(() => {
      switch (type) {
        case 1:
          //展示免息期
          this.setState({ interestShow: true }, () => {

          });
          return;
        case 2:
          //添加账单
          this.identifyFunc(() => {
            // TODO 区分APP版本，进入不同的账单导入入口页
            enterMethodList(this.props)
          })
          return;
        case 3:
          //进入卡包
          this.identifyFunc(() => {
            const { action: url } = params
            this.props.history.push(url);
          })
          return;
        case 4:
          //进入办卡中心
          this.openCardMarket();
          return;
        case 5:
          //还款
          this.setState({ visible: true })
          return;
      }
    })
  }

  openPPMoney(gameUri: string) {
    const { MERC_SN } = this.state
    if (!MERC_SN) {
      return;
    }
    if (!!localStorage.getItem(MERC_SN)) {
      jsNative.nativeOpenNewWebView({ url: gameUri }, () => {
      });
    } else {
      ModalAlert({
        title: '免责声明',
        description: '您所访问的页面将跳转到第三方网站，请自行对网站所提供的信息、服务加以辨别及判断，并承担使用内容而引起的所有风险',
        rightText: '我知道了',
        rightFunc: () => {
          localStorage.setItem(MERC_SN, 'true');
          jsNative.nativeOpenNewWebView({ url: gameUri }, () => {
          });
        }
      });
    }
  }

  render() {
    const { interestShow, activeCard, visible, authSts, moreAction, level } = this.state;
    const { examineAccount } = this.props;
    const { isLogged, billList = {}, activities = [] } = this.props;
    const { waitPaymentAmount = '0.00', waitPaymentNumber = '0', baseResponseBillDtoList } = billList
    return [<div key={'a'} className={styles.container}>
      <div className={styles.top}>
        <div className={styles.topText}>7日内待还
          <span className={styles.topSubText}>
          {isLogged ? (waitPaymentNumber ? waitPaymentNumber : 0) : '--'}笔
          </span>
        </div>
        <div className={styles.flexCenter}>
          <IconEnter action={() => {
            this.loginEnter(1)
          }}
                     des={'免息期'} icon={"/static/img/canlendar@2x.png"}
          />
          <span style={{ width: '0.18rem' }}></span>
          <IconEnter action={() => this.loginEnter(2) }
                     des={'账单'} icon={"/static/img/indexadd@2x.png"}
          />
          <span style={{ width: '0.3rem' }}></span>
        </div>
      </div>
      <div style={{ marginTop: "0.19rem" }}>
        <span className={styles.moneyStyle}>
          {isLogged ? (waitPaymentAmount ? parseFloat(waitPaymentAmount).toFixed(2) : 0.00) : '--'}
          <span className={styles.unitStyle}>元</span>
        </span>
      </div>
      <div className={styles.cover}>
        {
          this.icons.map((v, k) => {
            const { img, text, action, type } = v;
            if (!isLogged && type == '1') {
              return null
            }
            if (examineAccount && type == '1') {
              return null
            }
            return <DebounceButton
              key={k}
              onClick={() => {
                if (type == '0') {
                  this.loginEnter(3, { action })
                } else if (type == '1') {
                  this.loginEnter(4, { action })
                }
              }}>

              <span className={styles.iconItem}>
                <img src={img} style={{ width: '0.65rem' }}/>
              </span>
              <div className={styles.textStyle}>
                {text}
              </div>
            </DebounceButton>
          })
        }
      </div>
      <div className={styles.shadowBlock}></div>
      <div className={styles.activity}>
        {isLogged ? (!this.props.examineAccount ? activities.map((v, k) => {
          const { logoUri = '', gameUri, gameName = '' } = activities[k] ? activities[k] : {};
          return <div onClick={() => {
            window.sa.track('SA_ADClick', {
              Name: '卡管理首页广告',
              Classification: "卡管理活动",
              PageTransition: gameUri,
            });
            if (gameUri.includes('site=oldweb')) {
              jsNative.nativeOpenOldWebView({ url: gameUri }, () => {
              })
            } else {
              if (gameUri.includes('ppmoney.com')) {
                this.openPPMoney(gameUri)
              } else {
                jsNative.nativeOpenNewWebView({ url: gameUri }, () => {
                })
              }
            }
          }} key={k} className={styles.activityContainer}>
            <img style={{ width: '0.74rem', height: '0.74rem' }} src={logoUri}/>
            <div style={{ fontWeight: 'bold', }}>{gameName}</div>
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
                                   this.setState({ visible: true })
                                 }}
                                 examineAccount={examineAccount}
                                 authSts={authSts}
                                 updateData={() => this.initData()}
                />
              }) : null)
            :
            this.example.map((v, k) => <BillCard
              authSts={authSts}
              showMoreAction={() => this.setState({ moreAction: true })}
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
      <div key={'c'} className={styles.addBtn}
           onClick={() => _debounce(this.loginEnter(2), 1000)}
      >
        <img className={styles.addImg} src="/static/img/addCard@2x.png"/>
        <span className={styles.addText}>添加信用卡账单</span>
      </div>,
      <div key='isLogged'>{(isLogged && !examineAccount) ?
        <div className={styles.enterCard} onClick={() => _debounce(this.openCardMarket(), 1000)}>
          <img src="/static/img/信用卡2x.png" style={{ width: "0.41rem" }}/>
          <span className={styles.applyCard}>
          办信用卡
        </span>
          <img src="/static/img/Path 3@2x.png" style={{ width: "0.1rem" }}/>
        </div> : null}
      </div>,
      isLogged ? <FreeInterest
        key="FreeInterest"
        parentParams={{
          isShow: interestShow,
          closeFunc: () => this.setState({ interestShow: false }),
          openFunc: () => this.setState({ interestShow: true }),
        }}
      /> : null,
      <Popup
        key="Popup"
        title="选择还款方式"
        visible={visible}
        setVisible={(v) => {
          this.setState({ visible: v })
        }}
      />,
      moreAction ?
        <MoreItem items={this.moreActions(activeCard)}
                  cancelFunc={() => {
                    this.setState({ moreAction: false })
                  }}
                  updateData={() => this.initData()}
                  level={level}
                  billData={{
                    bank_id: activeCard.bankId,
                    bill_type: activeCard.bill_type,
                    card_num: activeCard.cardNum
                  }}
                  setLevel={() => {
                    this.setState({ level: 1 })
                  }}
                  key="MoreItem"
        /> : null
    ]
  }

  moreActions = (activeCard: any) => [
    {
      name: "更新账单",
      action: (param: any) => {
        this.setState({ moreAction: false })
        this.state.syncfunc()
      },
    }, {
      name: "manual",
      action: (param: any) => {
        this.setState({ moreAction: false });
        const {
          cardNum,
          bankId,
        } = activeCard;
        const { payStatus } = param
        this.props.apiDispatcher(MARK_BILL_STATUS, {
          cardNum,
          bankId,
          payStatus: payStatus
        }).then(() => {
          Toast.info('设置还款状态成功');
          this.initData()
        })

      },
    }, {
      name: "标记还部分",
      action: (param: any) => {
        this.setState({ level: 2 })
      },
    }
  ]

  example = [{
    card_num: "2886",
    bank_name: "招商银行",
    bill_type: 'UNDONE',
    current_bill_remain_amt: "4800.56",
    payment_due_date: moment().format('YYYY-MM-DD'),
    task_id: "11111111111",
    bill_id: "11111111",
    bill_date: moment().subtract(-19, 'days').format('YYYY-MM-DD'),
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
  onWrapTouchStart = (e: SyntheticEvent<HTMLBaseElement>) => {
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


function closest(el: any, selector: any) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}