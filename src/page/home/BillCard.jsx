import React from 'react';
import {withRouter} from "react-router-dom";
import {checkToken, getLoginList, syncBill, verifyCode} from "../../actions/reqAction";
import {InitDecorator} from "../../compoents/InitDecorator";
import {Modal, Progress, Toast}  from "antd-mobile";
import {jsNative} from "sx-jsbridge";
import {waitFunc} from "../../utils/util";
const {loginHelper} = jsNative;
const {prompt, alert} = Modal;

@withRouter
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
      percent: 0
    }
  }

  async callSyncBill(task_id, importBillType, abbr) {
    // TODO 仅支持网银
    Toast.loading('请稍候',0);
    if (importBillType == '01') {

    } else {
      this.props.dispatch(getLoginList({
        abbr,
        cardType: 'CREDITCARD',
      })).then((result) => {
        Toast.hide();
        const {data} = result;
        const {subtype = ''} = data;
        if (subtype) {
          alert('暂时无法获取账单的最新状态', <div>如果您已通过其导入它平台还款，建议您通过网银导入</div>, [
              {text: '暂不需要', onPress: () => console.log('置顶聊天被点击了'), },
              {text: '通过网银导入', onPress: () => this.props.history.push('/bill/method', {anchor: '#cyberId'}), }
            ]);
        } else {
          alert('该银行暂不支持同步您的账单数据', '', [
            {text: '我知道了', onPress: () => console.log('置顶聊天被点击了'), style: {textAlign: "center", paddingLeft: '0'}}
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
    })).then((result) => {
      const {data} = result;
      if (typeof data != 'undefined') {
        this.loopLogin(data, importBillType)
      } else {
        Toast.hide()
      }
    }, () => {

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
    const {data = {}} = status;
    const {phase, phase_status = '', input, description} = data;
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
        Toast.success('账单信息同步完成');
        this.setState({
          percent: 100,
          syncBegin: false
        },()=>{
          this.props.updateData();
        });
        return;
      case "DONE_FAIL":
        Toast.info(description);
        this.setDeepState('inputData', {login_type: loginType}, {
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
    let codeStatus = '';
    Toast.loading('请稍候',0)

    codeStatus = await this.props.dispatch(verifyCode({
      taskId,
      code,
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
        resolve();
        alert('是否退出当前认证流程',`选择“是”将退出当前认证流程已填写信息将丢失`,[
          {text:"是",onPress:()=>{}},
          {text:"否",onPress:()=>{
            this.promptClick({input, taskId, description, callback})
          }}
        ])
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
        des: `天后出账`,
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

  callLogin() {
    loginHelper(() => {
      return;
    })
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
      real,
      isNew = '00',
      abbr,
      update_time
    }
      = this.props;
    const {
      percent,
      syncBegin
    } = this.state;
    const update =  moment(update_time).diff(moment(),'days')

    const {day, date, des, actionName, action} = this.judgeStatus(bill_type, payment_due_date, bill_date, repay)
    return <div onClick={(e) => {
      if (!real) {
        e.stopPropagation();
        e.preventDefault();
        this.callLogin()
        return
      }
      this.props.history.push(`/bill/detail/${bill_id}`)
    }}
                style={{background: '#FFFFFF', marginTop: '0.2rem', padding: "0.3rem 0", position: 'relative'}}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        {
          isNew == '01' ? <div style={{
            position: 'absolute',
            top: '0'
          }}>
            <img style={{width: '0.445rem'}} src="/static/img/new@2x.png"/>
          </div> : null
        }
        <div style={{width: '3.24rem', display: "inline-block"}}>
          <div style={{
            margin: '0 0.14rem 0 0.28rem',
            display: "inline-block",
            borderRadius: "0.18rem",
            background: '#E41E26',
            height: '0.36rem',
          }}><img src={logo_uri} style={{
            height: '0.36rem',
            borderRadius: "0.18rem"
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
        <div style={{width: '4.26rem', display: 'inline-block'}}>
          {
            update <= 9?(syncBegin ?
              <div style={{
                fontSize: '0.22rem',
                color: '#333333',
                letterSpacing: '-1px',
                marginLeft: '2.57rem'
              }}>
                {percent > 0 ? `${percent}%更新中...` : '登录中...'}
                <Progress style={{width: "1.32rem"}} percent={percent} position="normal"/>
              </div> :
              <img src="/static/img/更新@2x.png" style={{
                height: '0.36rem',
                float: 'right',
                paddingRight: '0.71rem',
              }} onClick={(e) => {
                e.stopPropagation();
                if (!real) {
                  this.callLogin()
                  return
                }
                this.callSyncBill(task_id, importBillType, abbr)
              }}/>)
              :
              <div>已同步至最新</div>
          }
        </div>
      </div>
      <div style={{
        marginTop: '0.31rem',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'inline-block',
          marginLeft: "0.3rem",
          width: "2.82rem"
        }}>
          <div style={{
            fontSize: '0.3rem',
            color: '#333333',
            letterSpacing: '0',
          }}>{current_bill_amt}</div>
          <div style={{
            fontSize: '0.22rem',
            color: '#999999',
            letterSpacing: '0',
          }}>本期账单
          </div>
        </div>
        <div style={{width: "2.84rem", display: 'inline-block'}}>
          <div style={{
            display: 'inline-block',
            fontSize: '0.5rem',
            color: '#999999',
            letterSpacing: '0',
            textAlign: 'center',
            lineHeight: '0.5rem'
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
              lineHeight: '0.225rem'
            }}>{des}
            </div>
            <div style={{
              fontSize: '0.2rem',
              color: '#999999',
              letterSpacing: '0',
              lineHeight: '0.225rem'
            }}>{date}</div>
          </div>
        </div>
        <div style={{
          display: 'inline-block',
          background: actionName=='更新未出'?'rgb(153, 153, 153)':'#4C7BFE',
          borderRadius: '0.6rem',
          fontSize: '0.22rem',
          color: '#FFFFFF',
          letterSpacing: '0',
          textAlign: 'center',
          width: '1.26rem',
          height: '0.53rem',
          lineHeight: '0.53rem'
        }} onClick={(e) => {
          if(actionName=='更新未出'){
            return
          }
          if (!real) {
            this.callLogin()
            return
          }
          action(e)
        }}>
          {actionName}
        </div>
      </div>
      {real ? null :
        <img src="/static/img/示例@2x.png" style={{width: "0.71rem", position: 'absolute', right: '0', top: '0'}}/>}
    </div>
  }
}