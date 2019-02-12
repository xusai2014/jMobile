import React, { Component } from 'react';
import styles from './UploadForm.less';
import Header from '../../compoents/Header';

export default class UploadForm extends Component {
  state ={
    status : false
  }
  render() {
    return (
      <div className={styles.container}>
        <Header title="积分兑换" />
        <div className={styles.screenshots}>
          <span className={styles.name}>
            订单截图
          </span>
          <div className={styles.descr}>
            （上传积分兑换订单截图）
          </div>
          <div className={styles.upload}>
            <div className={styles.example}>
              <img src="../../../static/img/screenshots.png" alt="" className={styles.img} />
            </div>
            <div className={`${styles.example} ${styles.add}`}>
              <img src="../../../static/img/add.png" alt="" className={styles.icon} />
            </div>
          </div>
          <span className={`${styles.text} ${styles.word}`}>示例</span>
          <span className={`${styles.text} ${styles.preview}`}>预览</span>
          <span className={`${styles.text} ${styles.click}`}>点击上传</span>
        </div>
        <div className={styles.interval}>.</div>
        <div className={styles.conversionCode}>
          <span className={styles.title}>
            兑换码
          </span>
          <div className={styles.input}>
            <textarea placeholder="复制整条兑换码信息"></textarea>
          </div>
        </div>
        <div className={styles.note}>
          <span className={styles.name}>
            备注
          </span>
          <div className={styles.input}>
            <input placeholder="如无特殊情况，请勿填写" type="text" />
          </div>
        </div>
        <div className={styles.submit}>
          提交
        </div>
        <div className={styles.tip}>
          友情提示：请按要求正确提交兑换信息，任何恶意欺骗行为，一经发现直接扣款或封号处理。
        </div>
      </div>
    );
  }
}
