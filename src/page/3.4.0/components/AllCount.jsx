import React from 'react';
import styles from "./AllCount.less";
import DebounceButton from "../../../compoents/DebounceButton";

export default class AllCount extends React.Component {

  render() {
    const {
      accountList = [],
      getEmailAccount = () => {},
      billProcess
    } = this.props;
    return accountList.length >= 1 ?(
      <div className={styles.allAccount}>
        {
          accountList.map((v, k) => {
            const { account ='1111111118800102517@163.com' } = v;
            return <DebounceButton className={styles.input} activeOpen={true} key={k} onClick={() => billProcess(v)}>
              {account}
            </DebounceButton>
          })
        }
        <DebounceButton className={styles.des} activeOpen={true} onClick={getEmailAccount}>
          <div>全部账号</div>
        </DebounceButton>
      </div>
    ):null;
  }
}