import React from 'react';
import {withRouter} from "react-router-dom";
import {checkToken, syncBill, verifyCode} from "../../actions/reqAction";
import {InitDecorator} from "../../compoents/InitDecorator";
import {Modal, Toast}  from "antd-mobile";
const prompt = Modal.prompt;

@withRouter
@InitDecorator((state) => {
  return {
    syncBillStatus: state.BillReducer.syncBillStatus,
  }
})
export default class BillCard extends React.Component {

  async callSyncBill(task_id, importBillType) {
    const reqParams = await this.props.getBaseParams();
    this.props.dispatch(syncBill({
      taskId: task_id,
      ...reqParams
    })).then((result) => {
      const {data} = result;
      this.loopLogin(data, importBillType)
      debugger;
    }, () => {
      debugger;
    })

  }

  /**
   *   @author jerryxu
   *   @params 用户信息
   *   @description 第二步流程 检查任务状态并获取任务状态
   */
  async loopLogin(taskId, loginType) {

    let status = {};
    do {

      const reqParams = await this.props.getBaseParams();
      status = await this.props.dispatch(checkToken({
        taskId,
        ...reqParams
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
    const {data = {}} = status;
    const {phase, phase_status = '', input, description} = data;
    switch (phase_status) {
      case 'WAIT_CODE'://输入验证码

        return this.promptClick({
          input,
          description,
          taskId,
          callback: this.verifycation.bind(this)
        })
      case "DOING":
        return;
      case "DONE_SUCC"://成功登录
        this.props.history.push('/load/cyber', {
          taskId, loginType
        })
        return;
      case "DONE_FAIL":
        Toast.info(description);
        this.setDeepState('inputData', {login_type: loginType}, {
          disabled: true
        });
        return;
      case "DONE_TIMEOUT":
        return;
      default:
        return;
    }
  }


  /**
   *   @author jerryxu
   *   @methodName
   *   @params 任务编号 短信验证码
   *   @description 第三步流程的分支流程，输入验证码检查登录状态
   */
  async verifycation({taskId, value: code}) {
    let codeStatus = ''

    const reqParams = await this.props.getBaseParams();
    codeStatus = await this.props.dispatch(verifyCode({
      taskId,
      code,
      ...reqParams
    }));

    const {data} = codeStatus;
    //if(value == '200'){

    //} else {
    this.loopLogin(taskId);
    //}
  }

  /**
   *   @author jerryxu
   *   @methodName i
   *   @params 魔蝎验证码模版 任务编号 信息描述 回调函数
   *   @description Popup提示，输入信息，异步处理
   */
  promptClick({input, taskId, description, callback}) {
    prompt('输入验证码', description, [{
      text: '取消',
      onPress: value => new Promise((resolve) => {
        Toast.info('登录失败', 1);
        setTimeout(() => {
          resolve();
          console.log(`value:${value}`);
        }, 1000);
      }),
    },
      {
        text: '确定',
        onPress: value => new Promise((resolve, reject) => {
          callback({taskId, value})
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
    const {data} = status;
    const {phase, phase_status} = data;
    switch (phase_status) {
      case "DOING":
        return true;
      default:
        return false;
    }
  }


  judgeStatus(bill_type, payment_due_date, bill_date, action) {
    if (bill_type == 'DONE') {
      const duM = moment(payment_due_date);
      if (parseInt(duM.diff(moment(), 'days')) < 0) {
        return {
          day: " ",
          date: " ",
          des: `已逾期${moment().diff(duM, 'days')}天`,
          actionName: "立即还款",
          action
        }
      } else {
        return {
          day: duM.diff(moment(), 'days'),
          date: duM.format('MM-DD'),
          des: '天后到期',
          actionName: "立即还款",
          action
        }
      }
    } else if (bill_type == 'UNDONE') {
      const duM = moment(bill_date);
      return {
        day: duM.diff(moment(), 'days'),
        date: duM.format('MM-DD'),
        des: '天后到期',
        actionName: "更新未出",
        action
      }
    } else {
      return {
        day: "",
        date: '',
        des: '',
        actionName: "",
        action
      }
    }

  }

  render() {
    const {
      card_num,
      bank_name,
      bill_type,
      current_bill_amt,
      payment_due_date = moment().format('YYYY-MM-DD'),
      task_id,
      bill_id,
      bill_date,
      logo_uri,
      repay,
      importBillType,
    } = this.props;

    const {day, date, des, actionName, action} = this.judgeStatus(bill_type, payment_due_date, bill_date, repay)
    return <div onClick={() => this.props.history.push(`/bill/detail/${bill_id}`)}
                style={{background: '#FFFFFF', marginTop: '0.2rem', padding: "0.3rem 0", position: 'relative'}}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div style={{width:'3.24rem',display:"inline-block"}}>
          <div style={{
            margin: '0 0.14rem 0 0.28rem',
            display: "inline-block",
            borderRadius: "0.18rem",
            background: '#E41E26',
            height: '0.36rem',
          }}><img src={logo_uri} style={{
            height: '0.36rem',
          }}/></div>
          <span style={{
            fontSize: '0.26rem',
            color: '#333333',
            letterSpacing: '0',
            textAlign: 'center',
          }}>{bank_name}</span>
          <span style={{
            fontSize: "0.28rem",
            color: '#999999',
            letterSpacing: '0',
            textAlign: 'center',
            marginLeft: '0.18rem'
          }}

          >{card_num}</span>
        </div>
        <div style={{width:'4.26rem',display:'inline-block'}}>
          <img src="/static/img/更新@2x.png" style={{
            height: '0.36rem',
            float: 'right',
            paddingRight: '0.71rem',
          }} onClick={(e) => {
            e.stopPropagation();
            this.callSyncBill(task_id, importBillType)
          }}/>
        </div>

      </div>
      <div style={{
        marginTop: '0.31rem',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'inline-block',
          marginLeft: "0.3rem"
        }}>
          <div style={{
            fontSize: '0.3rem',
            color: '#333333',
            letterSpacing: '0',
            textAlign: 'center',
          }}>{current_bill_amt}</div>
          <div style={{
            fontSize: '0.22rem',
            color: '#999999',
            letterSpacing: '0',
            textAlign: 'center',
          }}>本期账单
          </div>
        </div>
        <div style={{width:"2.84rem",display:'inline-block'}}>
          <div style={{
            display: 'inline-block',
            marginLeft: "1.88rem",
            fontSize: '0.5rem',
            color: '#999999',
            letterSpacing: '0',
            textAlign: 'center'
          }}>
            {day}
          </div>
          <div style={{
            display: 'inline-block',
            marginLeft: "0.26rem",
          }}>
            <div style={{
              fontSize: '0.22rem',
              color: '#999999',
              letterSpacing: '0',
            }}>{des}
            </div>
            <div style={{
              fontSize: '0.2rem',
              color: '#999999',
              letterSpacing: '0',
            }}>{date}</div>
          </div>
        </div>
        <div style={{
          display: 'inline-block',
          background: '#4C7BFE',
          borderRadius: '0.6rem',
          fontSize: '0.22rem',
          color: '#FFFFFF',
          letterSpacing: '0',
          textAlign: 'center',
          marginLeft: '1.3rem',
          width: '1.26rem',
          height: '0.53rem',
          lineHeight: '0.53rem'
        }} onClick={(e) => action(e)}>
          {actionName}
        </div>
      </div>
      <img src="/static/img/示例@2x.png" style={{width: "0.71rem", position: 'absolute', right: '0', top: '0'}}/>
    </div>
  }
}