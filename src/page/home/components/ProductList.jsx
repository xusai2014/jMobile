import React, { Component } from 'react';
import styles from './ProductList.less';

export default class ProductList extends Component {
  render() {
    const { integral = '30000', bankGoods = '100元沃尔玛电子兑换券', plusCredit = '30元刷卡金', plusChange = () => {} } = this.props;
    return (
      <div className={styles.row}>
        <div className={styles.columnFirst}>{integral}</div>
        <div className={styles.columnSecond}>{bankGoods}</div>
        <div className={styles.columnThird} style={{ color: '#3399FF' }} onClick={plusChange}>{plusCredit}</div>
      </div>
    );
  }
}
