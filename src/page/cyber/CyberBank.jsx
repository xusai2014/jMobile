import React from 'react';
import Header from "../../compoents/Header";
import ModalCom from "../../compoents/ModalCom";
import {Tabs,Toast} from "antd-mobile"
import { getLoginList, loginCyber, } from "../../actions/reqAction";
import {InitDecorator} from "../../compoents/InitDecorator";


const cardType = 'CREDITCARD'

@InitDecorator((state) => ({
  loginList: state.BillReducer.loginList
}))
export default class CyberBank extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      description: '',
      eyesOpen: true,
      selected: true,
      inputData: {},

    }
  }

  async componentWillMount() {
    const reqParams = await this.props.getBaseParams();
    const {bankId: abbr} = this.props.match.params;
    this.props.dispatch(getLoginList({
      abbr,
      cardType: cardType,
      ...reqParams
    })).then((result) => {
    }, (err) => {
    });
  }

  /**
  *   @author jerryxu
  *   @params 用户信息
  *   @description 第一步流程 输入用户信息，创建任务
  */
  async loginCyber(v) {
     const {login_type: loginType} = v;
     const {inputData} = this.state;
     const {username: account, password} = inputData[loginType];
     const {bankId: abbr} = this.props.match.params;
     const reqParams = await this.props.getBaseParams();
     const data = await this.props.dispatch(loginCyber({
       password,
       abbr,
       account,
       loginType,
       loginTarget: cardType,
       ...reqParams
     }))
     const { data:taskId ='' } = data;
    if(!taskId){
      // 任务创建失败
      Toast.info('任务创建失败', 1);
    } else {
      this.props.history.push('/load/cyber',{
        taskId,loginType:'01'
      })

    }
  }


  //For Object
  setDeepState(property,key,obj) {
    const s = this.state[property]

    this.setState({
      [property]:{
        ...s,
        [key]:{
          ...s[key],
          ...obj
        }
      }

    })
  }



  render() {
    const {modal, description, inputData} = this.state;
    const {bankId} = this.props.match.params;
    const {state = {}} = this.props.history.location
    const {name: bankName = ''} = state;
    const {loginList = {}} = this.props;
    const loginData = loginList[bankId] ? loginList[bankId] : [];

    return [
      <Header title={`导入${bankName}`}/>,
      <Tabs
        tabs={loginData}
      >
        {
          loginData.map((v, k) => {
            const {items,login_type,disabled = false} = v;
            const {
              username = '',
              password = '',
              eyesOpen = false,
              protocolSelected = false,
              passSelected = false,
            } = inputData[login_type] ? inputData[login_type] : {}
            return <div key={3}>
              {
                items.map((v, k) => {
                  const {name, disabled, placeHolder, icon} = v;

                  return <div key={k} style={styles.item}>
                    <div style={styles.name}>{name}</div>
                    <input value={k == 0 ? username : password}
                           onChange={(e) => {
                             if (k == 0) {
                               this.setDeepState('inputData',login_type,{
                                 username: e.currentTarget.value
                               })

                             } else {
                               this.setDeepState('inputData',login_type,{
                                 password: e.currentTarget.value
                               });
                             }

                           }}
                           disabled={disabled}
                           style={styles.input}
                           placeholder={placeHolder}
                           type={(k == 0 || (k == 1 && eyesOpen)) ? 'text' : 'password'}
                    />
                    {icon ? <img onClick={() => {
                      this.setState({
                        inputData: {
                          ...inputData,
                          [login_type]: {
                            ...inputData[login_type],
                            eyesOpen: !eyesOpen
                          }
                        }
                      })
                    }} src={eyesOpen ? "/static/img/眼睛@2x.png" : "/static/img/闭眼icon@2x.png"}
                                 style={ styles.img}/> : null}
                  </div>
                })
              }
              <div style={{
                paddingLeft: '0.31rem',
                display: 'flex',
                alignItems: 'center'
              }} onClick={() => {
                this.setDeepState('inputData',login_type,{protocolSelected:!protocolSelected})
              }}><img style={{width: '0.23rem'}}
                      src={protocolSelected ? "/static/img/selected@2x.png" : "/static/img/Oval@2x.png"}/>
                <span style={{
                  fontSize: '0.24rem',
                  color: '#999999',
                  letterSpacing: '-0.77PX',
                  margin: "0 0 0 0.18rem"
                }}>同意用户授权协议</span>
                <img style={{width: '0.23rem'}}
                     onClick={()=>{
                       this.setDeepState('inputData',login_type,{
                       passSelected:!passSelected
                     })}}
                     src={passSelected ? "/static/img/square@2x.png" : "/static/img/squareno@2x.png"}/>
                <span>记住密码</span>
              </div>
              <button disabled={disabled}  style={styles.finishBtn} onClick={() =>{
                this.setDeepState('inputData',login_type,{
                  disabled:true
                });
                this.loginCyber(v)}}>开始登录</button>
              <ModalCom visible={modal} showAction={(v) => {
                this.setState({modal: v})
              }} description={description}/>

            </div>
          })
        }
      </Tabs>]
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
    width: '7.18rem',
  }
}