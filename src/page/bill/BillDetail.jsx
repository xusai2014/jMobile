import React from 'react';
import Header from '../../compoents/Header';
import { Tabs, Modal, Toast } from "antd-mobile"
import Popup from "../home/components/Popup";
import { InitDecorator } from "../../compoents/InitDecorator";
import {
  actionGenerator,
  checkToken, deleteBill, getBillDetail, getLoginList, getPayDetail, setMarkBill, syncBill,
  verifyCode
} from "../../actions/reqAction";
import {  waitFunc } from "../../utils/util";
import { enterMethodList } from '../../utils/BillSpider';
import globalStyle from "../../style/globalStyle";
import KeyWord from "../home/components/KeyWord";
import { BILL_DETAIL_LIST } from "../../utils/ActionsType";
import  _values from "lodash/values";
import moment from "moment";
@InitDecorator((state) => {
  return {
    billDetail: state.BillReducer.billDetail,
    payDetail: state.BillReducer.payDetail,
    examineAccount: state.CardsReducer.examineAccount,
    billDetailList: state.BillReducer.billDetailList
  }
})
export default class BillDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expandOne: "-1",
      visible: false,
      syncBegin: false,
      currentNum: '1',
      pageSize: '20',
      totalPages: '1',
      detailShow: false, //展示标记还部分输入框,
      pageData: {},
    }
  }

  async callSyncBill(task_id, importBillType, abbr, cardNum) {
    Toast.loading('请稍候...', 0);
    if (importBillType != '01') {

      this.props.dispatch(getLoginList({
        abbr,
        cardType: 'CREDITCARD',
      })).then((result) => {
        Toast.hide();
        const { data } = result;
        const { subtype = '' } = data;
        if (subtype) {
          Modal.alert(<span className="alert_title">暂时无法获取账单的最新状态</span>, <span className="alert_content">如果您已通过其导入它平台还款，建议您通过网银导入</span>, [
            { text: '暂不需要', onPress: () => console.log('置顶聊天被点击了'), style: globalStyle.cancelStyle },
            { text: '通过网银导入', onPress: () => enterMethodList(this.props), style: globalStyle.sureStyle }
          ]);
        } else {
          Modal.alert(<span className="alert_title">该银行暂不支持同步您的账单数据</span>, '', [
            { text: '我知道了', onPress: () => console.log('置顶聊天被点击了'), style: globalStyle.singleStyle }
          ]);
        }

      }, (err) => {
        Toast.hide();
      }).finally(() => this.setState({ syncBegin: false }));

      return
    }

    await this.setState({
      syncBegin: true
    })
    this.props.dispatch(syncBill({
      taskId: task_id,
      cardNum
    })).then((result) => {
      const { data } = result;
      if (typeof data != 'undefined') {
        this.loopLogin(data, importBillType);
        return
      }
      Toast.hide()
      this.setState({ syncBegin: false })
    }, () => {
      Toast.hide()
      this.setState({ syncBegin: false })
    })

  }

  componentWillUnmount() {
    promiseList.cancel()
  }

  /**
   *   @author jerryxu
   *   @params 用户信息
   *   @description 第二步流程 检查任务状态并获取任务状态
   */
  async loopLogin(taskId, loginType) {

    let status = {};
    do {
      await waitFunc(3000)
      status = await this.props.dispatch(checkToken({
        taskId,
      }))
    } while (this.judgeTaskStatus(status))
    this.handleStatus(status, taskId, loginType);
  }

  /**
   *   @author jerryxu
   *   @params 用户信息
   *   @description 第三步流程判断任务状态，分别处理
   */
  handleStatus(status, taskId, loginType) {
    const { data = {} } = status;
    const { phase_status = '', input, description } = data;
    switch (phase_status) {
      case 'WAIT_CODE'://输入验证码
        Toast.hide()
        return this.promptClick({
          input,
          description,
          taskId,
          callback: this.verifycation.bind(this)
        })
      case "DOING":
        return;
      case "DONE_SUCC"://成功登录
        Toast.hide()
        this.setState({
          syncBegin: false
        })
        Toast.success('同步成功');
        this.initData();
        return;
      case "DONE_FAIL":
        Toast.hide()
        this.setState({
          syncBegin: false
        })
        Toast.info(description);
        return;
      case "DONE_TIMEOUT":
        Toast.hide()
        this.setState({
          syncBegin: false
        })
        Toast.info('同步失败');
        return;
      default:
        Toast.hide()
        this.setState({
          syncBegin: false
        })
        Toast.info('同步失败');
    }
  }


  /**
   *   @author jerryxu
   *   @methodName
   *   @params 任务编号 短信验证码
   *   @description 第三步流程的分支流程，输入验证码检查登录状态
   */
  async verifycation({ taskId, value: code }) {
    Toast.loading('请稍候...', 0)

    await this.props.dispatch(verifyCode({
      taskId,
      code,
    }));

    this.loopLogin(taskId);
  }

  /**
   *   @author jerryxu
   *   @methodName i
   *   @params 魔蝎验证码模版 任务编号 信息描述 回调函数
   *   @description Popup提示，输入信息，异步处理
   */
  promptClick({ input, taskId, description, callback }) {
    Modal.prompt('输入验证码', description, [{
      text: '取消',
      onPress: value => new Promise((resolve) => {
        resolve();
      }),
    },
      {
        text: '确定',
        onPress: value => new Promise((resolve, reject) => {
          if (!value.trim()) {
            Toast.info('请输入短信验证码')
            return;
          }
          if (value.trim().length > 6 || !/^[0-9]*$/.test(value.trim())) {
            Toast.info('请检查您输入的验证码位数')
            return;
          }
          callback({ taskId, value })
          resolve();
          // setTimeout(() => {
          //   this.setState({modal: true, description: "您绑定的卡为借记卡，卡包只支持绑定信用卡，请您重新绑定"})
          //   console.log(`value:${value}`);
          // }, 1000);
        }),
      },
    ], 'default', null, ['请输入验证码'])

  }

  judgeTaskStatus(status) {
    const { data } = status;
    const { phase_status } = data;
    return "DOING" === phase_status;
  }

  judgeStatus(bill_type, payment_due_date, bill_date, action) {
    if (bill_type == 'DONE') {
      const duM =  this.setMoment(payment_due_date);
      if (parseInt(duM.diff( this.setMoment(), 'days')) < 0) {
        return {
          day: " ",
          date: " ",
          des: `已逾期${this.setMoment().diff(duM, 'days')}天`,
          actionName: "立即还款",
          action,
          key: "03"
        }
      } else {
        return {
          day: duM.diff( this.setMoment(), 'days'),
          date: duM.format('MM-DD'),
          des: '天后到期',
          actionName: "立即还款",
          action,
          key: "02"
        }
      }
    } else if (bill_type == 'UNDONE') {
      const duM =  this.setMoment(bill_date);
      const days = duM.diff( this.setMoment(), 'days')
      return parseInt(days) > 0 ? {
        day: days,
        date: duM.format('MM-DD'),
        des: '天后出账',
        actionName: "更新未出",
        action,
        key: "01"
      } : {
        day: Math.abs(days),
        date: duM.format('MM-DD'),
        des: '天前出账',
        actionName: "更新未出",
        action,
        key: "04"
      }
    } else {
      return {
        day: "",
        date: '',
        des: '',
        actionName: "",
        action,
        key: ""
      }
    }

  }

  componentDidMount() {
    this.initData()
  }

  initData() {
    const { bank_id: bankId, card_num: cardNum } = this.props.location.state?this.props.location.state:{};

    this.props.dispatch(actionGenerator({
      data: { cardNum, bankId }, type: BILL_DETAIL_LIST
    }))

  }

  async getPayDetailInfo(bankId = '0308', cardNumber = '4443') {
    this.props.dispatch(getPayDetail({
      bankId,
      cardNumber,
    }))
  }

  generateStr(v) {
    let unit = '';
    let ba = v;
    if (v / 10000 >= 1) {
      ba = v / 10000
      unit = '万';
    } else if (v / 1000 >= 1) {
      ba = v / 1000;
      unit = '千';
    }
    return ba.toFixed(2) + unit
  }

  setMoment = (date) => {
    if(!!date) return moment(moment(date).format('YYYY-MM-DD'));
    else return moment(moment().format('YYYY-MM-DD'))
  }

  generate(payment_due_date, bill_date, credit_limit, balance, bill_type) {
    const payDate = payment_due_date ? moment(payment_due_date).format('MM.DD') : moment().format('MM.DD')
    const billDate = bill_date ? moment(bill_date).format('MM.DD') : moment().format('MM.DD');
    let amount = 0;
    let amountUnit = ''
    if (credit_limit / 10000 >= 1) {
      amount = credit_limit / 10000
      amountUnit = '万';
    } else if (credit_limit / 1000 >= 1) {
      amount = credit_limit / 1000;
      amountUnit = '千';
    }

    let ba = 0;
    let baUnit = ''
    if (balance / 10000 >= 1) {
      ba = balance / 10000
      baUnit = '万';
    } else if (balance / 1000 >= 1) {
      ba = balance / 1000;
      baUnit = '千';
    }
    let freeInterest = bill_type == 'DONE' ? parseInt( this.setMoment(payment_due_date).diff( this.setMoment(), 'days')) + parseInt(moment().daysInMonth()) :
      parseInt(this.setMoment(payment_due_date).diff(this.setMoment(), 'days'))
    return [{
      title: "还款日", value: payDate,
      unit: ""
    }, {
      title: "出账日", value: billDate, unit: ""
    }, {
      title: "免息期", value: parseInt(freeInterest) > 0 ? freeInterest : 0, unit: "天"
    }, {
      title: "总额度", value: amount.toFixed(2), unit: amountUnit
    }, {
      title: "剩余额度约", value: ba.toFixed(2), unit: baUnit
    }]
  }


  haneleDetail(list) {
    if (list.length == 0) {
      return {
        from: '',
        to: '',
        datalist: []
      }
    } else {
      const { trans_date: from } = list[0]
      const { trans_date: to } = list[list.length - 1];
      return {
        from: moment(from).format('MM-DD'),
        to: moment(to).format('MM-DD'),
        datalist: _values(list.map((v, k) => {
          const { description, trans_date, amount_money } = v;
          return {
            description,
            trans_date: moment(trans_date).format('MM.DD'), amount_money
          }
        }))
      }
    }


  }

  async removeBill(billId) {
    this.props.dispatch(deleteBill({
      billId,
    })).then((result) => {
      this.props.history.go(-1)
    })
  }

  loadMoreDataFn(currentNum, pageSize, billId, callback) {
    this.props.dispatch(getBillDetail({
      billId,
      currentNum,
      pageSize
    })).then((result) => {
      const { data = {} } = result;

      this.setState({
        pageData: {
          ...this.state.pageData,
          [billId]: data
        },
      })
    }).finally(() => callback())
  }

  getBillList(billId) {
    const { currentNum = '1', pageSize = '20' } = this.state;
    this.props.dispatch(getBillDetail({
      billId,
      currentNum,
      pageSize
    })).then((result) => {
      const { data = [] } = result;

      this.setState({
        pageData: {
          ...this.state.pageData,
          [billId]: data
        },
      })
    });
  }

  render() {
    const { billDetailList = {}, payDetail = [], } = this.props;
    const {
      expandOne, visible, pageData
    } = this.state;
    const { state } = this.props.location;
    const { bank_name = '银行', bank_id = '', card_num = '' } = state ? state : {};
    const {
      payment_due_date,
      bill_date,
      credit_limit = '',//总额度
      balance = '',//剩余额度
      name_on_card = '',
      bill_type = '',
      min_payment = '',
      items = [],
      new_balance = '0.00',
      importBillType,
      abbr,
      taskId
    } = billDetailList;
    const { billId } = this.props.match.params;

    const { day, des, key: statusKey } = this.judgeStatus(bill_type, payment_due_date, bill_date)
    return [<Header title={`${bank_name}`}
                    right={<img onClick={() => {
                      Modal.alert('', <span className="alert_content">账单删除后，如需再次查询，需要重新导入账单</span>, [
                        { text: '取消', onPress: () => console.log('cancel'), style: globalStyle.cancelStyle },
                        { text: '确认', onPress: () => this.removeBill(billId), style: globalStyle.sureStyle },
                      ])
                    }} style={{ width: "0.36rem", }} src="/static/img/删除@2x.png"/>}/>, <div>
      <div style={{
        height: '2.95rem',
        width: '6.94rem',
        margin: '0 0.28rem',
        borderRadius: '0.08rem',
        backgroundImage: 'linear-gradient(-90deg, #5E84FE 14%, #7576FF 81%)',
      }}>
        <div
          style={{
            fontSize: '0.31rem',
            color: '#FFFFFF',
            letterSpacing: '0',
            padding: '0.27rem 0 0 0.31rem'
          }}
        >{name_on_card} {card_num}
        </div>
        <div style={{ paddingBottom: "0.38rem" }}>
          <div style={{ width: "3.9rem", padding: '0.43rem 0 0 0.31rem', display: 'inline-block' }}>
            <div
              style={{
                opacity: '0.5',
                fontSize: '0.24rem',
                color: '#FFFFFF',
                letterSpacing: '0',
              }}
            >{day}{des}
            </div>
            <div style={{
              fontSize: '0.62rem',
              color: '#FFFFFF',
              letterSpacing: '0',
            }}>{parseFloat(new_balance) == 0 ? '--' : new_balance}
            </div>
            <div style={{
              opacity: '0.5',
              fontSize: '0.24rem',
              color: '#FFFFFF',
              letterSpacing: '0',
            }}>最低应还：{min_payment}
            </div>
          </div>
          <div style={{
            opacity: '0.5',
            fontSize: '0.24rem',
            color: '#FFFFFF',
            letterSpacing: '0',
            textAlign: 'right',
            display: 'inline-block',
            width: '2.5rem'
          }}>
            {this.generate(payment_due_date, bill_date, credit_limit, balance, bill_type).map((v, k) => {
              const { title, value, unit } = v;
              return <div>
                <span>{title}：</span><span>{value}</span><span>{unit}</span>
              </div>
            })}
          </div>
        </div>
      </div>
      <div style={{
        opacity: '0.58',
        margin: '-0.9rem 0.425rem 0.5rem',
        borderRadius: '0.26rem',
        width: '6.65rem',
        height: '0.84rem',
        boxShadow: 'rgba(115, 125, 255, 0.53) 0rem 0.37rem 0.27rem',
      }}>
      </div>
      <div style={{ height: 'auto' }}>
        <Tabs
          tabs={[
            { title: '账单明细', sub: '0' },
            { title: '还款记录', sub: '1' },
          ]}
          initialPage={0}
          onTabClick={(v) => {
            const { sub } = v
            if (sub == '1') {
              this.getPayDetailInfo(bank_id, card_num)
            }
          }}
        >
          <div style={{ background: '#FFFFFF', height: 'auto', marginBottom: '2.2rem' }}>
            {items.map((v, k) => {
              const { billType, bill_id, bill_date } = v;
              let billItemDes = '';
              const { billId } = this.props.match.params;
              if (statusKey == '03' && bill_id == billId) {
                billItemDes = '已逾期';
              } else {
                billItemDes = billType == 'DONE' ? "已出账单" :
                  (billType == 'UNDONE' ? "未出账单" :
                    (billType == 'OVERDUEPAYMENT' ? "已逾期" : ""))
              }

              return <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.16rem 0'
                }}
                     onClick={() => {
                       if (v == expandOne) {
                         this.setState({ expandOne: '-1', currentNum: "1", totalPages: "1" })
                       } else {
                         this.setState({ expandOne: v }, () => {
                           this.getBillList(bill_id)
                         })
                       }

                     }}>
                  <img style={{
                    width: '0.19rem',
                    margin: '0 0.17rem 0 0.28rem',
                    height: '0.132rem',
                  }} src={expandOne == v ? "/static/img/triangleup@2x.png" : "/static/img/triangle@2x.png"}/>
                  <div style={{ display: 'inline-block' }}>
                    {
                      billItemDes != '已出账单' ? <div style={{
                        fontSize: '0.26rem',
                        color: (statusKey == '03' && bill_id == billId) ? "red" : '#4C7BFE',
                        letterSpacing: '0',
                      }}>
                        {
                          billItemDes
                        }
                      </div> :
                        <div style={{
                          fontSize: '0.26rem',
                          color: (statusKey == '03' && bill_id == billId) ? "red" : '#4C7BFE',
                          letterSpacing: '0',
                        }}>
                          {
                            `${moment(bill_date).add(-1, 'months').add(1, 'days').format('MM')}月`
                          }
                          <span style={{
                            fontSize: '0.24rem',
                            color: '#999999',
                            letterSpacing: '0',
                            marginLeft: '0.1rem'
                          }}>{
                            moment(bill_date).add(-1, 'months').add(1, 'days').format('YYYY')
                          }</span>
                        </div>

                    }

                    <div style={{
                      fontSize: '0.24rem',
                      color: '#999999',
                      letterSpacing: '0'
                    }}><span>{moment(bill_date).add(-1, 'months').add(1, 'days').format('YYYY-MM-DD')}
                    </span>至<span>{moment(bill_date).format('YYYY-MM-DD')}</span>
                    </div>
                  </div>
                </div>
                {expandOne == v ? [<div id="load" style={{ overflow: 'scroll' }}>
                  {
                    pageData[bill_id] ? pageData[bill_id].map((v, k) => {
                      const { description, trans_date, amount_money } = v;
                      return <div style={{
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <div style={{
                          padding: '0.18rem 0 0.18rem 0.64rem',
                          display: 'inline-block'
                        }}>
                          <div style={{
                            fontSize: '0.24rem',
                            color: '#333333',
                            letterSpacing: '0',
                            width: "4.23rem"
                          }}>{description}
                          </div>
                          <div style={{
                            fontSize: '0.24rem',
                            color: '#999999',
                            letterSpacing: '0',
                          }}>{trans_date}
                          </div>
                        </div>
                        <div style={{
                          fontSize: '0.32rem',
                          color: '#333333',
                          letterSpacing: '0',
                          display: 'inline-block',
                          width: "2.63rem",
                          textAlign: 'right',
                          paddingRight: "0.4rem",
                          fontWeight: 'bold'
                        }}>{amount_money}</div>
                      </div>

                    }) :
                      null
                  }{
                  pageData[bill_id] ?
                    (pageData[bill_id].length == 0 ?
                        <div style={{ textAlign: 'center', }}>没有更多了</div> : null
                    )
                    : <div style={{ textAlign: 'center', }}>正在加载中...</div>
                }

                </div>] : null}</div>
            })}
          </div>
          <div style={{ background: '#FFFFFF', height: 'auto', marginBottom: '2.2rem' }}>{payDetail.map((v, k) => {
            const { repaymentAmount, repaymentTime, repaymentChannel } = v;
            return [<div style={{ height: '1.06rem', padding: '0.18rem 0', display: 'flex', alignItems: 'center' }}>
              <div style={{ margin: '0 0 0 0.64rem', display: 'inline-block', width: '4.86rem' }}>
                <div style={{
                  fontSize: '0.26rem',
                  color: '#333333',
                  letterSpacing: '0',
                }}>{
                  repaymentChannel == '01' ? '还到' : (repaymentChannel == '02' ? '手动' : "")
                }还款
                </div>
                <div style={{
                  color: '#999999',
                  fontSize: "0.24rem",
                }}>{moment(repaymentTime).format('YYYY-MM-DD HH:mm')}
                </div>
              </div>
              <div style={{
                fontSize: '0.32rem',
                color: '#333333',
                letterSpacing: '0',
                display: 'inline-block',
                width: '2rem',
                textAlign: "right",
                padding: "0 0.26rem 0 0",
                fontWeight: 'bold',
              }}>
                {repaymentAmount}
              </div>
            </div>, <div style={{ width: "6.94rem", margin: 'auto', border: '1PX solid #F1F1F1' }}></div>]
          })}</div>
        </Tabs>
      </div>
      <div style={styles.bottom}>
        <div style={styles.bottomItem} onClick={() => {
          this.callSyncBill(taskId, importBillType, abbr, card_num)
        }}>
          <img src="/static/img/1.1.0/sync.png" style={styles.img}/>
          <div>同步</div>
        </div>
        <div style={styles.bottomItem} onClick={() => {
          this.setState({ detailShow: true })
        }}>
          <img src="/static/img/1.1.0/pen.png" style={styles.img}/>
          <div>标记还部分</div>
        </div>
        <div style={styles.bottomItem} onClick={() => {
          Toast.loading('请稍候');
          this.props.dispatch(setMarkBill({
            cardNum: card_num,
            bankId: bank_id,
            payStatus: bill_type == 'DONE' ? "01" : "02"
          })).then(() => {
            this.initData()
            Toast.info('设置还款状态成功');
          }, () => {
            Toast.hide()
          })
        }}>
          <img src="/static/img/1.1.0/select.png" style={styles.img}/>
          <div>{
            bill_type == 'DONE' ? "标记已还清" : (
              bill_type == 'UNDONE' ? "标记未还清" : (
                bill_type == 'OVERDUEPAYMENT' ? "标记已还清" : ""
              )
            )
          }</div>
        </div>
        <div style={styles.bottomBlue} onClick={() => this.setState({ visible: true })}>立即还款</div>
      </div>
    </div>, visible ? <Popup style={{ top: '0.81rem' }} title="选择还款方式" data={
      [
        { imgSrc: "/static/img/还@2x.png", name: '还到', action: "", type: '0', des: '', color: '' },
        {
          imgSrc: "/static/img/qita@2x.png", name: '其它', action: "", type: '1', des: '', color: '', node: [
          { imgSrc: "/static/img/微信@2x.png", name: '微信', action: "", type: '0', des: '', color: '' },
          { imgSrc: "/static/img/支付宝@2x.png", name: '支付宝', action: "", type: '0', des: '', color: '' }
        ]
        },
      ]
    } visible={visible} setVisible={(v) => {
      this.setState({ visible: v })
    }}
    /> : null
      , this.state.detailShow ? <div style={styles.container} key={'f'}>
        <div style={styles.header}>
          <img src="/static/img/back.png" style={styles.back} onClick={() => {
            this.setState({ detailShow: false, })
          }}/>
          标记还部分
        </div>
        <KeyWord billData={{ card_num, bank_id }} apiCallback={() => {
          this.initData()
          this.getPayDetailInfo(bank_id, card_num)
          this.setState({ detailShow: false })
        }}/>
      </div> : null];
  }
}

const styles = {
  bottom: {
    display: 'flex', position: 'fixed', bottom: '0',
    alignItems: "center",
    boxShadow: '0 0.02rem 0.04rem 0 rgba(0,0,0,0.50)',
  },
  container: {
    position: 'fixed',
    width: '7.5rem',
    bottom: '0',
    backgroundColor: '#FFFFFF',
    fontSize: '0.27rem'
  }, header: {
    fontSize: '0.3rem',
    color: '#333333',
    letterSpacing: '0',
    width: '7.5rem',
    lineHeight: '0.8rem',
    textAlign: 'center',
    border: '2px solid #ECECEC'
  },
  bottomBlue: {
    background: '#4C7BFE',
    width: "3.45rem",
    lineHeight: '1.1rem',
    textAlign: "center",
    fontSize: '0.3rem',
    color: '#FFFFFF',
    letterSpacing: '0'
  },
  bottomItem: {
    width: "1.34rem",
    height: '1.1rem',
    textAlign: "center",
    fontSize: '0.2rem',
    color: '#333333',
    letterSpacing: '0',
    borderRight: "0.005rem solid #979797",
    background: 'rgb(255, 255, 255)',
  },
  img: {
    height: '0.33rem',
    marginTop: '0.3rem',
  },
  back: {
    width: "0.2rem",
    height: '0.34rem',
    marginLeft: '0.31rem',
    position: 'absolute',
    left: '0',
    top: '0.23rem'
  },
}