import React from 'react';
import {InitDecorator} from "../../../compoents/InitDecorator";
import {setBillRest} from "../../../actions/reqAction";

@InitDecorator((state) => {
  return {
  }
})
export default class KeyWord extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      repaymentAmount:''
    }
  }

  markRest(activeCard){
    const {cardNum,bankId} = activeCard;
    const { repaymentAmount } = this.state;
    this.props.dispatch(setBillRest({
      cardNum,
      bankId,
      repaymentAmount
    })).then((result)=>{
      debugger
    },(err)=>{
      debugger
    })
  }
  render(){
    const { repaymentAmount } = this.state;
    const { billData:activeCard } = this.props

    return (
      <div>
        <input type={"number"} onChange={(e)=>{
          this.setState({
            repaymentAmount:e.currentTarget.value,
          })
        }} value={repaymentAmount} style={styles.input} placeholder="请输入账单金额"/>
        <button onClick={()=>{
          this.markRest(activeCard)
        }}>确定</button>
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