import React from 'react';
import Header from '../../compoents/Header';
import InputRadio from "./components/InputRadio";
import {Modal, Toast} from 'antd-mobile'
import ModalCom from "../../compoents/ModalCom";
import {InitDecorator} from "../../compoents/InitDecorator";
import {
  identityBank, judgeSelfCard, postInfo, sendVerification,
  verifySMSCode
} from "../../actions/reqAction";
import {regBankCard, regIdCard, regMobile} from '../../utils/util';
import {jsNative} from 'sx-jsbridge'
const prompt = Modal.prompt;

@InitDecorator((state) => {
  return {
    bindSelfCard: state.CardsReducer.bindSelfCard,
    fromBank: state.CardsReducer.fromBank,
    identityInfo: state.CardsReducer.identityInfo,
  }
})
export default class EditCard extends React.Component {
  constructor(props) {
    super(props);
    const {identityInfo} = this.props;
    const {name, idCardNo} = identityInfo;

    this.state = {
      activeOne: 0,
      modal: false,
      description: '',
      cardData: {
        cardNum: "",
        username: name,
        id: idCardNo,
        specialname: name,
        specialId: idCardNo,
        bank: '',
        phone: "",
        bankType: '',
        enableBtn: false,
      },
      usalCardData: {
        cardNum: "",
        username: '',
        specialname: name,
        specialId: idCardNo,
        id: '',
        bank: '',
        phone: "",
        bankType: '',
        enableBtn: false,
      }
    }
  }

  findBank(key) {
    const cardData = this.state[key];
    if (!cardData['cardNum']) {
      Toast.info('请先输入卡号');
      return;
    }
    //M543
    const {cardNum: cardNo} = cardData
    this.props.dispatch(identityBank({
      cardNo,
      type: '2'
    })).then((result) => {
      const {data} = result;
      const {bankNm, type} = data;
      if (bankNm) {
        this.setDeepState(key, 'bank', bankNm)
        this.setDeepState(key, 'bankType', type)
      } else {
        Toast.info('请检查您输入的信用卡号')
        this.setDeepState(key, 'bank', '')
        this.setDeepState(key, 'bankType', '')

      }
    })
  }

  async bindCard(key) {

    const {
      cardNum: cardNo = '',
      username: idName,
      id: idNo,
      bank,
      phone: resvPhoneNo = '',
      bankType: bankNo,
      specialname,
      specialId,
    } = this.state[key];
    if (!cardNo) {
      Toast.info('请输入银行卡号');
      return;
    } else if (!idName) {
      Toast.info('请输入用户名');
      return;
    } else if (!idNo) {
      Toast.info('请输入身份证号码');
      return;
    } else if (!bank) {
      Toast.info('请点击识别银行');
      return;
    } else if (!resvPhoneNo) {
      Toast.info('请输入预留手机号')
      return;
    } else {
    }
    if (!regBankCard.test(cardNo)) {
      Toast.info('请输入正确的银行卡号')
      return;
    } else if (!regIdCard.test(idNo)) {
      Toast.info('请输入正确的身份证号码')
      return;
    } else if (!regMobile.test(resvPhoneNo)) {
      Toast.info('请输入正确的手机号码')
      return;
    }
    Toast.loading('请稍候...',0)
    let r = await this.props.dispatch(postInfo({
      cardNo,
      idNameByUser: idName,
      idNoByUser: idNo,
      idName: specialname,
      idNo: specialId,
      resvPhoneNo,
      bankNo
    }))

    const {data} = r;

    const {result, resultMsg, bindType} = data;
    if (result != '00') {
      Toast.info(resultMsg)
    } else {

      this.props.dispatch(sendVerification({
        channelNo: '01',
        busineType: '04',
        phone: resvPhoneNo
      })).then(() => {
        const len = resvPhoneNo.length
        prompt('输入验证码', `请输入手机号${resvPhoneNo ? `${resvPhoneNo.slice(0, 3)}****${resvPhoneNo.slice(-4, len)}` : ''}收到的验证码`, [{
          text: '取消',
          onPress: value => new Promise((resolve) => {
            Toast.hide()
            resolve();
          }),
        },
          {
            text: '确定',
            onPress: value => new Promise((resolve, reject) => {
              const {MERC_SN} = this.props.identityInfo;
              this.props.dispatch(verifySMSCode({
                channelNo: '01',
                busineType: "04",
                phone: resvPhoneNo,
                verifyCode: value,
                mno: MERC_SN,
                bankNo,
                cardNo,
                resvPhoneNo: resvPhoneNo,
                bindType,
              })).then((result) => {
                Toast.info('绑卡成功')
                this.props.history.go(-1)
                resolve();
              }, () => {
                reject();
              }).finally(()=>Toast.hide())
            }),
          },
        ], 'default', null, ['请输入验证码'])
      }
    , () => {

          }).finally(()=>Toast.hide())
        }

  }

      componentWillMount() {
        this.props.dispatch(judgeSelfCard());
      }

      setDeepState(property, key, value, callback = () => {
                   }) {
        const s = this.state[property]

        this.setState({
          [property]: {
            ...s,
            [key]: value
          }

        }, callback)
      }

      enableBtn(key) {
        const {
          cardNum: cardNo = '',
          username: idName,
          id: idNo,
          bank,
          phone: resvPhoneNo = '',
          bankType: bankNo,
        } = this.state[key];
        if (cardNo && idName && idNo && bank && resvPhoneNo && bankNo) {
          this.setState({
            [key]: {
              ...this.state[key],
              enableBtn: true
            }
          })
        } else {
          this.setState({
            [key]: {
              ...this.state[key],
              enableBtn: false
            }
          })
        }

      }

      inputLimit(key,val){
        if(!val){
          return false
        }
        switch (key){
          case 'cardNum':
            return !/^[0-9]*$/.test(val) || val.length >25
          case 'username':
            return /^[0-9]*$/.test(val) || val.length >40
          case 'id':
            return val.length >18
          case 'phone':
            return !/^[0-9]*$/.test(val) || val.length >11
          default:
            return false;
        }
      }


      render() {
        const {activeOne, modal, description} = this.state;
        let property = activeOne == 1 ? 'usalCardData' : "cardData";
        const {enableBtn = false} = this.state[property];

        return [<Header key={1} title="信用卡信息"/>, <style key={2}>
          {

      `
        input::-webkit-input-placeholder, {
        color: 'red';
        font-size:'1px';
        }
        `

          }
        </style>, <div key={3}>

          <div style={{background: '#FFFFFF'}}>
            <div style={styles.typeDes}>信用卡类型</div>
            <InputRadio activeOne={ activeOne } setActiveOne={(v) => {
              if (!this.props.bindSelfCard && v == 1) {

              } else {
                this.setState({activeOne: v})
              }
            }
            }/>
          </div>
          {
            [{
              key: "cardNum",
              name: '信用卡卡号', value: "",
              placeHolder: "请输入卡号", icon: "/static/img/扫一扫@2x.png"
            }, {
              name: '姓名', value: "",
              placeHolder: "请输入姓名",
              disabled: activeOne == 0 ? true : false,
              key: "username"
            }, {
              name: '持卡人身份证', value: "",
              placeHolder: "请输入身份证号码",
              disabled: activeOne == 0 ? true : false,
              key: "id"
            }, {
              key: "bank",
              name: '发卡行', value: "",
              placeHolder: "点击识别发卡行",
              btnTag:true,
              disabled:true,
            }, {
              key: "phone",
              name: '手机号', value: "",
              placeHolder: "请输入发卡行预留手机号",
            }].map((v, k) => {
              const {name, disabled =false, btnTag=false, key, value, placeHolder, icon} = v;
              const {cardData = []} = this.state;
              let property = activeOne == 1 ? 'usalCardData' : "cardData";
              const val = this.state[property][key]?this.state[property][key]:''
              return <div key={k} style={styles.item}>
                <div style={styles.name}>{name}</div>
                {
                  !btnTag? <input
                    onClick={() => {
                      if (key == 'bank') {
                        if (activeOne == 1) {
                          this.findBank('usalCardData')
                        } else {
                          this.findBank('cardData')
                        }
                      }
                    }}
                    disabled={disabled}
                    onChange={(e) => {
                      if(this.inputLimit(key,e.currentTarget.value.trim())){
                        return;
                      }

                      if (activeOne == 1) {
                        this.setDeepState('usalCardData', key, e.currentTarget.value.trim(), () => {
                          if(key == 'cardNum'){
                            this.setDeepState('usalCardData', 'bank', '',
                              ()=>this.setDeepState('usalCardData', 'bankType', '',()=>this.enableBtn('usalCardData')))
                            return

                          }
                          this.enableBtn('usalCardData')
                        })

                      } else {
                        this.setDeepState('cardData', key, e.currentTarget.value.trim(), () => {
                          if(key == 'cardNum'){
                            this.setDeepState('cardData', 'bank', '',
                              ()=>this.setDeepState('cardData', 'bankType', '',()=>this.enableBtn('cardData')))
                            return

                          }
                          this.enableBtn('cardData')
                        })
                      }
                    }}
                    value={
                      activeOne == 0?(key=='username'?
      `*${val.slice(1)}`

                        :key=='id'?
                          (val?
      `${val.slice(0,4)}${new Array(val.length-7).join('*')}${val.slice(-4,val.length)}`
    :"")
                          :val)
                        :val
                    }
                    style={styles.input} placeholder={placeHolder}/>
                    :<div  onClick={() => {
                              if (key == 'bank') {
                                if (activeOne == 1) {
                                  this.findBank('usalCardData')
                                } else {
                                  this.findBank('cardData')
                                }
                              }
                            }}
                           style={styles.input} placeholder={placeHolder}
                    >
                    {val?val:placeHolder}
                  </div>
                }

                {icon ? <img onClick={() => {  jsNative.nativeOcrBankCard().then((data)=>{
                                  const {
                                    cardType,
                                    bankName,
                                    expiryDate,
                                    bankCode,
                                    cardName,
                                    cardNumber = '',
                                    errorCode,
                                  } = data;


                                  if (activeOne == 1) {
                                    this.setDeepState('usalCardData', key, cardNumber, () => this.enableBtn('usalCardData'))

                                  } else {
                                    this.setDeepState('cardData', key, cardNumber, () => this.enableBtn('cardData'))

                                  }
                              })}}
                             src={icon} style={ styles.img}/> : null}
              </div>

            })
          }
          <div style={styles.tips}>请核对卡号信息，确认无误</div>
          <div className={enableBtn?'enableBtn':'disableBtn'}
               onClick={() => {
                if (activeOne == 1) {
                  this.bindCard('usalCardData')
                } else {
                  this.bindCard('cardData')
                }
               }}
          >确认
          </div>
          <ModalCom visible={modal} showAction={(v) => {
            this.setState({modal: v})
          }} description={description}/>

        </div>];
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