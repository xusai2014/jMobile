import React from 'react';

export default class BillCard extends React.Component {


  render() {
    return <div style={{ background: '#FFFFFF',marginTop:'0.2rem',padding:"0.3rem 0",position: 'relative'}}>
      <div style={{ display:'flex',alignItems:'center'}}>
        <div style={{
          margin: '0 0.14rem 0 0.28rem',
          display: "inline-block",
          borderRadius: "0.18rem",
          background: '#E41E26',
          height: '0.36rem',
        }}><img src="/static/img/招商银行@2x.png" style={{
          height: '0.36rem',
        }}/></div>
        <span style={{
          fontSize: '0.26rem',
          color: '#333333',
          letterSpacing: '0',
          textAlign: 'center',
        }}>招商银行</span>
        <span style={{
          fontSize: "0.28rem",
          color: '#999999',
          letterSpacing: '0',
          textAlign: 'center',
          marginLeft:'0.18rem'
        }}

        >2886</span>
        <img src="/static/img/更新@2x.png" style={{
          height: '0.36rem',
          marginLeft:'3.74rem',
        }}/>
      </div>
      <div style={{
        marginTop:'0.31rem',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
        display:'inline-block',
          marginLeft:"0.3rem"
        }}>
          <div style={{
            fontSize: '0.3rem',
            color: '#333333',
            letterSpacing: '0',
            textAlign: 'center',

          }}>4800.56</div>
          <div style={{
            fontSize: '0.22rem',
            color: '#999999',
            letterSpacing: '0',
            textAlign: 'center',
          }}>本期账单</div>
        </div>
        <div style={{
          display:'inline-block',
          marginLeft:"1.88rem",
          fontSize: '0.5rem',
          color: '#999999',
          letterSpacing: '0',
          textAlign: 'center'
        }}>
          8
        </div>
        <div style={{
          display:'inline-block',
          marginLeft:"0.26rem",
        }}>
          <div style={{
            fontSize: '0.22rem',
            color: '#999999',
            letterSpacing: '0',
          }}>天后到期</div>
          <div style={{
              fontSize: '0.2rem',
              color: '#999999',
              letterSpacing: '0',
            }}>08-22</div>
        </div>
        <div style={{
          display:'inline-block',
          background: '#4C7BFE',
          borderRadius: '0.6rem',
          fontSize: '0.22rem',
          color: '#FFFFFF',
          letterSpacing: '0',
          textAlign: 'center',
          marginLeft:'1.3rem',
          width:'1.26rem',
          height:'0.53rem',
          lineHeight: '0.53rem'
        }} onClick={()=>this.props.repay()}>
          立即还款
        </div>
      </div>
      <img src="/static/img/示例@2x.png" style={{ width:"0.71rem",position: 'absolute', right: '0', top: '0'}}/>
    </div>
  }
}