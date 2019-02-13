import React, { Component } from 'react';
import styles from './Actionsheet.less';
import DebounceButton from '../../../compoents/DebounceButton';

export default class Actionsheet extends Component {
  state ={
    status : false
  }
  render() {
    return (
      <div className={styles.container} style={{minHeight: gloablMinHeight}}>
        <div className={styles.content}>
          <div className={styles.substain}>
            <DebounceButton className={styles.option} activeOpen={true} onClick={()=>{}}>
              <span className={styles.title}>拍照</span>
              <img src="../../../../static/img/carme.png"/>
            </DebounceButton>
            <DebounceButton className={styles.option} style={{border:'none'}} activeOpen={true} onClick={()=>{}}>
              <span className={styles.title}>图库</span>
              <img src="../../../../static/img/picture.png"/>
            </DebounceButton>
          </div>
          <DebounceButton className={styles.cancel} activeOpen={true} onClick={()=>{}}>
            取消
          </DebounceButton>
        </div>
      </div>
    );
  }
}
