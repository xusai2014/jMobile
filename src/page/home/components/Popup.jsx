import React from 'react';
import {Icon} from "antd-mobile";
import {getHUandao} from "../../../actions/reqAction";
import { connect } from "react-redux";
import { jsNative } from 'sx-jsbridge';

@connect()
export default class Popup extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      type:'0',
      selectData:[]
    }
  }

  renderList(){
    const {type,selectData} = this.state;
    const data = this.methodList();
    switch(type) {
      case '0':
        return data.map((v,k)=>{
          const {imgSrc, name, des, type,color, node,action} = v;
          return [<div style={{
            display: 'flex',
            alignItems: 'center',

          }}  onClick={()=>{
            if(type == '0'){
              action();

            } else if(type == '1'){
              this.setState({type,selectData:node})
            }
          }}>
            <img src={imgSrc} style={{margin:"0.3rem 0.26rem 0.31rem 0.28rem",width:'0.45rem'}}/>
            <span style={{
              fontSize: '0.32rem',
              color: '#333333',
            }} >{name}</span><span style={{
            fontSize: '0.32rem',
            color: color,
          }} >{des}</span>
          </div>,<div style={{
            border: '1PX solid #F1F1F1',
            width:'6.94rem',
            margin:'auto'
          }}></div>]
        })
      case '1':
        return selectData.map((v,k)=>{
          const {imgSrc, name, des, type,color, node} = v;
          return [<div style={{
            display: 'flex',
            alignItems: 'center',

          }}  onClick={()=>{
            if(type == '0'){

            } else if(type == '1'){
              this.setState({type,selectData:node})
            }
          }}>
            <img src={imgSrc} style={{margin:"0.3rem 0.26rem 0.31rem 0.28rem",width:'0.45rem'}}/>
            <span style={{
              fontSize: '0.32rem',
              color: '#333333',
            }} >{name}</span><span style={{
            fontSize: '0.32rem',
            color: color,
          }} >{des}</span>
          </div>,<div style={{
            border: '1PX solid #F1F1F1',
            width:'6.94rem',
            margin:'auto'
          }}></div>]
        })
    }

  }

  async callHuandao(){
    this.props.dispatch(getHUandao({
    })).then((result)=>{
      const { data = {} } = result;
      const {telEnc,token,finId} = data;
      jsNative.nativeOpenOldWebView({url:`https://lns-front-test.vbillbank.com/transitionPageService?telNo=${telEnc}&token=${token}&appId=${finId}&h5Channel=MPOS_XYKHK`},()=>{})
    },()=>{})


  }

  methodList() {
    return [
      {imgSrc: "/static/img/还@2x.png", name: '还到', action:this.callHuandao.bind(this), type: '0', des: '（授信额度30000元）', color: '#4d7cfe'},
      {
        imgSrc: "/static/img/qita@2x.png", name: '其它', action:()=>{}, type: '1', des: '', color: '', node: [
        {imgSrc: "/static/img/微信@2x.png", name: '微信', action: ()=>{jsNative.openOtherApp({name:'webchat'},()=>{})}, type: '0', des: '', color: ''},
        {imgSrc: "/static/img/支付宝@2x.png", name: '支付宝', action: ()=>{jsNative.openOtherApp({name:'alipay'},()=>{})}, type: '0', des: '', color: ''}
      ]
      },
    ]
  }

  render(){
    const { visible, setVisible, title = '选择还款方式' ,style = {} } = this.props;
    return <div style={{
      position:'fixed',
      bottom: '0rem',
      width:'7.5rem',
      height:document.documentElement.clientHeight,
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: '10',
      ...style,
    }}>
      <div style={{
        position: 'absolute',
        bottom: '0',
        background: '#fff',
        width: '7.5rem',
        height:'4.29rem',
      }}>
        <div style={{
          fontSize: '0.36rem',
          color: '#333333',
          letterSpacing: '0',
          margin:"0.31rem 0 0.19rem 0",
          textAlign: 'center'
        }}><span>{title}</span> <span style={{
          float: 'right',
          marginRight: '0.3rem'
          }} onClick={()=>{
            this.props.setVisible(false)}}
        ><Icon type="cross" size="md" color="#000"/></span></div>
        <div style={{
          border: '1PX solid #F1F1F1',
          width:'6.94rem',
          margin:'auto'
        }}></div>
        {
          this.renderList()
        }
      </div>

      </div>
  }
}