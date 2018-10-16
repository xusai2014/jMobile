import React from 'react';
import {InitDecorator} from "../../../compoents/InitDecorator";
import {setBillRest} from "../../../actions/reqAction";
import { Toast } from 'antd-mobile'

@InitDecorator((state) => {
  return {
  }
})
export default class KeyWord extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      repaymentAmount:'',
    }
  }

  markRest(activeCard){
    const {card_num:cardNum,bank_id:bankId} = activeCard;
    const { repaymentAmount,x } = this.state;
    if(!repaymentAmount){
      Toast.info('请输入还款金额');
      return
    }
    if(/(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/.test(repaymentAmount)){

    } else {
      Toast.info('请输入正确金额');
      return
    }
    this.props.dispatch(setBillRest({
      cardNum,
      bankId,
      repaymentAmount
    })).then((result)=>{
      Toast.info('标记成功')
      this.props.apiCallback()
    },(err)=>{
    })
  }
  render(){
    const { repaymentAmount, x } = this.state;
    const { billData:activeCard } = this.props

    return (
      <div>
        <input type="number" onKeyDown={(e)=>{
          if(parseInt(e.keyCode) == 13){
            this.markRest(activeCard)
          }
        }} onChange={(e)=>{

          this.setState({
            repaymentAmount:e.currentTarget.value,
          })

        }}
               autoFocus={true}
               value={repaymentAmount} style={styles.input} placeholder="请输入账单金额"/>
      </div>
    )
  }
}

const styles = {
  input:{
    border: '0.02rem solid #ECECEC',
    borderRadius: '0.09rem',
    margin:'0.24rem 0.28rem',
    width:'6.94rem',
    lineHeight:'0.74rem'
  },
  fontStyle:{
    fontSize: '0.42rem',
    color: '#555555',
    letterSpacing: '0',
  }
}