import React, { Component } from 'react';
import styles from './UploadForm.less';
import Actionsheet from "./components/Actionsheet";
import Header from '../../compoents/Header';
import DebounceButton from '../../compoents/DebounceButton';

export default class UploadForm extends Component {
  state ={
    status : false
  }
  // 图片预览
  picturePreview = () => {
    console.log('图片预览');
  }
  // 图片上传
  pictureUpload = () => {
    console.log('图片上传');
  }
  // 提交
  submitData = () => {
    console.log('提交');
  }
  render() {
    return (
      <div className={styles.container}>
        <Header title="积分兑换" />
        <div className={styles.screenshots}>
          <div className={styles.name}>
            订单截图
          </div>
          <div className={styles.descr}>
            （上传积分兑换订单截图）
          </div>
        </div>
        <div className={styles.screenshotsUpload}>
          <div className={styles.upload}>
            <div className={styles.content}>
              <DebounceButton className={styles.example} onClick={this.picturePreview}>
                <img src="../../../static/img/screenshots.png" alt="" className={styles.img} />
              </DebounceButton>
              <span className={`${styles.text} ${styles.word}`}>示例</span>
              <span className={`${styles.text} ${styles.preview}`}>
                <DebounceButton className={styles.color} onClick={this.picturePreview}>
                  预览
                </DebounceButton>
              </span>
            </div>
            <div className={styles.content}>
              <DebounceButton className={`${styles.example} ${styles.add}`} onClick={this.pictureUpload}>
                <img src="../../../static/img/add.png" alt="" className={styles.icon} />
              </DebounceButton>
              <span className={`${styles.text} ${styles.click}`}>点击上传</span>
            </div>
          </div>
        </div>
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
        <div className={styles.tip}>
          友情提示：请按要求正确提交兑换信息，任何恶意欺骗行为，一经发现直接扣款或封号处理。
        </div>
        <div className={styles.submit}>
          <DebounceButton onClick={this.submitData} className={styles.submitStyle}>
            提交
          </DebounceButton>
        </div>
      </div>
    );
  }
}
