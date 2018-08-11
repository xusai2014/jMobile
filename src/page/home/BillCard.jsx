import React from 'react';
import {withRouter} from "react-router-dom";

@withRouter
export default class BillCard extends React.Component {

  judgeStatus(bill_type, payment_due_date, bill_date) {
    if (bill_type == 'DONE') {
      const duM = moment(payment_due_date);
      return {
        day: duM.diff(moment(), 'days'),
        date: duM.format('MM-DD'),
        des:'天后到期'
      }
    } else if (bill_type == 'UNDONE') {
      const duM = moment(bill_date);
      return {
        day: duM.diff(moment(), 'days'),
        date: duM.format('MM-DD'),
        des:'天后到期'
      }
    } else {
      return {
        day: "",
        date: '',
        des:''
      }
    }

  }

  render() {
    const {
      card_num,
      bank_name,
      bill_type,
      current_bill_amt,
      payment_due_date = moment().format('YYYY-MM-DD'),
      task_id,
      bill_id,
      bill_date,
      logo_uri,
    } = this.props;

    const { day, date, des} = this.judgeStatus(bill_type, payment_due_date, bill_date)
    return <div onClick={()=>this.props.history.push(`/bill/detail/${bill_id}`)} style={{background: '#FFFFFF', marginTop: '0.2rem', padding: "0.3rem 0", position: 'relative'}}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div style={{
          margin: '0 0.14rem 0 0.28rem',
          display: "inline-block",
          borderRadius: "0.18rem",
          background: '#E41E26',
          height: '0.36rem',
        }}><img src={logo_uri} style={{
          height: '0.36rem',
        }}/></div>
        <span style={{
          fontSize: '0.26rem',
          color: '#333333',
          letterSpacing: '0',
          textAlign: 'center',
        }}>{bank_name}</span>
        <span style={{
          fontSize: "0.28rem",
          color: '#999999',
          letterSpacing: '0',
          textAlign: 'center',
          marginLeft: '0.18rem'
        }}

        >{card_num}</span>
        <img src="/static/img/更新@2x.png" style={{
          height: '0.36rem',
          marginLeft: '3.74rem',
        }}/>
      </div>
      <div style={{
        marginTop: '0.31rem',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'inline-block',
          marginLeft: "0.3rem"
        }}>
          <div style={{
            fontSize: '0.3rem',
            color: '#333333',
            letterSpacing: '0',
            textAlign: 'center',
          }}>{current_bill_amt}</div>
          <div style={{
            fontSize: '0.22rem',
            color: '#999999',
            letterSpacing: '0',
            textAlign: 'center',
          }}>本期账单
          </div>
        </div>
        <div style={{
          display: 'inline-block',
          marginLeft: "1.88rem",
          fontSize: '0.5rem',
          color: '#999999',
          letterSpacing: '0',
          textAlign: 'center'
        }}>
          {day}
        </div>
        <div style={{
          display: 'inline-block',
          marginLeft: "0.26rem",
        }}>
          <div style={{
            fontSize: '0.22rem',
            color: '#999999',
            letterSpacing: '0',
          }}>{des}
          </div>
          <div style={{
            fontSize: '0.2rem',
            color: '#999999',
            letterSpacing: '0',
          }}>{date}</div>
        </div>
        <div style={{
          display: 'inline-block',
          background: '#4C7BFE',
          borderRadius: '0.6rem',
          fontSize: '0.22rem',
          color: '#FFFFFF',
          letterSpacing: '0',
          textAlign: 'center',
          marginLeft: '1.3rem',
          width: '1.26rem',
          height: '0.53rem',
          lineHeight: '0.53rem'
        }} onClick={(e) => this.props.repay(e)}>
          立即还款
        </div>
      </div>
      <img src="/static/img/示例@2x.png" style={{width: "0.71rem", position: 'absolute', right: '0', top: '0'}}/>
    </div>
  }
}