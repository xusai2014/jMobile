import React, { Component } from 'react';
import styles from './BannerItem.less';

export default class BannerItem extends Component {
  render() {
    const { children } = this.props;
    return (
      <div className={styles.bankListShow}>
        <div className={styles.content}>
          {
            children
          }
        </div>
      </div>
    );
  }
}
