import React, { Component } from 'react';
import styles from './Actionsheet.less';

export default class Actionsheet extends Component {
  state ={
    status : false
  }
  render() {
    return (
      <div className={styles.container} style={{minHeight: gloablMinHeight}}>
        <div className={styles.content}>
          <div className={styles.substain}>
            <div className={styles.option}>
              <span className={styles.title}>拍照</span>
              <img src="../../../../static/img/carme.png"/>
            </div>
            <div className={styles.option} style={{border:'none'}}>
              <span className={styles.title}>图库</span>
              <img src="../../../../static/img/picture.png"/>
            </div>
          </div>
          <div className={styles.cancel}>
            取消
          </div>
        </div>
      </div>
    );
  }
}
