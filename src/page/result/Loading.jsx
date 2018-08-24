import React from 'react';
import Header from "../../compoents/Header";
import {checkEmailTask, checkToken, pollingCyber, removeLoginStatus, verifyCode} from "../../actions/reqAction";
import {InitDecorator} from "../../compoents/InitDecorator";
import Loading from "../../compoents/Loading";
import { Toast,Modal } from 'antd-mobile';
import {waitFunc} from "../../utils/util";
const {prompt,alert} = Modal;

const results = {
  cyber:{
    title:"网银账单"
  },
  email:{
    title:"邮箱账单"
  }

}

@InitDecorator((state) => ({
  loginList: state.BillReducer.loginList
}))
export default class LoadingStatus extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      progress:0
    }
  }

  /**
   *   @author jerryxu
   *   @methodName i
   *   @params mod
   *   @description 第二步流程
   */
  async checkTask(taskId,) {
    const {
      state = {}
    } = this.props.location;
    const {
      loginType
    } = state;

    let login;

    do {
      await waitFunc(3000)
      if(loginType == '03'){
        login = await this.props.dispatch(checkEmailTask({
          taskId
        }))
      } else if(loginType == '01'){
        login = await this.props.dispatch(checkToken({
          taskId,
        }))
      }
    } while (this.judgeStatus(login))

    if(typeof login.data == 'undefined'){
      Toast.fail('导入失败');
      return;
    }
    this.handleStatus(login, taskId, loginType)

  }


  judgeStatus(status) {
    const {data = {} } = status;
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

        this.loopCheckAlways({taskId,loginType})
        return;
      case "DONE_FAIL":
        Toast.info(description);
        // TODO 添加参数 uuid
        this.props.dispatch(removeLoginStatus({taskId})).then(()=>{
          this.goResult(loginType,3,description)
        })

        return;
      case "DONE_TIMEOUT":
        this.goResult(loginType,3,description)
        Toast.info(description);
        return;
      default:
        return;
    }
  }

  goResult(loginType,status = 3,description){

    // 1 是成功 2是无数据 3是失败
    if(status == 1){
      if(loginType == '01'){
        this.props.history.push('/result/cybersuccess',{
          result:description
        })
      } else if(loginType == '03'){
        this.props.history.push('/result/esuccess',{
          result:description
        })

      }
    } else if(status == 2){
      if(loginType == '01'){
        this.props.history.push('/result/cybernodata',{
          result:description
        })
      } else if(loginType == '03'){
        this.props.history.push('/result/enodata',{
          result:description
        })
      }
    }else if(status == 3) {
      if(loginType == '01'){
        this.props.history.push('/result/cyberfailed',{
          result:description
        })
      } else if(loginType == '03'){
        this.props.history.push('/result/efailed',{
          result:description
        })
      }
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

    codeStatus = await this.props.dispatch(verifyCode({
      taskId,
      code,
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
        resolve();
        alert('是否退出当前认证流程',`选择“是”将退出当前认证流程已填写信息将丢失`,[
          {text:"是",onPress:()=>{this.props.history.go(-1)}},
          {text:"否",onPress:()=>{
            this.promptClick({input, taskId, description, callback})
          }}
        ])
      }),
    },
      {
        text: '确定',
        onPress: value => new Promise((resolve, reject) => {
          if(!value.trim()){
            Toast.info('请输入短信验证码')
            return;
          }
          if(value.trim().length>6 || !/^[0-9]*$/.test(value.trim())){
            Toast.info('请检查您输入的验证码位数')
            return;
          }
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

  /**
   *   @author jerryxu
   *   @params 用户信息
   *   @description 检查账单导入状态
   */

  async loopCheckAlways({ taskId,loginType }) {
    let pollingStatus = {};
    let continueLoop = false
    do {
      await waitFunc(3000)
      pollingStatus = await this.props.dispatch(pollingCyber({
        taskId,
      }));
      if(this.state.progress < 80){
        this.setState({
          progress:this.state.progress+10
        })
      }
      const { data = {}} = pollingStatus;
      const { isFinish =false } = data;
      continueLoop = !isFinish
    } while (continueLoop)
    const {data = {}} =pollingStatus;
    const { resultList = []} = data;
    debugger;
    if( typeof data == 'undefined' || resultList.length == 0 ){
      this.goResult(loginType,2,'无账单数据')
      return;
    }
    this.setState({
      progress:100
    },()=>{ this.goResult(loginType,1,resultList)})
  }

  async componentWillMount(){
    const {
      state = {}
    } = this.props.location;

    const {
      taskId = "586b4860-9c76-11e8-89e7-00163e0dfac7",
    } = state;
    this.checkTask(taskId);
    debugger;

  }
  render() {
    const  { type,}   = this.props.match.params;
    const { title } = results[type];
    const { progress } = this.state;
    return [<Header key="1" title={`正在导入${title}`} ></Header>,
      <div key={2} style={{
        width:"7.5rem",position:'absolute',textAlign:'center',
        backgroundColor:"#FFFFFF",paddingBottom:"0.5rem",
        fontSize: '0.31rem',
        color: '#333333',
        letterSpacing: '0'
      }}>
      <Loading />
      {progress >0?`正在导入${title}…已完成${progress}%`:'登录中，请耐心等待'}
      <div style={{
        fontSize: '0.31rem',
        color: '#4C7BFE',
        letterSpacing: '0',
        textAlign:'center',
        marginTop:'6.56rem'
      }}>{progress >0?'':'登录时间大约30秒'}</div>
    </div>]
  }
}

const styles = {
  describe:{
    fontSize: "0.36rem",
    color: "#333333",
    letterSpacing: '-1PX',
    textAlign:'center',

  },
  resason:{
    fontSize: "0.24rem",
    color: '#999999',
    letterSpacing: '-0.67PX',
    textAlign: "center",
    margin:'0.3rem 1.53rem 0 1.53rem',
    width:'4.44rem'
  },finishBtn:{
    background:'#4C7BFE',
    boxShadow: '0 0.06rem 0.12rem 0 #9BB5FF',
    borderRadius: "0.08rem",
    margin:"1.4rem 0.16rem 0 0.16rem",
    lineHeight:"1.18rem",
    textAlign:'center',
    fontSize: "0.34rem",
    color: "#FFFFFF",
    letterSpacing: '-0.011rem',
  },
  actionReplace:{
    fontSize: "0.36rem",
    letterSpacing: "0",
    color: "#4C7BFE",
    textAlign:'center',
    marginTop:'1.21rem'
  },
  actionsImport:{
    fontSize: "0.36rem",
    letterSpacing: "0",
    color: "#4C7BFE",
    textAlign:'center',
    marginTop:'0.63rem',
    paddingBottom:"0.36rem"
  }
}