import React from 'react';
import Header from '../../compoents/Header';
import {Modal, Toast, DatePicker} from 'antd-mobile'
import ModalCom from "../../compoents/ModalCom";
import {InitDecorator} from "../../compoents/InitDecorator";
import {handleBillForm, identityBank} from "../../actions/reqAction";
import {regBankCard} from '../../utils/util'
@InitDecorator(
  (state) => {
    return {
      handeBill: state.BillReducer.handeBill
    }
  }
)
export default class HandleBill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeOne: 0,
      modal: false,
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
      if(bankNm && type){
        this.setState({
          bankName: bankNm,
          bankNo: type,
        },()=>{
          this.enableBtn()
        })
      } else {
        Toast.info('请检查您输入的信用卡号')
        this.setState({
          bankName: '',
          bankNo: '',
        },()=>{
          this.enableBtn()
        })
      }

    })
  }

  inputLimit(key, val) {
    if (!val) {
      return false
    }
    switch (key) {
      case 'fullCardNum':
        return !/^[0-9]*$/.test(val) || val.length > 25
      case 'creditLimit':
        return !/^[0-9]*(.)?[0-9]*$/.test(val) || val.length > 13
      case 'newBalance':
        return !/^[0-9]*(.)?[0-9]*$/.test(val) || val.length > 13
      default:
        return false;
    }
  }

  commitForm() {
    const {
      bankName,
      accountDate: billDate,
      fullCardNum,
      repayDate: paymentDueDate,
      nameOnCard,
      creditLimit,
      newBalance,
      bankNo,
    } = this.state;
    if (!fullCardNum) {
      Toast.info('请输入银行卡号');
      return;
    } else if (!bankName) {
      Toast.info('请点击识别所属银行');
      return;
    } else if (!billDate) {
      Toast.info('请填写账单日');
      return;
    } else if (!paymentDueDate) {
      Toast.info('请填写还款日');
      return;
    } else if (!paymentDueDate) {
      Toast.info('请填写姓名');
      return;
    } else if (!creditLimit) {
      Toast.info('请填写信用额度');
      return;
    } else if (!newBalance) {
      Toast.info('请填写剩余额度');
      return;
    }

    if (!regBankCard.test(fullCardNum)) {
      Toast.info('请填写正确的银行卡号码');
      return;
    }
    if (parseInt(creditLimit) < parseInt(newBalance)) {
      Toast.info('账单金额不能大于信用额度');
      return;
    }
    if(moment(paymentDueDate).diff(moment(billDate),'days') <=0){
      Toast.info('还款日不能大于账单日');
      return;
    }
    if(!/^[0-9]+(.[0-9])?$/.test(creditLimit)){
      Toast.info('输入信用额度不合法');
      return;
    }
    if(!/^[0-9]+(.[0-9])?$/.test(newBalance)){
      Toast.info('输入账单金额不合法');
      return;
    }

    this.props.dispatch(handleBillForm({
      bankName,
      billDate: moment(billDate).format('YYYY-MM-DD'),
      fullCardNum,
      paymentDueDate: moment(paymentDueDate).format('YYYY-MM-DD'),
      nameOnCard,
      creditLimit,
      newBalance,
      bankNo,
    })).then(() => {
      Toast.info('手写账单成功');
      this.props.history.push('/home/index')
    })
  }

  enableBtn() {
    const {
      bankName,
      accountDate: billDate,
      fullCardNum,
      repayDate: paymentDueDate,
      nameOnCard,
      creditLimit,
      newBalance,
      bankNo,
    } = this.state;
    if (bankName && billDate && fullCardNum
      && paymentDueDate && nameOnCard && creditLimit && newBalance
    ) {
      this.setState({enabelBtn: true})
    } else {

      this.setState({enabelBtn: false})
    }

  }

  render() {
    const {
      activeOne,
      modal,
      description,
      bankName,
      accountDate,
      fullCardNum,
      repayDate,
      nameOnCard,
      creditLimit,
      newBalance,
      enabelBtn
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
          key: "fullCardNum",
          name: '卡号', value: "",
          placeHolder: "请输入完整卡号",
        }, {
          key: "bankName",
          name: '发卡行', value: "",
          placeHolder: "点击此处识别发卡行",
          divTag: true
        }, {
          key: "nameOnCard",
          name: '持卡人', value: "",
          placeHolder: "请输入持卡人姓名",
        }, {
          name: '账单日', value: "",
          placeHolder: "请选择",
          code: "1",
          key: 'accountDate'
        }, {
          name: '还款日', value: "",
          placeHolder: "请选择",
          code: "1",
          key: 'repayDate'
        }, {
          name: '信用额度', value: "",
          placeHolder: "请输入信用额度",
          key: "creditLimit"
        }, {
          name: '账单金额', value: "",
          placeHolder: "请输入账单金额",
          key: "newBalance"
        }].map((v, k) => {
          const {name, disabled, value, divTag = false, key, placeHolder, icon, code = '0'} = v;
          return <div key={k} style={styles.item}>
            <div style={styles.name}>{name}</div>
            {
              code == '1' ? <DatePicker
                mode="date"
                title={name}
                extra="Optional"
                value={this.state[key]}
                onChange={date => this.setState({[key]: date}, () => {
                  this.enableBtn()
                })}
              >
                <div
                  style={styles.input}>{this.state[key] ? moment(this.state[key]).format('YYYY-MM-DD') : placeHolder}
                </div>
              </DatePicker> :
                (divTag ? <div onClick={() => {
                                  if (key == 'bankName') {
                                    this.findBank()
                                  }
                                }}
                               style={styles.input}>{this.state[key] ? this.state[key] : placeHolder}</div> :
                    <input onChange={(e) => {
                              if (this.inputLimit(key, e.currentTarget.value.trim())) {
                                return;
                              }
                              this.setState({[key]: e.currentTarget.value.trim()}, () => {
                                if(key == 'fullCardNum'){
                                  this.setState({
                                    bankName: '',
                                    bankNo: '',
                                  },()=>this.enableBtn());
                                }
                                this.enableBtn()
                              })
                            }}
                           value={this.state[key]}
                           disabled={disabled}
                           style={styles.input}
                           placeholder={placeHolder}
                    />
                )

            }
            {icon ? <img src={icon} style={ styles.img}/> : null}
          </div>

        })
      }
      <div className={enabelBtn ? 'enableBtn' : 'disableBtn'}
           onClick={() => this.commitForm()}>保存
      </div>
      <ModalCom visible={modal} showAction={(v) => {
        this.setState({modal: v})
      }} description={description}/>

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