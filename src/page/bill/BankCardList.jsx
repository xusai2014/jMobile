import React from 'react';
import Header from "../../compoents/Header";
import { Icon } from "antd-mobile";
import {InitDecorator} from "../../compoents/InitDecorator";
import {getCardsList} from "../../actions/reqAction";
import bankData from '../../utils/bank';

@InitDecorator(
  (state)=>{
    return {
      cardsList:state.CardsReducer.cardsList
    }
  }
)
export default class BankCardList extends React.Component{

  async getCards(){
    this.props.dispatch(getCardsList({
      type:'01',
    })).then((result) => {

    }, (err) => {

    });

  }

  componentDidMount(){
    this.getCards()
  }
  render(){
    const {cardsList} =this.props;
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
        cardsList.map((v,k)=>{
          const { bankNm, actNo,actName, bankNo } = v;
          return [<div key={k} onClick={()=>{this.props.history.push('/manual/add',{
            fullCardNum:actNo, nameOnCard:actName, bankNo,bankName:bankNm,
          })}} style={{margin:"0 0.3rem 0 0",background: '#FFFFFF',width:'7.5rem',height:'1rem',display:'flex',alignItems:'center'}}>
            <span style={{width:'0.58rem',borderRadius:'0.29rem',margin:"0 0.47rem 0 0.33rem"}}>
              <img style={{width:'0.58rem'}} src={bankData[bankNo]?bankData[bankNo]:""} /></span>
            <div style={{width:"5.45rem",
              fontSize: '0.31rem',
              color: '#999999',
              letterSpacing: '0',
            }}>{bankNm} <span>({actNo.substr(-4,4)})</span></div>
            <Icon type="right" size="md" color="#999999" />
          </div>,<div key={actNo} style={{width:"7.5rem",height:"0.3rem"}}></div>]

        })
      ]}
    </div>,]
  }
}