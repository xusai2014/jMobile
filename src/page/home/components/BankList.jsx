import React, { Component } from 'react';
import styles from './BankList.less';
import checked from '../../../../static/img/selected.png';
import DebounceButton from '../../../compoents/DebounceButton';

export default class BankList extends Component {
  render() {
    const { echoData = {}, chooseBank = () => {} , selected = false } = this.props;
    const { logo_uri = '../../../../static/img/new/gd.png', name = '广大银行' } = echoData;
    return (
      <DebounceButton className={styles.bankContent} onClick={() => { chooseBank(name); }}>
        <div className={styles.bankIcon}>
          <img src={logo_uri} alt={name} className={styles.bankIconImg} />
          <div className={styles.bankIconText}>
            {name}
          </div>
          <img src={checked} alt="" className={`${selected ? styles.selected :  styles.cancel}`} />
        </div>
      </DebounceButton>
    );
  }
}
