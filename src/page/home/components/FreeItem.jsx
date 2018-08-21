import React from 'react';

export default class FreeItem extends React.Component{
  render(){
    const {

      credit_limit,
      imgSrc,
      title,
      card_number,
      freeInterest,
      balance,
    } = this.props;
    return (<div style={{textAlign: 'left', margin: "0.23rem 0"}}>
                <span style={{width: '0.6rem', borderRadius: '0.3rem'}}>
                  <img style={{width: '0.6rem',borderRadius:"0.3rem"}} src={imgSrc}/>
                </span>
      <div style={{display: "inline-block", margin: "0 0 0 0.14rem"}}>
        <div style={{
          fontSize: '0.24rem',
          color: '#333333',
          textAlign: 'left',
          letterSpacing: '0',
        }}>{title}({card_number})
        </div>
        <div style={{
          fontSize: '0.2rem',
          color: '#999999',
          letterSpacing: '0',
        }}>总额度{credit_limit}元|剩余额度{balance}元</div>
      </div>
      <div
        style={{
          display: 'inline-block',
          float: 'right',
          marginRight: '0.33rem',
          fontSize: '0.32rem',
          color:'#333333',
          letterSpacing: '-0.89px',
        }}
      >{freeInterest}天</div>
    </div>)
  }
}