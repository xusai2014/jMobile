import React, { Component } from 'react';
import styles from './NoteItem.less';
import DebounceButton from '../../../compoents/DebounceButton';
import next from '../../../../static/img/next@2x.png';

export default class NoteItem extends Component {
  state = {
  }
  componentDidMount() {
  }
  judgeStatus = (status) => {
    const styleSheet = {
      position: 'absolute',
      left: '3.17rem',
      top: '0.66rem',
      fontFamily: 'PingFangSC-Regular',
      fontSize: '0.28rem',
      letterSpacing: 0
    }
    if (status === '成功') {
      styleSheet.color = '#3399FF';
      return   <span style={styleSheet}>{status}</span>;
    } else if (status === '失败') {
      styleSheet.color = '#DB0000';
      return   <span style={styleSheet}>{status}</span>;
    } else if (status === '审核中') {
      styleSheet.color = '#999999';
      return   <span style={styleSheet}>{status}</span>;
    }
  }

  render() {
    const { echoData = {}, checkDetails = () => {} } = this.props;
    const { name = '30元刷卡金', bankName = '招商银行', time = '2018-08-25', status = '成功', number = '3000' } = echoData;
    return (
      <div className={styles.substance}>
        <DebounceButton className={styles.button} onClick={checkDetails} activeOpen={true}>
          <div className={styles.content}>
            <span className={styles.name}>
              {name}
            </span>
            <span className={styles.detail}>
              <span>
                {bankName}
              </span>
              <span>
                {time}
              </span>
            </span>
            {
              this.judgeStatus(status)
            }
            <span className={styles.integral}>
              {`${number}积分`}
            </span>
            <img src={next} className={styles.next} alt="" />
          </div>
        </DebounceButton>
      </div>
    );
  }
}

