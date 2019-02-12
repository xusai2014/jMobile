import React, { Component } from 'react';
import styles from './ProductShow.less';

export default class ProductShow extends Component {
  state ={
    status : false
  }
  render() {
    const { echoData = {} } = this.props;
    const { backgroundImage = '../../../../static/img/background.png',
      money = '100',
      detail = '沃尔玛电子码',
      checkProduct = () =>{}
    } = echoData;
    return (
      <div className={styles.product} onClick={checkProduct}>
        <img src={backgroundImage} alt="" className={styles.background}/>
        <span className={styles.lable}>
          ￥
        </span>
        <span className={styles.money}>
          {money}
        </span>
        <span className={styles.detail}>
          {detail}
        </span>
        {this.state.status?<img src="../../../../static/img/checked.png" alt="勾选" className={styles.check} />
          : <img src="../../../../static/img/unchecked.png" alt="未勾选" className={styles.check} />
        }
      </div>
    );
  }
}
