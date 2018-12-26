import React from 'react';
import Header from '../../compoents/Header';
import Adtivity from './Adtivity';
import { enterMethodList } from "../../utils/util";

export default class Result extends React.Component {

  render() {
    const { type, } = this.props.match.params;
    const { describe = (restult) => result, footer = ()=>{}, title, img } = this.results[type]?this.results[type]:{};

    const { state = {} } = this.props.location;
    const { result } = state;

    return [<Header backStart={() => this.props.history.go(-2)}
                    key="1" title={'导入结果'}
                    right={<div onClick={() => {
                      this.props.history.push('/home/index');
                    }}>完成</div>}
    />
      , <div key={2} style={{ backgroundColor: "#FFFFFF", paddingBottom: "0.5rem" }}>
        <img src={img} style={{ width: '1rem', margin: "0.3rem 3.25rem" }}/>
        <div style={styles.describe}>{title}</div>
        <div style={styles.resason}>{describe(result)}</div>
        {footer()}
        <Adtivity/>
      </div>]
  }

  results = {
    esuccess: {
      describe: (data = []) => <div>成功导入：{data.map((v, k) => <div>{v.bankName}信用卡 导入{v.count}笔账单</div>)}</div>,
      footer: () => ([<div onClick={() => this.props.history.push('/home/index')} className="enableBtn">完成</div>,]),
      title: "导入成功",
      img: "/static/img/done@2x.png",
    },
    efailed: {
      describe: (data) => data,
      footer: () => (<div onClick={() => this.props.history.go(-2)} className="enableBtn">重新登录</div>),
      title: "导入失败",
      img: "/static/img/nothing@2x.png",
    },
    enodata: {
      img: "/static/img/done@2x.png",
      describe: () => "您的邮箱内没有新的交易数据，请尝试其他账单导入方式吧！",
      footer: () => (<div>
        <div style={styles.actionReplace} onClick={() => this.props.history.push('/email/add')}>换一个邮箱导入</div>
        <div style={styles.actionReplace} onClick={() => enterMethodList(this.props)}>网银导入</div>
      </div>),
      title: "无数据导入"
    }, cybersuccess: {
      describe: (data) => <div>成功导入：{data.map((v, k) => <div>{v.bankName}信用卡 导入{v.count}笔账单</div>)}</div>,
      footer: () => (<div className="enableBtn" onClick={() => this.props.history.push('/home/index')}>完成</div>),
      title: "导入成功",
      img: "/static/img/done@2x.png",
    }, cyberfailed: {
      describe: (data) => data,
      footer: () => (<div onClick={() => this.props.history.go(-2)} className="enableBtn">重新登录</div>),
      title: "导入失败",
      img: "/static/img/nothing@2x.png",
    }, cybernodata: {
      img: "/static/img/done@2x.png",
      describe: () => "暂无新的交易数据，请尝试导入其他网银账单吧！",
      footer: () => (<div>
        <div style={styles.actionsImport} onClick={() => enterMethodList(this.props)}>网银导入</div>
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