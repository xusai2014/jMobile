import React from 'react';
import Header from "../../compoents/Header";
import {Tabs, Toast, Modal} from "antd-mobile"
import {getEchoForm, getLoginList, loginCyber, removeBillAllStatus, removeLoginStatus,} from "../../actions/reqAction";
import {InitDecorator} from "../../compoents/InitDecorator";
import globalStyle from "../../globalStyle";
import {jsNative} from "sx-jsbridge";
const {alert} = Modal

const cardType = 'CREDITCARD'

@InitDecorator((state) => ({
  loginList: state.BillReducer.loginList,
  echoForm: state.BillReducer.echoForm
}))
export default class CyberBank extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      description: '',
      eyesOpen: true,
      selected: true,
      inputData: {},
      echoStatus: false//是否回显

    }
  }

  async componentWillMount() {
    const {bankId: abbr} = this.props.match.params;

    this.props.dispatch(getLoginList({
      abbr,
      cardType: cardType,
    })).then((result) => {

    }, (err) => {
    });

    this.props.dispatch(getEchoForm({bankName: abbr})).then((result) => {
      if (result) {
        const {data = []} = result
        data.map((v, k) => {
          const {
            bankLoginType,
            password,
            username,
            uuid,
          } = v;
          let [ nameVal,username1] = username.split(username.indexOf(','))
          this.setDeepState('inputData', bankLoginType, {
            username:nameVal,
            password,
            uuid,
            username1,
            echoStatus: true
          })
        })
      }
    }, (err) => {
      debugger
    })
  }

  /**
   *   @author jerryxu
   *   @params 用户信息
   *   @description 第一步流程 输入用户信息，创建任务
   */
  async loginCyberFunc(v) {
    const {login_type: loginType, items} = v;
    const {inputData} = this.state;
    const stateData = inputData[loginType] ? inputData[loginType] : {}
    const {username, username1,echoStatus, uuid = '', specialForm = false, password, protocolSelected = true} = stateData;
    const {bankId: abbr} = this.props.match.params;
    if (!username) {
      Toast.info('请输入账号')
      return;
    } else if (!password) {
      Toast.info('请输入密码')
      return;
    } else if (protocolSelected === false) {
      Toast.info('请勾选协议')
      return;
    }
    if (specialForm) {
      const [one, two, three] = items;
      const {reg, name} = one;
      const regE = new RegExp(reg)
      if (!regE.test(username) && !echoStatus) {
        Toast.info(`请检查输入${name}`)
        return
      }
      const {reg: reg1, name: name1} = two;
      const regE1 = new RegExp(reg1)
      if (!regE1.test(username1) && !echoStatus) {
        Toast.info(`请检查输入${name1}`)
        return
      }
      const {reg: reg2, name: name2} = three;
      const regE2 = new RegExp(reg2)
      if (!regE2.test(password) && !echoStatus) {
        Toast.info(`请检查输入${name2}`)
        return
      }
      Toast.loading('请稍候', 0);
      const loginStatus = await this.props.dispatch(loginCyber({
        password,
        abbr,
        account: `${username},${username1}`,
        loginType,
        loginTarget: cardType,
        uuid: uuid
      }))

      const {data} = loginStatus;
      const {DATA: taskId, RESULTCODE} = data;
      if (RESULTCODE == '1001') {
        Toast.hide();
        alert('', <span className="alert_content">再次登录将会覆盖掉您原有的登录信息，您确定再次登录吗？</span>, [
          {text: '取消', onPress: () => console.log('cancel'), style: globalStyle.cancelStyle},
          {
            text: '确认', onPress: () => {
            this.props.dispatch(removeLoginStatus({taskId})).then(() => {
              this.props.dispatch(removeBillAllStatus({taskId})).then(() => {
                Toast.loading('请稍候', 0);
                this.loginCyberFunc(v)
              }, () => {
                Toast.hide();
              })
            }, () => Toast.hide())
          }, style: globalStyle.sureStyle
          },
        ])
        return;
      }

      if (!taskId) {
        // 任务创建失败
        Toast.hide();
        Toast.info('任务创建失败', 1);
      } else {
        Toast.hide();
        this.props.history.push('/load/cyber', {
          taskId, loginType: '01'
        })

      }

    } else {
      const [one, two] = items;
      const {reg, name} = one;
      const regE = new RegExp(reg)
      if (!regE.test(username) && !echoStatus) {

        Toast.info(`请检查输入${name}`)
        return
      }


      const {reg: reg2, name: name2} = two;
      const regE2 = new RegExp(reg2)
      if (!regE2.test(password) && !echoStatus) {

        Toast.info(`请检查输入${name2}`)
        return
      }
      Toast.loading('请稍候', 0);
      const loginStatus = await this.props.dispatch(loginCyber({
        password,
        abbr,
        account: username,
        loginType,
        loginTarget: cardType,
        uuid
      }))

      const {data} = loginStatus;
      const {DATA: taskId, RESULTCODE} = data;
      if (RESULTCODE == '1001') {
        Toast.hide();
        alert('', <span className="alert_content">再次登录将会覆盖掉您原有的登录信息，您确定再次登录吗？</span>, [
          {text: '取消', onPress: () => console.log('cancel'), style: globalStyle.cancelStyle},
          {
            text: '确认', onPress: () => {
            this.props.dispatch(removeLoginStatus({taskId})).then(() => {
              this.props.dispatch(removeBillAllStatus({taskId})).then(() => {
                Toast.loading('请稍候', 0);
                this.loginCyberFunc(v)
              }, () => {
                Toast.hide();
              })
            }, () => Toast.hide())
          }, style: globalStyle.sureStyle
          },
        ])
        return;
      }

      if (!taskId) {
        // 任务创建失败
        Toast.hide();
        Toast.info('任务创建失败', 1);
      } else {
        Toast.hide();
        this.props.history.push('/load/cyber', {
          taskId, loginType: '01'
        })

      }
    }

  }


  //For Object
  setDeepState(property, key, obj, callback) {
    const s = this.state[property]

    this.setState({
      [property]: {
        ...s,
        [key]: {
          ...s[key],
          ...obj
        }
      }

    }, callback)
  }

  enableBtn(key) {
    const data = this.state.inputData[key] ? this.state.inputData[key] : {}
    const {password, protocolSelected = true, username, } = data;
    if (password && protocolSelected && username) {
      this.setDeepState('inputData', key, {
        disableBtn: false
      })
    } else {
      this.setDeepState('inputData', key, {
        disableBtn: true
      })
    }
  }

  dataRetrieval(items, login_type, k, e) {
    if (items.length > 2) {
      if (k == 0) {
        this.setDeepState('inputData', login_type, {
          username: e.currentTarget.value
        }, () => this.enableBtn(login_type))

      } else if (k == 1) {
        this.setDeepState('inputData', login_type, {
          username1: e.currentTarget.value
        }, () => this.setDeepState('inputData', login_type, {
          specialForm: true
        }, () => this.enableBtn(login_type)))

      } else {
        this.setDeepState('inputData', login_type, {
          password: e.currentTarget.value
        }, () => this.enableBtn(login_type))
      }
    } else {
      if (k == 0) {
        this.setDeepState('inputData', login_type, {
          username: e.currentTarget.value
        }, () => this.enableBtn(login_type))

      } else {
        this.setDeepState('inputData', login_type, {
          password: e.currentTarget.value
        }, () => this.enableBtn(login_type))
      }
    }
  }

  // 初始化表单数据
  initDataRetrieval(items, k, username, username1, password, login_type) {
    return items.length > 2 ?
      (k == 0 ? username :
        (k == 1 ? username1 : password)) :
      (k == 0 ? username : password)
  }

  clearEchoForm(login_type) {
    this.setDeepState('inputData', login_type, {
      password: '',
      username: '',
      uuid: "",
      echoStatus:false
    }, () => this.enableBtn(login_type))
  }


  render() {
    const { inputData} = this.state;
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
            const {items, login_type, } = v;
            const {
              username = '',
              password = '',
              username1 = '',
              eyesOpen = false,
              protocolSelected = true,
              passSelected = true,
              disableBtn = true,
              echoStatus = false
            } = inputData[login_type] ? inputData[login_type] : {}
            return <div key={3}>
              {
                items.map((v, k) => {
                  const {name, disabled, placeHolder, icon} = v;
                  return <div key={k} style={styles.item}>
                    <div style={styles.name}>{name}</div>
                    <input value={this.initDataRetrieval(items, k, username, username1, password, login_type)}
                           onChange={(e) => {
                             if (echoStatus) {
                               this.clearEchoForm(login_type);
                             } else {
                               this.dataRetrieval(items, login_type, k, e,)
                             }
                           }}
                           disabled={disabled}
                           style={styles.input}
                           placeholder={placeHolder}
                           type={((items.length == 2 && k == 1 && !eyesOpen) || (items.length == 3 && k == 2 && !eyesOpen)) ? 'password' : 'text'}
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
              }}><img style={{width: '0.23rem'}}
                      onClick={() => {
                        this.setDeepState('inputData', login_type, {protocolSelected: !protocolSelected}, () => this.enableBtn(login_type));
                      }}
                      src={protocolSelected ? "/static/img/selected@2x.png" : "/static/img/Oval@2x.png"}/>
                <span style={{
                  fontSize: '0.24rem',
                  letterSpacing: '-0.77PX',
                  margin: "0 0 0 0.18rem",
                  color: '#4c7bfe',
                }} onClick={() => jsNative.nativeOpenNewWebView({
                  url: `${window.location.origin}/static/html/infoprotocol.html`
                }, () => {
                })}>同意用户授权协议</span>
                <img style={{width: '0.23rem', marginLeft: '3.3rem'}}
                     onClick={() => {
                       this.setDeepState('inputData', login_type, {
                         passSelected: !passSelected
                       })
                     }}
                     src={passSelected ? "/static/img/square@2x.png" : "/static/img/squareno@2x.png"}/>
                <span style={{
                  fontSize: '0.24rem',
                  color: 'rgb(153, 153, 153)',
                  letterSpacing: '-0.77px',
                  margin: '0px 0px 0px 0.18rem'
                }}>记住密码</span>
              </div>
              <div className={echoStatus?"enableBtn":(!disableBtn ? 'enableBtn' : 'disableBtn')}
                   onClick={() => {
                     this.setDeepState('inputData', login_type, {
                       disabled: true
                     });
                     this.loginCyberFunc(v)
                   }}>开始登录
              </div>
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
}