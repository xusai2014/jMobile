import React, { Component } from 'react';
import styles from './OrderDetails.less';
import Header from '../../compoents/Header';
// import OrderInfo from './components/OrderInfo';

export default class OrderDetails extends Component {
  state = {
  }
  componentDidMount() {
  }
  // 根据状态显示不同的样式
  statusStyle = (status) => {
    const styleSheet ={
      position: 'absolute',
      right: '0.26rem',
      top: '0.28rem',
      marginBottom: '0.28rem',
      fontFamily: 'PingFangSC-Regular',
      fontSize: '0.28rem',
      color: '#999999',
      letterSpacing: 0,
    }
    if (status === '成功') {
      styleSheet.color = '#3399FF';
      return <span style={styleSheet}>{status}</span>;
    } else if (status === '失败') {
      styleSheet.color = '#DB0000';
      return <span style={styleSheet}>{status}</span>;
    } else if (status === '审核中') {
      styleSheet.color = '#999999';
      return <span style={styleSheet}>{status}</span>;
    }
  }
  render() {
    const { sourceData = {} } = this.props;
    const {
      orderNumber = 'SXF2018012300123456789',
      buyGoods = '30元刷卡金',
      status = '成功',
      submitTime = '2019-01-04 10:07:36',
      checkTime = '2019-01-04 10:07:36',
      instructions = '工单信息不正确',
      bankGoods = '100元沃尔玛电子码',
      conversionCode = '工商银行订单号019011167346736736712 【沃尔玛电子码】沃尔玛GIFT卡礼品卡100元面值电子码',
      screenshots = '../../../static/img/screenshots.png',
      note = '尽快发货'
    } = sourceData;
    return (
      <div className={styles.container}>
        <Header title="订单详情" />
        <div className={styles.content}>
          <span className={styles.name}>订单号:</span>
          <span className={styles.detail}>{orderNumber}</span>
        </div>
        <div className={styles.content}>
          <span className={styles.name}>换购商品:</span>
          <span className={styles.detail}>{buyGoods}</span>
        </div>
        <div className={styles.content}>
          <span className={styles.name}>兑换状态:</span>
          {this.statusStyle(status)}
        </div>
        <div className={styles.content}>
          <span className={styles.name}>提交时间:</span>
          <span className={styles.detail}>{submitTime}</span>
        </div>
        {
          !!checkTime ?
            <div className={styles.content}>
              <span className={styles.name}>审核时间:</span>
              <span className={styles.detail}>{checkTime}</span>
            </div>
            : null
        }
        {
          !!instructions ?
            <div className={styles.content}>
              <span className={styles.name}>说明:</span>
              <span className={styles.detail}>{instructions}</span>
            </div>
            : null
        }
        <div className={styles.content}>
          <span className={styles.name}>银行商品:</span>
          <span className={styles.detail}>{bankGoods}</span>
        </div>
        {
          !!conversionCode ?
            <div className={styles.content} style={{ height: '1.66rem' }}>
              <span className={styles.name}>兑换码:</span>
              <span className={styles.detail} style={{ marginLeft: '2.05rem', wordWrap: 'break-word', wordBreak: 'break-all' }}>
                {conversionCode}
              </span>
            </div>
            : null
        }
        {
          !!screenshots ?
            <div className={styles.content} style={{ height: '2.78rem' }}>
              <span className={styles.name}>截图:</span>
              <span className={styles.detail}>
                <img src={screenshots} alt="" style={{ height: '2.31rem', width: '1.31rem' }} />
              </span>
            </div>
            : null
        }
        {
          !!note ?
            <div className={styles.content}>
              <span className={styles.name}>备注:</span>
              <span className={styles.detail}>{note}</span>
            </div>
            :null
        }
      </div>
    );
  }
}

