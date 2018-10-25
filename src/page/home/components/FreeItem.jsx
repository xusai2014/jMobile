import React from 'react';

export default class FreeItem extends React.Component{
  generateStr(v){
    let unit = '';
    let ba = v;
    if(v/10000 >= 1){
      ba =v/10000
      unit= '万';
    } else if(v/1000>=1){
      ba =v/1000;
      unit= '千';
    }
    return ba.toFixed(2)+unit
  }
  render(){
    const {

      imgSrc,
      title,
      card_number,
      freeInterest,
      balance,
    } = this.props;
    return (<div style={{textAlign: 'left',height:'1.09rem',borderTop: '1PX solid #F0F0F0', display: 'flex',alignItems: 'center',margin: "0.19rem 0"}}>
                <span style={{width: '0.6rem', borderRadius: '0.24rem'}}>
                  <img style={{width: '0.48rem', height:'0.48rem',borderRadius:"0.24rem"}} src={imgSrc}/>
                </span>
      <div style={{display: "inline-block", margin: "0 0 0 0.14rem"}}>
        <div style={{
          fontSize: '0.26rem',
          color: '#333333',
          textAlign: 'left',
          letterSpacing: '0',
          fontWeight: "bolder",
        }}>{title}({card_number})
        </div>
        <div style={{
          fontSize: '0.22rem',
          color: '#999999',
          letterSpacing: '0',
        }}>可用约{this.generateStr(parseInt(balance))}元</div>
      </div>
      <div
        style={{
          display: 'inline-block',
          float: 'right',
          marginLeft: '1.24rem',
          fontSize: '0.32rem',
          color:'#333333',
          letterSpacing: '-0.89px',
        }}
      >{parseInt(freeInterest) >0?freeInterest:0}天</div>
    </div>)
  }
}