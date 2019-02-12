import React from 'react';
import { checkToken, getIndetiyInfo, getLoginList, syncBill, verifyCode } from "../../actions/reqAction";
import { InitDecorator } from "../../compoents/InitDecorator";
import { Modal, Progress, Toast }  from "antd-mobile";
import { jsNative } from "sx-jsbridge";
import {  waitFunc } from "../../utils/util";
import { enterBankImport, enterMethodList,} from '../../utils/BillSpider';
import globalStyle from "../../style/globalStyle";
import styles from './style/card.less'
import moment from "moment";
import ModalAlert from "../../compoents/ModalAlert";
const { loginHelper } = jsNative;

@InitDecorator((state) => {
  return {
    syncBillStatus: state.BillReducer.syncBillStatus,
  }
})
export default class BillCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      syncBegin: false,
      percent: 0,
      moreAction: false
    }
  }

  async callSyncBill(task_id, importBillType, abbr, cardNum, bank_name) {
    Toast.loading('请稍候', 0);
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
            {
              text: '通过网银导入',
              onPress: () => enterBankImport(this.props,abbr,bank_name),
              style: globalStyle.sureStyle
            }
          ]);
        } else {
          Modal.alert(<span className="alert_title">该银行暂不支持同步您的账单数据</span>, '', [
            { text: '我知道了', onPress: () => console.log('置顶聊天被点击了'), style: globalStyle.singleStyle }
          ]);
        }

      }, (err) => {
        Toast.hide()
      });
      return
    }
    await this.setState({
      syncBegin: true
    })
    this.props.dispatch(syncBill({
      taskId: task_id,
      cardNum,
    })).then((result) => {
      const { data } = result;
      if (typeof data != 'undefined') {
        this.loopLogin(data, importBillType)
      } else {
        Toast.hide()
      }
    }, () => {

    })

  }

  showMoreAction(task_id, importBillType, abbr, cardNum, bankId, bill_type, bank_name) {
    this.props.showMoreAction(task_id, importBillType, abbr, cardNum, bankId, bill_type, () => this.callSyncBill(task_id, importBillType, abbr, cardNum, bank_name))
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
        Toast.hide();
        return this.promptClick({
          input,
          description,
          taskId,
          callback: this.verifycation.bind(this)
        })
      case "DOING":
        if (this.state.percent < 80) {
          this.setState({
            percent: this.state.percent + 20
          })
        }

        return;
      case "DONE_SUCC"://成功登录
        this.setState({
          percent: 100,
          syncBegin: false
        }, () => {
          this.props.updateData(()=>Toast.success('账单信息同步完成'));
        });
        return;
      case "DONE_FAIL":
        Toast.info(description);
        this.setDeepState('inputData', { login_type: loginType }, {
          disabled: true
        });
        return;
      case "DONE_TIMEOUT":
        Toast.info('同步失败');
        this.setState({
          syncBegin: false
        });
        return;
      default:
        Toast.info('同步失败');
        this.setState({
          syncBegin: false
        });
    }
  }


  /**
   *   @author jerryxu
   *   @methodName
   *   @params 任务编号 短信验证码
   *   @description 第三步流程的分支流程，输入验证码检查登录状态
   */
  async verifycation({ taskId, value: code }) {
    Toast.loading('请稍候', 0)
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
        Modal.alert(<span className="alert_title">是否退出当前认证流程</span>, <span
          className="alert_content">选择“是”将退出当前认证流程已填写信息将丢失</span>, [
          {
            text: "是", onPress: () => {
            this.setState({
              syncBegin: false,
            })
          }, style: globalStyle.cancelStyle
          },
          {
            text: "否", onPress: () => {
            this.promptClick({ input, taskId, description, callback })
          }, style: globalStyle.sureStyle
          }
        ])
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

        }),
      },
    ], 'default', null, ['请输入验证码'])

  }

  judgeTaskStatus(status) {
    const { data } = status;
    const { phase_status } = data;
    return phase_status == "DOING"
  }

  setMoment = (date) => {
    if(!!date) return moment(moment(date).format('YYYY-MM-DD'));
    else return moment(moment().format('YYYY-MM-DD'))
  }

  judgeStatus(bill_type, payment_due_date, bill_date, action) {
    const { examineAccount } = this.props;
    const nowMoment =this.setMoment();
    if (bill_type == 'DONE') {
      const duM = this.setMoment(payment_due_date);
      if (parseInt(duM.diff(nowMoment, 'days')) < 0) {
        return {
          day: " ",
          date: duM.format('MM-DD'),
          des: <span style={{
            color: 'red',
            fontSize: '0.29rem',
            letterSpacing: '1PX'
          }}>{`逾期${nowMoment.diff(duM, 'days')}天`}</span>,
          actionName: examineAccount ? "点击" : "立即还款",
          action: examineAccount ? () => {
          } : action,
          key: "03"
        }
      } else {
        return {
          day: duM.diff(nowMoment, 'days'),
          date: duM.format('MM-DD'),
          des: '天后到期',
          actionName: examineAccount ? "" : "立即还款",
          action: examineAccount ? () => {
          } : action,
          key: "02"
        }
      }
    } else if (bill_type == 'UNDONE') {
      const duM = this.setMoment(bill_date);
      const days = duM.diff(nowMoment, 'days');
      return parseInt(days) > 0 ? {
        day: days,
        date: duM.format('MM-DD'),
        des: `天后出账`,
        actionName: "更新未出",
        action: () => {
        },
        key: "01"
      } : {
        day: Math.abs(days),
        date: duM.format('MM-DD'),
        des: `天前出账`,
        actionName: "更新未出",
        action: () => {
        },
        key: "04"
      }
    } else {
      return {
        day: "",
        date: '',
        des: '',
        actionName: "",
        action: () => {
        }
      }
    }

  }

  callLogin() {
    loginHelper(() => {
      return;
    })
  }

  identifyFunc(callback) {
    this.props.dispatch(getIndetiyInfo({
      appType: 'mpos'
    })).then((result) => {
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
        });
      } else {
        jsNative.nativeGoRealName();
      }
      this.setState({
        authSts: authSts
      })
    }, () => {
    })


  }


  render() {
    const {
      card_num,
      bank_name,
      bill_type,
      new_balance = '0',
      payment_due_date = moment().format('YYYY-MM-DD'),
      task_id,
      bill_id,
      bill_date,
      logo_uri,
      repay,
      importBillType,
      real = true,
      isNew = '00',
      abbr,
      isLogged,
      examineAccount,
      bank_id,
    }
      = this.props;
    const {
      percent,
      syncBegin
    } = this.state;
    const { day, date, des, actionName, action, key } = this.judgeStatus(bill_type, payment_due_date, bill_date, repay)
    return <div onClick={(e) => {
      if (!real) {
        if (isLogged) {
          this.identifyFunc(() => enterMethodList(this.props))
          return
        }
        e.stopPropagation();
        e.preventDefault();
        this.callLogin()
        return
      }
      if (examineAccount) {
        return
      }
      this.props.history.push(`/bill/detail/${bill_id}`, { bank_name, card_num, bank_id })
    }} className={styles.container}>
      <div className={styles.body}>
        {
          isNew == '01' ? <div className={styles.new}>
            <img style={{ width: '0.445rem' }} src="/static/img/new@2x.png"/>
          </div> : null
        }
        <div className={styles.main}>
          <div className={styles.left}><img src={logo_uri} style={{
            height: '0.36rem',
            borderRadius: "0.18rem"
          }}/></div>
          <span className={styles.name}>{bank_name}</span>
          <span className={styles.num}

          >{card_num}</span>
        </div>
        <div style={{ width: '4.26rem', display: 'inline-block' }}>
          {
            syncBegin ?
              <div className={styles.right}>
                {percent > 0 ? `${percent}%更新中...` : '登录中...'}
                <Progress style={{ width: "1.32rem" }} percent={percent} position="normal"/>
              </div> :
              <img src="/static/img/1.1.0/more@2x.png" className={styles.more} onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (!real) {
                  this.callLogin()
                  return
                }
                this.showMoreAction(task_id, importBillType, abbr, card_num, bank_id, bill_type, bank_name)
              }}/>
          }
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.bottom_left}>
          <div className={styles.new_balance}>{parseFloat(new_balance) == 0 ? '--' : new_balance}</div>
          <div style={{
            fontSize: '0.22rem',
            color: '#999999',
            letterSpacing: '0',
          }}>本期账单
          </div>
        </div>
        <div style={{ width: "2.84rem", display: 'inline-block' }}>
          <div className={styles.tips}>
            {day >= 0 ? day : 0}
          </div>
          <div style={{
            display: 'inline-block',
            marginLeft: "0.26rem",
          }} onClick={(e) => {
            if (key == '03') {
              e.stopPropagation();
              e.preventDefault();
              if (!real) {
                this.callLogin()
                return
              }
              this.showMoreAction(task_id, importBillType, abbr, card_num, bank_id, bill_type, bank_name)
            }
          }}>
            {
              examineAccount ? '' : <div className={styles.des}>{des}
              </div>
            }
            <div className={styles.date}>{date}</div>
          </div>
        </div>
        {!examineAccount ?
          <div style={{ background: actionName == '更新未出' ? 'rgb(153, 153, 153)' : '#4C7BFE', }}
               className={styles.btn}
               onClick={(e) => {
                 if (actionName == '更新未出') {
                   return
                 }
                 if (!real) {
                   this.callLogin()
                   return
                 }
                 action(e)
               }}
          >
            {actionName}
          </div>
          : null
        }
      </div>
      {real ? null : <img src="/static/img/示例@2x.png" className={styles.example}/>}
    </div>
  }
}
