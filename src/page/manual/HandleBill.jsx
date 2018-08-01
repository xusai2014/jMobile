import React from 'react';
import Header from '../../compoents/Header';
import {Modal, Toast, DatePicker} from 'antd-mobile'
import ModalCom from "../../compoents/ModalCom";
const prompt = Modal.prompt;

export default class HandleBill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeOne: 0,
      modal: false,
      description: '',
      visible: false,
      accountDate: '',
      repayDate: ''
    }
  }

  promptClick = () => prompt('输入验证码', '请输入手机号135****1234收到的验证码',
    [
      {
        text: '取消',
        onPress: value => new Promise((resolve) => {
          Toast.info('onPress promise resolve', 1);
          setTimeout(() => {
            resolve();
            console.log(`value:${value}`);
          }, 1000);
        }),
      },
      {
        text: '确定',
        onPress: value => new Promise((resolve, reject) => {
          resolve();
          setTimeout(() => {
            this.setState({modal: true, description: "您绑定的卡为借记卡，卡包只支持绑定信用卡，请您重新绑定"})
            console.log(`value:${value}`);
          }, 1000);
        }),
      },
    ], 'default', null, ['请输入验证码'])


  render() {
    const {activeOne, modal, description} = this.state;

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
          name: '卡号', value: "",
          placeHolder: "请输入完整卡号",
        }, {
          name: '发卡行', value: "",
          placeHolder: "点击此处识别发卡行",
        }, {
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
        }, {
          name: '账单金额', value: "",
          placeHolder: "请输入账单金额",
        }].map((v, k) => {
          const {name, disabled, value, key, placeHolder, icon, code = '0'} = v;
          return <div key={k} style={styles.item}>
            <div style={styles.name}>{name}</div>
            {
              code == '1' ? <DatePicker
                mode="date"
                title={name}
                extra="Optional"
                value={this.state[key]}
                onChange={date => this.setState({[key]: date})}
              >
                <div
                  style={styles.input}>{this.state[key] ? moment(this.state[key]).format('YYYY-MM') : placeHolder}
                  </div>
              </DatePicker> : <input disabled={disabled} style={styles.input} placeholder={placeHolder}/>
            }
            {icon ? <img src={icon} style={ styles.img}/> : null}
          </div>

        })
      }
      <div style={styles.finishBtn} onClick={() => this.promptClick()}>保存</div>
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
  finishBtn: {
    background: '#4C7BFE',
    boxShadow: '0 0.06rem 0.12rem 0 #9BB5FF',
    borderRadius: "0.08rem",
    margin: "1.4rem 0.16rem 0 0.16rem",
    lineHeight: "1.18rem",
    textAlign: 'center',
    fontSize: "0.34rem",
    color: "#FFFFFF",
    letterSpacing: '-0.011rem',
  }
}