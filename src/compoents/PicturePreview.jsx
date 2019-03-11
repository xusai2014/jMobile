import React, {Component} from 'react';
import styles from './PicturePreview.less';

export default class PicturePreview extends Component {
  render() {
    const {
      imgSrc, onClick = () => {}, disabled = ''
    } = this.props;
    const display = !disabled ? 'none' : 'block';
    return (
      <div style={{ minHeight: gloablMinHeight, display }} className={styles.modal} onClick={onClick}>
        <img src={imgSrc} className={styles.image} />
      </div>
    );
  }
}
