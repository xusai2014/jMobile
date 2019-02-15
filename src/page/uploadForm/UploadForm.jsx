import React, { Component } from 'react';
import styles from './UploadForm.less';
import Actionsheet from "./components/Actionsheet";
import Header from '../../compoents/Header';
import DebounceButton from '../../compoents/DebounceButton';
import PicturePreview from '../../compoents/PicturePreview';
import prewviewImage from '../../../static/img/processImage.png';
import add from '../../../static/img/add.png';
import UploadImage from './components/UploadImage';

export default class UploadForm extends Component {
  constructor (props) {
    super(props);
    this.state ={
      conversionCode: '', // 兑换码
      note: '', // 备注
      disabled: false, //预览弹出层的显隐藏
      imgSrc: '', // 预览图片的地址
      display: false,
      styleSheet: {}, // 当出现遮罩层的时候，阻止遮罩层后的内容滚动
      uploadImages: [],// 上传的图片地址
    };
  }
  // 图片预览
  picturePreview = () => {
    this.setState({
      disabled: true,
      imgSrc: prewviewImage,
      styleSheet: { height: gloablMinHeight }
    })
    console.log('图片预览');
  }
  // 取消图片预览
  cancelPreview = () => {
    this.setState({
      disabled: false,
      styleSheet: {}
    });
  }
  // 图片上传
  pictureUpload = () => {
    console.log('图片上传');
    this.setState({
      display: true,
      styleSheet: { height: gloablMinHeight }
    });
  }
  // 提交
  submitData = () => {
    console.log('提交');
  }
  // 获取备注信息
  getNote = (e) => {
    this.setState({
      note: e.target.value
    });
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
    });
  }
  // 取消上传
  cancel = () => {
    this.setState({
      display: false,
      styleSheet: {}
    });
  }
  // 拍照上传
  takePictures = () => {

  }
  // 通过图库上传
  gallery = (e) => {
    const file = e.target.files[0];
    console.log('file', file);
    const imageType = /^image\//;
    if (!imageType.test(file.type)) {
      alert('请选择图片类型');
      return;
    }
    else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const { uploadImages } = this.state;
        const newuploadImages = uploadImages.push(e.target.result)
        // 上传的图片的编码
        this.setState({
          styleSheet: {},
          uploadImages,
          display: false
        });
        console.log('ne', uploadImages);
        console.log(e.target.result);
      };
    }
  }
  render() {
    const { disabled, imgSrc, display, styleSheet, uploadImages } = this.state;
    const { uploadShow = true, conversionCodeShow = true } = this.props;
    const uploadImageList = uploadImages.map((v,k) => {
      return <UploadImage imgSrc={v} key={k} onClick={this.picturePreview} />;
    });
    return [
      <div className={styles.container} style={styleSheet} key={'b'}>
        <Header title="积分兑换" />
        {
          uploadShow ?
            <div>
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
                      <img src={prewviewImage} alt="" className={styles.img} />
                    </DebounceButton>
                    <span className={`${styles.text} ${styles.word}`}>示例</span>
                    <span className={`${styles.text} ${styles.preview}`}>
                      <DebounceButton className={styles.color} onClick={this.picturePreview}>
                        预览
                      </DebounceButton>
                    </span>
                  </div>
                  {!!uploadImages ? uploadImageList : null}
                  <div className={styles.content}>
                    <DebounceButton className={`${styles.example} ${styles.add}`} onClick={this.pictureUpload}>
                      <img src={add} alt="" className={styles.icon} />
                    </DebounceButton>
                    <span className={`${styles.text} ${styles.click}`}>点击上传</span>
                  </div>
                </div>
              </div>
            </div>
            : null
        }
        {
          conversionCodeShow ?
            <div className={styles.conversionCode}>
              <span className={styles.title}>
                兑换码
              </span>
              <div className={styles.input}>
                <textarea placeholder="复制整条兑换码信息" onChange={this.getconversionCode} maxLength="500">
                </textarea>
              </div>
            </div>
            :null
        }
        <div className={styles.note}>
          <span className={styles.name}>
            备注
          </span>
          <div className={styles.input}>
            <input placeholder="如无特殊情况，请勿填写" type="text" onChange={this.getNote} maxLength="100"/>
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
          display ? <Actionsheet cancel={this.cancel} takePictures={this.takePictures} gallery={this.gallery} /> : null
        }
      </div>,
      <PicturePreview imgSrc={imgSrc} onClick={this.cancelPreview} key={'a'} disabled={disabled} />,
    ];
  }
}
