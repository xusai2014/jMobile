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
                  <img style={{width: '0.6rem'}} src={imgSrc}/>
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
        }}>总额度{credit_limit}万元|剩余额度{balance}</div>
      </div>
    </div>)
  }
}