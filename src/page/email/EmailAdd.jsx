import React from 'react';
import Header from "../../compoents/Header";
import {Modal} from 'antd-mobile';
import ModalCom from "../../compoents/ModalCom";
import {checkEmailTask, emailLogin} from "../../actions/reqAction";
import {InitDecorator} from "../../compoents/InitDecorator";
import {Toast} from "antd-mobile";
const prompt = Modal.prompt;

@InitDecorator((state) => {
  return {
    emailLogin: state.BillReducer.emailLogin
  }
})
export default class EmailAdd extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      description: '',
      eyesOpen: true,
      selected: true,
      password: '',
      account: ""
    }
  }

  async loginEnter() {
    const {account, password} = this.state;
    const reqParams = await this.props.getBaseParams();
    const login = await this.props.dispatch(emailLogin({
      account,
      password,
      ...reqParams
    }))
    debugger;
    const {data: taskId = ''} = login;
    if (!taskId) {
      // 任务创建失败
      Toast.info('任务创建失败', 1);
    } else {
      setTimeout(() => {
        this.checkTask(taskId);
      }, 3000)
    }

  }

  /**
   *   @author jerryxu
   *   @methodName i
   *   @params mod
   *   @description 第二步流程
   */
  async checkTask(taskId) {
    const reqParams = await this.props.getBaseParams();

    let login;

    do {
      login = await this.props.dispatch(checkEmailTask({
        ...reqParams,
        taskId
      }))
      debugger;
    } while (this.judgeStatus(login))

    this.handleStatus(login, taskId, {loginType: ''})

  }


  judgeStatus(status) {
    const {data} = status;
    const {phase, phase_status} = data;
    switch (phase_status) {
      case "DOING":
        return true;
      default:
        return false;
    }
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
        this.props.history.push('/load/email', {taskId, loginType: ""})
        return;
      case "DONE_FAIL":
        Toast.info(description);
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
    this.checkTask(taskId);
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

  render() {
    const {modal, description, eyesOpen, selected} = this.state;
    return [
      <Header title="导入账单邮箱"/>,
      <div key={3}>
        {
          [{
            name: '账单邮箱', value: "",
            placeHolder: "请输入账单邮箱",
            key: 'account'
          }, {
            name: '密码', value: '',
            key: 'password',
            icon: true,
            placeHolder: "请输入邮箱密码",
          },].map((v, k) => {
            const {name, disabled, placeHolder, icon, key} = v;
            return <div key={k} style={styles.item}>
              <div style={styles.name}>{name}</div>
              <input onChange={(e) => {
                this.setState({
                  [key]: e.currentTarget.value
                })
              }}
                     disabled={disabled} style={styles.input} placeholder={placeHolder}/>
              {icon ? <img onClick={() => {
                this.setState({eyesOpen: !eyesOpen})
              }} src={eyesOpen ? "/static/img/眼睛@2x.png" : "/static/img/闭眼icon@2x.png"} style={ styles.img}/> : null}
            </div>

          })
        }
        <div style={{
          paddingLeft: '0.31rem',
          display: 'flex',
          alignItems: 'center'
        }} onClick={() => {
          this.setState({selected: !selected})
        }}><img style={{width: '0.23rem'}} src={selected ? "/static/img/selected@2x.png" : "/static/img/Oval@2x.png"}/>
          <span style={{
            fontSize: '0.24rem',
            color: '#999999',
            letterSpacing: '-0.77PX',
            margin: "0 0 0 0.18rem"
          }}>同意用户授权协议</span>
        </div>
        <div style={styles.finishBtn} onClick={() => this.loginEnter()}>开始登录</div>
        <ModalCom visible={modal} showAction={(v) => {
          this.setState({modal: v})
        }} description={description}/>

      </div>
    ]
  }
}
const styles = {
  typeDes: {
    fontSize: '0.24rem',
    color: '#999999',
    letterSpacing: '0',
    padding: "0.09rem 0 0 0.31rem"
  },
  item: {
    minHeight: "1rem",
    width: '7.5rem',
    background: '#FFFFFF',
    margin: "0.3rem 0",
    display: 'flex',
    alignItems: "center"
  },
  name: {
    width: "2.76rem",
    paddingLeft: '0.31rem',
    lineHeight: "1rem",
    fontSize: '0.31rem',
    color: '#333333',
    letterSpacing: '-1PX',
    display: 'inline-block'
  },
  img: {
    width: '0.42rem',
  },
  input: {
    fontSize: '0.31rem',
    color: '#999999',
    letterSpacing: '0',
    height: '0.44rem',
    width: '3.6rem',
    border: '0',
  },
  tips: {
    fontSize: '0.24rem',
    color: '#5481FE',
    letterSpacing: '-0.77PX',
    margin: "0.31rem 0 0 0.31rem"
  },
  finishBtn: {
    background: '#4C7BFE',
    boxShadow: '0 0.06rem 0.12rem 0 #9BB5FF',
    borderRadius: "0.08rem",
    margin: "0.78rem 0.16rem 0 0.16rem",
    lineHeight: "1.18rem",
    textAlign: 'center',
    fontSize: "0.34rem",
    color: "#FFFFFF",
    letterSpacing: '-0.011rem',
  }
}