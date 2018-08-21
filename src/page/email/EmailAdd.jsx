import React from 'react';
import Header from "../../compoents/Header";
import ModalCom from "../../compoents/ModalCom";
import {emailLogin, removeBillAllStatus, removeLoginStatus} from "../../actions/reqAction";
import {InitDecorator} from "../../compoents/InitDecorator";
import {Toast,Modal} from "antd-mobile";
import {
  regEmail
} from '../../utils/util';
const { alert } = Modal
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
      account: "",
      btnDisabled:true,
    }
  }

  enableBtn(){
    const { password, selected,account } = this.state;
    if( password && selected && account){
      this.setState({btnDisabled:false})
    } else {
      this.setState({btnDisabled:true})
    }
  }

  async loginEnter() {
    const {account, password, selected} = this.state;
    if(!account){
      Toast.info('请输入邮箱')
      return;
    } else if(!password ){
      Toast.info('请输入密码')
      return;
    } else if( !selected){
      Toast.info('请勾选协议')
      return;
    }
    if(!regEmail.test(account)){
      Toast.info('请检查您的输入邮箱')
    }

    const login = await this.props.dispatch(emailLogin({
      account,
      password,
    }))
    const { data } = login;
    const { DATA:taskId,RESULTCODE} = data;
    if( RESULTCODE == "1000"){
      alert('','再次登录将会覆盖掉您原有的登录信息，您确定再次登录吗？',[
        { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
        { text: '确认', onPress: () => {
          this.props.dispatch(removeLoginStatus({taskId})).then(()=>{
            this.props.dispatch(removeBillAllStatus({taskId})).then(()=>{
              Toast.hide();
              this.loginEnter()
            },()=>{
              Toast.hide();
            })
          },()=>Toast.hide())
        } },
      ])
      return;
    }
    if (!taskId) {
      // 任务创建失败
      Toast.info('任务创建失败', 1);
    } else {
      this.props.history.push('/load/email', {taskId, loginType: "03"})
    }

  }



  render() {
    const {modal, description, eyesOpen,btnDisabled, selected} = this.state;
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
                },()=>this.enableBtn())
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
          this.setState({selected: !selected},()=>()=>this.enableBtn())
        }}><img style={{width: '0.23rem'}} src={selected ? "/static/img/selected@2x.png" : "/static/img/Oval@2x.png"}/>
          <span style={{
            fontSize: '0.24rem',
            color: '#999999',
            letterSpacing: '-0.77PX',
            margin: "0 0 0 0.18rem"
          }}>同意用户授权协议</span>
        </div>
        <div style={btnDisabled?styles.disfinishBtn:styles.finishBtn} onClick={() => this.loginEnter()}>开始登录</div>
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
  },
  disfinishBtn:{
    background: 'rgb(130, 125, 125)',
    boxShadow: '0 0.06rem 0.12rem 0 rgb(130, 125, 125)',
    borderRadius: "0.08rem",
    margin: "0.78rem 0.16rem 0 0.16rem",
    lineHeight: "1.18rem",
    textAlign: 'center',
    fontSize: "0.34rem",
    color: "#FFFFFF",
    letterSpacing: '-0.011rem',
  }
}