import React from 'react';


export default class Card extends React.Component {
  render() {
    const { popupCard,actName, id, bankNm,payment_due_date,card_limit,actNo,bankNo } =this.props;
    return (<div style={styles.container}>
      <div>
        <div style={styles.rowItem}>
          <img style={{width: '0.4rem', margin: '0.16rem', height: "0.4rem"}} src="/static/img/交通银行@2x.png"/>
        </div>
        <div style={{width: '3rem', display: 'inline-block', marginLeft: '0.21rem', marginTop: '0.47rem',}}>
          <div style={{
            fontSize: '0.3rem', color: '#FFFFFF',
            letterSpacing: "-0.83PX",
          }}>{bankNm}</div>
          <div style={{
            fontSize: '0.24rem', color: '#FFFFFF',
            letterSpacing: '0'
          }}>{actName}<span style={{margin: "0 0.165rem"}}>|</span>尾号{actNo.substr(-4,4)}</div>
        </div>
        <div style={styles.img}>
          <img src="/static/img/设置@2x.png" style={{width:'0.3rem'}}  onClick={()=>{
            popupCard(id)
          }}/>
        </div>

      </div>
      <div
        style={{
          opacity: "0.8",
          fontSize: "0.24rem",
          color: '#FFFFFF',
          letterSpacing: '0',
          marginTop: '0.66rem',
        }}
      ><span style={{marginLeft: '0.53rem'}}>免息期：{'50'}天</span>
        <span style={{
        float: 'right',
        marginRight: '0.5rem'
      }}>单笔限额：{card_limit}万元</span>
      </div>

      <div className="menu-mask" onClick={this.onMaskClick} />

    </div>)
  }
}
const styles = {
  container:{
    margin: '0.24rem 0.16rem',
    width: '7.18rem',
    backgroundImage: "linear-gradient(-133deg, #6475E9 0%, #5E53D0 100%)",
    boxShadow: "0 0.06rem 0.12rem 0 #A7AEFD",
    borderRadius: "0.08rem",
    height: '2.64rem',
    position: 'relative'
  },
  rowItem:{
    width: "0.72rem", height: '0.72rem',
    background: '#FFFFFF', borderRadius: '0.36rem',
    marginLeft: '0.53rem', marginTop: '0.47rem',
    display: 'inline-block'
  },
  img:{
    width:"0.3rem",
    float:'right',
    margin:" 0.5rem 0.5rem 0 0"
  }
}