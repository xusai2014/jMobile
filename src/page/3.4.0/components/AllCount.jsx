import React from 'react';
import styles from "./AllCount.less";
import DebounceButton from "../../../compoents/DebounceButton";
import {accountHandle} from "../../../utils/util";

export default class AllCount extends React.Component {

  render() {
    const {
      accountList = [],
      getEmailAccount = () => {},
      billProcess
    } = this.props;
    return accountList.length >= 1 ?(
        <div className={styles.box}>
          <div className={styles.allAccount}>
            {
              accountList.map((v, k) => {
                const account = accountHandle(v.account);
                return <DebounceButton className={styles.input} activeOpen={true} key={k} onClick={() => billProcess(v)}>
                  <span className={styles.account}>{account}</span>
                </DebounceButton>
              })
            }
            <DebounceButton className={styles.des} activeOpen={true} onClick={getEmailAccount}>
                <div>全部账号</div>
            </DebounceButton>
          </div>
        </div>
        ):null;
  }
}