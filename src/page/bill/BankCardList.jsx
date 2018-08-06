import React from 'react';
import Header from "../../compoents/Header";
import { Icon } from "antd-mobile";

export default class BankCardList extends React.Component{
  render(){
    return [<Header key={'a'} title="手写账单"/>,<div key={'b'}>
      {[
        <div key={'e'} onClick={()=>{
          this.props.history.push('/manual/handlebill')
        }} style={{background: '#FFFFFF',width:'7.5rem',height:'1rem',display:'flex',alignItems:'center'}}>
          <div style={{width:"6.5rem",
            margin:"0 0 0 0.33rem",
            fontSize: '0.31rem',
            color: '#333333',
            letterSpacing: '0',
          }}>其它银行卡</div>
          <Icon type="right" size="md" color="#999999" />
        </div>,
        <div key={'c'} style={{width:"7.5rem",height:"0.3rem"}}></div>,
        [{
          name:'招商银行',
          action:"",
          imgSrc:"/static/img/招商银行@2x.png",
          cardNum:"2233"
        },{
          name:'交通银行',
          action:"",
          imgSrc:"/static/img/jiaotong@2x.png",
          cardNum:"4455"
        }].map((v,k)=>{
          const { name, cardNum, action, imgSrc} = v;
          return [<div key={k} onClick={()=>{this.props.history.push('/manual/add')}} style={{margin:"0 0.3rem 0 0",background: '#FFFFFF',width:'7.5rem',height:'1rem',display:'flex',alignItems:'center'}}>
            <span style={{width:'0.58rem',borderRadius:'0.29rem',margin:"0 0.47rem 0 0.33rem"}}><img style={{width:'0.58rem'}} src={imgSrc} /></span>
            <div style={{width:"5.45rem",
              fontSize: '0.31rem',
              color: '#999999',
              letterSpacing: '0',
            }}>{name} <span>({cardNum})</span></div>
            <Icon type="right" size="md" color="#999999" />
          </div>,<div key={cardNum} style={{width:"7.5rem",height:"0.3rem"}}></div>]

        })
      ]}
    </div>,]
  }
}