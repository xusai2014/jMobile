import React from 'react';
import Header from '../../compoents/Header';
import { Toast} from 'antd-mobile'
import {InitDecorator} from "../../compoents/InitDecorator";
import {handleBillForm, identityBank} from "../../actions/reqAction";
import DayPicker from "./DayPicker";

@InitDecorator(
  (state) => {
    return {
      handeBill: state.BillReducer.handeBill
    }
  }
)
export default class AddBill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeOne: 0,
      description: '',
      visible: false,
      accountDate: '',
      repayDate: '',
      bankName: "",
      fullCardNum: "",
      nameOnCard: "",
      creditLimit: "",
      newBalance: "",
      bankNo: "",
      enabelBtn: false
    }
  }

  findBank() {
    const {fullCardNum} = this.state

    this.props.dispatch(identityBank({
      cardNo: fullCardNum,
      type: '2'
    })).then((result) => {
      const {data} = result;
      const {bankNm, type} = data;
      this.setState({
        bankName: bankNm,
        bankNo: type,
      })
    })
  }

  enableBtn() {
    const {
      accountDate: billDate,
      repayDate: paymentDueDate,
      creditLimit,
      newBalance,
    } = this.state;
    if (billDate && paymentDueDate && creditLimit && newBalance) {
      this.setState({enabelBtn: true})
    } else {

      this.setState({enabelBtn: false})
    }

  }

  inputLimit(key, val) {
    if (!val) {
      return false
    }
    switch (key) {
      case 'creditLimit':
        return !/^[0-9]*(.)?[0-9]*$/.test(val) || val.length > 10
      case 'newBalance':
        return !/^[0-9]*(.)?[0-9]*$/.test(val) || val.length > 10
      default:
        return false;
    }
  }

  commitForm() {
    const {
      accountDate: billDate,
      repayDate: paymentDueDate,
      creditLimit,
      newBalance,
    } = this.state;
    if (!billDate) {
      Toast.info('请填写账单日');
      return;
    } else if (!paymentDueDate) {
      Toast.info('请填写还款日');
      return;
    } else if (!creditLimit) {
      Toast.info('请填写信用额度');
      return;
    } else if (!newBalance) {
      Toast.info('请填写账单金额');
      return;
    }
    if (parseInt(creditLimit) < parseInt(newBalance)) {
      Toast.info('账单金额不能大于信用额度');
      return;
    }
    if (!/^[0-9]+(.[0-9]+)?$/.test(creditLimit)) {
      Toast.info('输入信用额度不合法');
      return;
    }
    if (!/^[0-9]+(.[0-9]+)?$/.test(newBalance)) {
      Toast.info('输入账单金额不合法');
      return;
    }

    const {state} = this.props.location;
    const {fullCardNum, nameOnCard, bankNo, bankName} = state
    this.props.dispatch(handleBillForm({
      bankName,
      billDate: this.handeleDate(billDate),
      fullCardNum,
      paymentDueDate: this.handeleDate(paymentDueDate),
      nameOnCard,
      creditLimit,
      newBalance,
      bankNo,
    })).then(() => {
      Toast.info('手写账单成功');
      this.props.history.push('/home/index')
    })
  }

  handeleDate(date) {
    if (parseInt(date) < 10) {
      return '0' + date
    } else {
      return date
    }
  }

  render() {
    const {
      enabelBtn,
    } = this.state;

    return [<Header key={1} title="手写账单"/>, <style key={2}>
      {
        `
          input::-webkit-input-placeholder, {
            color: 'red';
            font-size:'1px';
          }
        `
      }
    </style>, <div key={3}>
      {
        [{
          name: '账单日', value: "",
          placeHolder: "请选择",
          code: "1",
          key: 'accountDate',
          type: 'date'
        }, {
          name: '还款日', value: "",
          placeHolder: "请选择",
          code: "1",
          key: 'repayDate',
          type: 'date'
        }, {
          name: '信用额度', value: "",
          placeHolder: "请输入信用额度",
          key: "creditLimit",
          type: 'number'
        }, {
          name: '账单金额', value: "",
          placeHolder: "请输入账单金额",
          key: "newBalance",
          type: 'number'
        }].map((v, k) => {
          const {name, disabled, key, type, placeHolder, icon, code = '0'} = v;
          return <div key={k} style={styles.item}>
            <div style={styles.name}>{name}</div>
            {
              code == '1' ?
                <DayPicker
                  name={name}
                  onRes={(day) => {
                  this.setState({
                    [key]: day
                  }, () => {
                    this.enableBtn()
                  })
                }
                }/> :
                <input
                  onChange={(e) => {
                    if (this.inputLimit(key, e.currentTarget.value.trim())) {
                      return;
                    }
                    this.setState({[key]: e.currentTarget.value}, () => this.enableBtn())
                  }}
                  onClick={() => {
                    if (key == 'bankName') {
                      this.findBank()
                    }
                  }}

                  type={type}
                  value={this.state[key]}
                  disabled={disabled}
                  style={styles.input}
                  placeholder={placeHolder}
                />
            }
            {icon ? <img src={icon} style={ styles.img}/> : null}
          </div>

        })
      }
      <div className={enabelBtn ? 'enableBtn' : 'disableBtn'}
           onClick={() => this.commitForm()}>保存
      </div>
    </div>];
  }
}

const styles = {
  typeDes: {
    fontSize: '0.24rem',
    color: '#999999',
    letterSpacing: '0',
    padding: "0.09rem 0 0 0.31rem"
  },
  item: {
    minHeight: "1rem",
    width: '7.5rem',
    background: '#FFFFFF',
    margin: "0.3rem 0",
    display: 'flex',
    alignItems: "center"
  },
  name: {
    width: "2.76rem",
    paddingLeft: '0.31rem',
    lineHeight: "1rem",
    fontSize: '0.31rem',
    color: '#333333',
    letterSpacing: '-1PX',
    display: 'inline-block'
  },
  img: {
    width: '0.42rem',
  },
  input: {
    fontSize: '0.31rem',
    color: '#999999',
    letterSpacing: '0',
    height: '0.44rem',
    width: '3.6rem',
    border: '0',
  },
  tips: {
    fontSize: '0.24rem',
    color: '#5481FE',
    letterSpacing: '-0.77PX',
    margin: "0.31rem 0 0 0.31rem"
  },
}