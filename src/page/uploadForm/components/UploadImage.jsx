import React, { Component } from 'react';
import styles from './UploadImage.less';
import DebounceButton from "../../../compoents/DebounceButton";

export default class UploadImage extends Component {
  render() {
    const { imgSrc, onClick= () => {} } = this.props;
    return (
      <div>
        <div className={styles.content}>
          <DebounceButton className={`${styles.example}`} onClick={onClick}>
            <img src={imgSrc} alt="" className={styles.img} />
          </DebounceButton>
          <span className={`${styles.text} ${styles.click}`} style={{ color: '#3399FF' }}>预览</span>
        </div>
      </div>
    );
  }
}
