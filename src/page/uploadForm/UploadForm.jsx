import React, { Component } from 'react';
import styles from './UploadForm.less';
import Actionsheet from "./components/Actionsheet";
import Header from '../../compoents/Header';
import DebounceButton from '../../compoents/DebounceButton';

export default class UploadForm extends Component {
  state ={
    conversionCode: '', // 兑换码
    note: '', // 备注
    disabled: false, //预览弹出层的显隐藏
    imgSrc: '../../../static/img/processImage.png', // 预览图片的地址
    display:false
  }
  // 图片预览
  picturePreview = () => {
    this.setState({
      disabled: true
    })
    console.log('图片预览');
  }
  // 图片上传
  pictureUpload = () => {
    console.log('图片上传');
    this.setState({
      display: true
    })
  }
  // 提交
  submitData = () => {
    console.log('提交');
  }
  // 获取备注信息
  getNote = (e) => {
    this.setState({
      note: e.target.value
    })
  }
  // 获取兑换码
  getconversionCode = (e) => {
    this.setState({
      conversionCode: e.target.value
    })
  }
  // 弹出层消失
  modalDisable = () => {
    this.setState({
      disabled: false
    })
  }
  // 取消上传
  cancel = () => {
    this.setState({
      display: false
    })
  }
  // 拍照上传
  takePictures = () => {

  }
  // 通过图库上传
  gallery = () => {

  }
  render() {
    const { disabled, imgSrc, display } = this.state;
    return (
      <div className={styles.container} style={{height:gloablMinHeight}}>
        <Header title="积分兑换"/>
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
                <img src="../../../static/img/processImage.png" alt="" className={styles.img} />
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
            <textarea placeholder="复制整条兑换码信息" onChange={this.getconversionCode}>
            </textarea>
          </div>
        </div>
        <div className={styles.note}>
          <span className={styles.name}>
            备注
          </span>
          <div className={styles.input}>
            <input placeholder="如无特殊情况，请勿填写" type="text" onChange={this.getNote} />
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
        {
          disabled ?
            <div style={{ minHeight: gloablMinHeight }} className={styles.modal} onClick={this.modalDisable}>
              <img src={imgSrc} className={styles.image}/>
            </div>
            : null
        }
        {
          display ? <Actionsheet cancel={this.cancel} takePictures={this.takePictures} gallery={this.gallery}/> : null
        }
      </div>
    );
  }
}
