import React, { Component } from 'react';
import styles from './OrderDetails.less';
import Header from '../../compoents/Header';
// import OrderInfo from './components/OrderInfo';

export default class OrderDetails extends Component {
  state = {
  }
  componentDidMount() {
  }

  render() {
    const { sourceData = {} } = this.props;
    const {
      orderNumber = 'SXF2018012300123456789',
      buyGoods = '30元刷卡金',
      status = '失败',
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
          <span className={styles.detail} style={{ color: '#DB0000' }}>{status}</span>
        </div>
        <div className={styles.content}>
          <span className={styles.name}>提交时间:</span>
          <span className={styles.detail}>{submitTime}</span>
        </div>
        <div className={styles.content}>
          <span className={styles.name}>审核时间:</span>
          <span className={styles.detail}>{checkTime}</span>
        </div>
        <div className={styles.content}>
          <span className={styles.name}>说明:</span>
          <span className={styles.detail}>{instructions}</span>
        </div>
        <div className={styles.content}>
          <span className={styles.name}>银行商品:</span>
          <span className={styles.detail}>{bankGoods}</span>
        </div>
        <div className={styles.content} style={{ height: '1.66rem' }}>
          <span className={styles.name}>兑换码:</span>
          <span className={styles.detail} style={{ marginLeft: '2.05rem', wordWrap: 'break-word', wordBreak: 'break-all' }}>{conversionCode}
          </span>
        </div>
        <div className={styles.content} style={{ height: '2.78rem' }}>
          <span className={styles.name}>截图:</span>
          <span className={styles.detail}>
            <img src={screenshots} alt="" style={{ height: '2.31rem', width: '1.31rem' }} />
          </span>
        </div>
        <div className={styles.content}>
          <span className={styles.name}>备注:</span>
          <span className={styles.detail}>{note}</span>
        </div>
      </div>
    );
  }
}

