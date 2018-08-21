import React from 'react';
import Header from "../../compoents/Header";


export default class Result extends React.Component {

  render() {
    const {type, data = '{}'} = this.props.match.params;
    const {describe, footer, title, img} = this.results[type];

    const {state} = this.props.location;
    const {result} = state;

    return [<Header key="1" title={'导入结果'}
                    right={<div onClick={() => {
                      this.props.history.push('/home/index')
                    }}>完成</div>}
    />
    , <div key={2} style={{backgroundColor: "#FFFFFF", paddingBottom: "0.5rem"}}>
      <img src={img} style={{width: '1rem', margin: "0.3rem 3.25rem"}}/>
      <div style={styles.describe}>{title}</div>
      <div style={styles.resason}>{describe(result)}</div>
      {footer()}
    </div>]
  }

  results = {
    esuccess: {
      describe: (data) => <div>成功导入：{data.map((v, k) => <div>{v.bankName}信用卡 导入{v.count}笔账单</div>)}</div>,
      footer: () => (<div onClick={() => this.props.history.push('/home/index')} style={styles.finishBtn}>完成</div>),
      title: "导入成功",
      img: "/static/img/done@2x.png",
    },
    efailed: {
      describe: (data) => data,
      footer: () => (<div onClick={() => this.props.history.go(-2)} style={styles.finishBtn}>重新登录</div>),
      title: "导入失败",
      img: "/static/img/nothing@2x.png",
    },
    enodata: {
      img: "/static/img/done@2x.png",
      describe: () => "您的邮箱内没有新的交易数据，请尝试其他账单导入方式吧！",
      footer: () => (<div>
        <div style={styles.actionReplace} onClick={this.props.history.push('/bill/method')} >换一个邮箱导入</div>
        <div style={styles.actionsImport} onClick={this.props.history.push('/bill/method', {anchor: '#cyberId'})}>网银导入</div>
      </div>),
      title: "无数据导入"
    }, cybersuccess: {
      describe: (data) => <div>成功导入：{data.map((v, k) => <div>{v.bankName}信用卡 导入{v.count}笔账单</div>)}</div>,
      footer: () => (<div style={styles.finishBtn} onClick={() => this.props.history.push('/home/index')}>完成</div>),
      title: "导入成功",
      img: "/static/img/done@2x.png",
    }, cyberfailed: {
      describe: (data) => JSON.stringify(data),
      footer: () => (<div onClick={() => this.props.history.push('/home/index')} style={styles.finishBtn}>完成</div>),
      title: "导入失败",
      img: "/static/img/nothing@2x.png",
    },cybernodata: {
      img: "/static/img/done@2x.png",
      describe: () => "暂无新的交易数据，请尝试导入其他网银账单吧！",
      footer: () => (<div>
        <div style={styles.actionsImport} onClick={this.props.history.push('/bill/method', {anchor: '#cyberId'})}>网银导入</div>
      </div>),
      title: "无数据导入"
    },

  }
}

const styles = {
  describe: {
    fontSize: "0.36rem",
    color: "#333333",
    letterSpacing: '-1PX',
    textAlign: 'center',

  },
  resason: {
    fontSize: "0.24rem",
    color: '#999999',
    letterSpacing: '-0.67PX',
    textAlign: "center",
    margin: '0.3rem 1.53rem 0 1.53rem',
    width: '4.44rem'
  }, finishBtn: {
    background: '#4C7BFE',
    boxShadow: '0 0.06rem 0.12rem 0 #9BB5FF',
    borderRadius: "0.08rem",
    margin: "1.4rem 0.16rem 0 0.16rem",
    lineHeight: "1.18rem",
    textAlign: 'center',
    fontSize: "0.34rem",
    color: "#FFFFFF",
    letterSpacing: '-0.011rem',
  },
  actionReplace: {
    fontSize: "0.36rem",
    letterSpacing: "0",
    color: "#4C7BFE",
    textAlign: 'center',
    marginTop: '1.21rem'
  },
  actionsImport: {
    fontSize: "0.36rem",
    letterSpacing: "0",
    color: "#4C7BFE",
    textAlign: 'center',
    marginTop: '0.63rem',
    paddingBottom: "0.36rem"
  }
}