import React, { Component } from 'react';
import styles from './Actionsheet.less';
import DebounceButton from '../../../compoents/DebounceButton';

export default class Actionsheet extends Component {
  state ={
    status : false
  }
  render() {
    const { cancel, takePictures, gallery } = this.props;
    return (
      <div style={{minHeight: gloablMinHeight}} className={styles.container}>
        <div className={styles.content}>
          <div className={styles.substain}>
            <DebounceButton className={styles.option} activeOpen={true} onClick={takePictures}>
              <span className={styles.title}>拍照</span>
              <img src="../../../../static/img/carme.png"/>
            </DebounceButton>
            <DebounceButton className={styles.option} style={{border:'none'}} activeOpen={true} onClick={gallery}>
              <span className={styles.title}>图库</span>
              <img src="../../../../static/img/picture.png"/>
            </DebounceButton>
          </div>
          <DebounceButton className={styles.cancel} activeOpen={true} onClick={cancel}>
            取消
          </DebounceButton>
        </div>
      </div>
    );
  }
}
