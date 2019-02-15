import React, { Component } from 'react';
import styles from './PicturePreview.less';

export default class PicturePreview extends Component {
  render() {
    const { imgSrc, onClick = () => {} } = this.props;
    return (
      <div style={{ minHeight: gloablMinHeight }} className={styles.modal} onClick={onClick}>
        <img src={imgSrc} className={styles.image} />
      </div>
    );
  }
}
