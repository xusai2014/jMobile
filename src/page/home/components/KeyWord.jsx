import React from 'react'
export default class KeyWord extends React.Component {


  render(){

    return (
      <div>
        <input type={"number"} style={styles.input} placeholder="请输入账单金额"/>
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