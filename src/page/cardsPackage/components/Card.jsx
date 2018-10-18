import React from 'react';
import bankIcon from '../../../utils/bank';


export default class Card extends React.Component {
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

  render() {
    const { popupCard,actName,import_bill_type:bill_type, id, bankNm,payment_due_date,card_limit,actNo,bankNo,bindType } =this.props;
    const freeDay1 = bill_type == 'DONE'? parseInt(moment(payment_due_date).diff(moment(), 'days')) + parseInt(moment().daysInMonth()):
      parseInt(moment(payment_due_date).diff(moment(), 'days'))
    return (<div style={bindType=='02'?styles.containerGray:styles.container}>
      <div style={{display:'inline-flex',alignItems:"center"}}>
        <div style={styles.rowItem}>
          <img style={{width: '0.76rem', height: "0.76rem"}} src={bankIcon[bankNo]?bankIcon[bankNo]:'/static/img/bank/313@1x.png'}/>
        </div>
        <div style={{width: '3rem', display: 'inline-block', marginLeft: '0.21rem', marginTop: '0.47rem',}}>
          <div style={{
            fontSize: '0.3rem', color: '#FFFFFF',
            letterSpacing: "-0.83PX",
          }}>{bankNm}</div>
          <div style={{
            fontSize: '0.24rem', color: '#FFFFFF',
            letterSpacing: '0',
            display:'inline-flex',
            alignItems:'center',
          }}>
            <span>{`*${actName.slice(1)}`}</span>
            <span style={{margin: "0 0.165rem"}}>|</span>
            <span>尾号{actNo.substr(-4,4)}</span>
            {
              bindType=='02'?'':<img src="/static/img/personal.png" style={{width: '0.24rem', marginLeft: '0.2rem'}} />
            }
          </div>

        </div>
        <div style={styles.img} onClick={()=>{
          popupCard(id)
        }}>
          <img src="/static/img/设置@2x.png" style={{width:'0.3rem'}}  />
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
      ><span style={{marginLeft: '0.53rem'}}>免息期：{
        payment_due_date?freeDay1 +'天':'--'}</span>
        <span style={{
        float: 'right',
        marginRight: '0.5rem'
      }}>单笔限额：{card_limit?this.generateStr(parseInt(card_limit)):'--'}元</span>
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
  containerGray:{
    margin: '0.24rem 0.16rem',
    width: '7.18rem',
    backgroundImage: "linear-gradient(-133deg, #B3B7CF 0%, #7C8094 100%)",
    boxShadow: "0 0.06rem 0.12rem 0 #CACBCE",
    borderRadius: "0.08rem",
    height: '2.64rem',
    position: 'relative',
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
    marginLeft: '1.9rem',
    marginTop: '0.2rem'
  }
}