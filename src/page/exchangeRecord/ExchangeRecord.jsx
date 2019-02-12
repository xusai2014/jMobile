import React, { Component } from 'react';
import Header from '../../compoents/Header';
import styles from './ExchangeRecord.less';

export default class ExchangeRecord extends Component {
  state = {
  }
  componentDidMount() {
  }

  render() {
    return (
      <div className={styles.container}>
        <Header title="兑换记录" />
        <div className={styles.substance}>
          <div className={styles.content}>
            <span className={styles.name}>
              30元刷卡金
            </span>
            <span className={styles.detail}>
              招商银行 2018-08-25
            </span>
            <span className={styles.status}>
              成功
            </span>
            <span className={styles.integral}>
              3000积分
            </span>
            <img src="../../../static/img/next@2x.png" className={styles.next} alt="" />
          </div>
        </div>
        <div className={styles.noMore}>
          没有更多了...
        </div>
      </div>
    );
  }
}

