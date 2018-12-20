/**
 * Create by chengkai on 2018/9/7.
 * Describe: 404界面
 */

import React from 'react';
import styles from './NoMatch.less';

export default class NoMatch extends React.Component {
  constructor(props) {
    super(props);
    document.title = '404';
  }

  reload = () => {
    window.location.reload();
  }

  render() {
    return (
      <div className={styles.bodyContainer}>
        <div className={styles.errorContent}>
          <div className={styles.contentCenter}>
            <div className={styles.imgStyles}></div>
            <div className={styles.errorMsg}>页面失联啦 快检查下链接吧~</div>
            <button className={styles.btnRefresh} onClick={this.reload} type="button">重新加载</button>
          </div>
        </div>
      </div>
    );
  }
}
