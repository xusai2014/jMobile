import React from 'react';

export default class FreeItem extends React.Component{
  render(){
    const {imgSrc, title, des, cardNum} = this.props;
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
        }}>{title}({cardNum})
        </div>
        <div style={{
          fontSize: '0.2rem',
          color: '#999999',
          letterSpacing: '0',
        }}>{des}</div>
      </div>
    </div>)
  }
}