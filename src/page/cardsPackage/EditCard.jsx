import React from 'react';
import Header from '../../compoents/Header';
import InputRadio from "./components/InputRadio";

export default class EditCard extends React.Component {


  render() {

    return [<Header title="信用卡信息"/>, <style>
      {
        `
          input::-webkit-input-placeholder, {
            color: 'red';
            font-size:'1px';
          }
        `
      }
    </style>, <div>

      <div style={{background: '#FFFFFF'}}>
        <div style={styles.typeDes}>信用卡类型</div>
        <InputRadio />
      </div>
      {
        [{
          name: '信用卡卡号', value: "",
          placeHolder: "请输入卡号", icon: "/static/img/扫一扫@2x.png"
        },{
          name: '姓名', value: "",
          placeHolder: "请输入姓名",
        },{
          name: '持卡人身份证', value: "",
          placeHolder: "请输入身份证号码",
        },{
          name: '发卡行', value: "",
          placeHolder: "请输入发卡行",
        },{
          name: '手机号', value: "",
          placeHolder: "请输入发卡行预留手机号",
        }].map((v, k) => {
            const {name, value, placeHolder, icon} = v;
          return <div style={styles.item}>
            <div style={styles.name}>{name}</div>
            <input style={styles.input} placeholder={placeHolder}/>
            {icon ? <img src={icon} style={ styles.img}/> : null}
          </div>

        })
      }
      <div style={styles.tips}>请核对卡号信息，确认无误</div>

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
  tips:{
    fontSize: '0.24rem',
    color: '#5481FE',
    letterSpacing: '-0.77PX',
    margin:"0.31rem 0 0 0.31rem"
  }
}