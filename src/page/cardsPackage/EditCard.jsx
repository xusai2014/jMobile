import React from 'react';
import Header from '../../compoents/Header';
import InputRadio from "./components/InputRadio";
import { Modal, Toast } from 'antd-mobile'
import ModalCom from "../../compoents/ModalCom";
import {InitDecorator} from "../../compoents/InitDecorator";
import {
  identityBank, judgeSelfCard, postInfo, sendVerification,
  verifySMSCode
} from "../../actions/reqAction";
const prompt = Modal.prompt;

@InitDecorator((state)=>{
  return {
    bindSelfCard:state.CardsReducer.bindSelfCard,
    fromBank:state.CardsReducer.fromBank,
    identityInfo:state.CardsReducer.identityInfo,
  }
})
export default class EditCard extends React.Component {
  constructor(props){
    super(props);
    const { identityInfo } = this.props;
    const { name,idCardNo} = identityInfo;

    this.state = {
      activeOne:0,
      modal:false,
      description:'',
      cardData:{
        cardNum:"",
        username:name,
        id:idCardNo,
        bank:'',
        phone:"",
        bankType:'',
      },
      usalCardData:{
        cardNum:"",
        username:'',
        id:'',
        bank:'',
        phone:"",
        bankType:'',
      }
    }
  }

  findBank(key){
    const cardData = this.state[key];
    if(!cardData['cardNum']){
      Toast.info('请先输入卡号');
    }
    //M543
    const {cardNum:cardNo} = cardData
    this.props.dispatch(identityBank({
      cardNo,
      type:'2'
    })).then((result)=>{
      const { data } = result;
      const { bankNm,type } = data;
      if(bankNm){
        this.setDeepState(key,'bank',bankNm)
        this.setDeepState(key,'bankType',type)
      }
    })
  }

  async bindCard(key){

    const {
      cardNum:cardNo ='6221560486792149',
      username:idName,
      id:idNo,
      bank,
      phone:resvPhoneNo = '18800102517',
      bankType:bankNo,
    } = this.state[key]

    let r = await this.props.dispatch(postInfo({
      cardNo,
      idName,
      idNo,
      resvPhoneNo,
      bankNo
    }))

    const { data } = r;

    const { result, resultMsg,bindType } = data;
    if(result != '00'){
      Toast.info(resultMsg)
    } else {

      this.props.dispatch(sendVerification({
        channelNo:'01',
        busineType:'04',
        phone:resvPhoneNo
      })).then(()=>{
        prompt('输入验证码', `请输入手机号${resvPhoneNo}收到的验证码`, [{
          text: '取消',
          onPress: value => new Promise((resolve) => {
            resolve();
          }),
        },
          {
            text: '确定',
            onPress: value => new Promise((resolve, reject) => {
              const { MERC_SN } = this.props.identityInfo;
              this.props.dispatch(verifySMSCode({
                channelNo:'01',
                busineType:"04",
                phone:resvPhoneNo,
                verifyCode:value,
                mno:MERC_SN,
                bankNo,
                cardNo,
                resvPhoneNo:resvPhoneNo,
                bindType,
              })).then((result)=>{
                Toast.info('绑卡成功')
                this.props.history.push('/cards/cardslist')
                resolve();
              },()=>{
                reject();
              })
            }),
          },
        ], 'default', null, ['请输入验证码'])
      },()=>{

      })
    }


  }

  componentWillMount(){
    this.props.dispatch(judgeSelfCard());
  }

  setDeepState(property,key,value) {
    const s = this.state[property]

    this.setState({
      [property]:{
        ...s,
        [key]:value
      }

    })
  }

  render() {
    const { activeOne,modal,description } = this.state;

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
        <InputRadio activeOne={ activeOne } setActiveOne={(v)=>{
          if(!this.props.bindSelfCard && v == 1){

          } else {
            this.setState({activeOne:v})
          }
        }
        }/>
      </div>
      {
        [{
          key:"cardNum",
          name: '信用卡卡号', value: "",
          placeHolder: "请输入卡号", icon: "/static/img/扫一扫@2x.png"
        },{
          name: '姓名', value: "",
          placeHolder: "请输入姓名",
          disabled:activeOne==0?true:false,
          key:"username"
        },{
          name: '持卡人身份证', value: "",
          placeHolder: "请输入身份证号码",
          disabled:activeOne==0?true:false,
          key:"id"
        },{
          key:"bank",
          name: '发卡行', value: "",
          placeHolder: "请输入发卡行",
        },{
          key:"phone",
          name: '手机号', value: "",
          placeHolder: "请输入发卡行预留手机号",
        }].map((v, k) => {
            const {name,disabled,key, value, placeHolder, icon} = v;
            const { cardData = []} = this.state;
            let property = activeOne == 1?'usalCardData':"cardData"
          return <div key={k} style={styles.item}><div style={styles.name}>{name}</div>
            <input
              onClick={()=>{

                if(key == 'bank'){
                  if(activeOne == 1){
                    this.findBank('usalCardData')
                  } else {
                    this.findBank('cardData')
                  }
                }
              }}
              onChange={(e)=>{
                if(activeOne == 1){
                  this.setDeepState('usalCardData',key,e.currentTarget.value)
                } else {
                  this.setDeepState('cardData',key,e.currentTarget.value)
                }

            }} value={this.state[property][key]} disabled={disabled} style={styles.input} placeholder={placeHolder}/>
            {icon ? <img src={icon} style={ styles.img}/> : null}
          </div>

        })
      }
      <div style={styles.tips}>请核对卡号信息，确认无误</div>
      <div style={styles.finishBtn} onClick={()=>{
        if(activeOne == 1){
          this.bindCard('usalCardData')
        } else {
          this.bindCard('cardData')
        }
      }}>确认</div>
      <ModalCom visible={modal} showAction={(v)=>{this.setState({modal:v})}} description={description}/>

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
  tips:{
    fontSize: '0.24rem',
    color: '#5481FE',
    letterSpacing: '-0.77PX',
    margin:"0.31rem 0 0 0.31rem"
  },
  finishBtn:{
    background:'#4C7BFE',
    boxShadow: '0 0.06rem 0.12rem 0 #9BB5FF',
    borderRadius: "0.08rem",
    margin:"1.4rem 0.16rem 0 0.16rem",
    lineHeight:"1.18rem",
    textAlign:'center',
    fontSize: "0.34rem",
    color: "#FFFFFF",
    letterSpacing: '-0.011rem',
  }
}