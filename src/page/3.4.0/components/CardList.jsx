import React from 'react';
import styles from "./CardList.less";
import PropTypes from 'prop-types';
import DebounceButton from "../../../compoents/DebounceButton";

export default class CardList extends React.Component {
  static defaultProps = {
    echoData: [],
    noMarginRight: false
  }

  static propTypes = {
    echoData: PropTypes.object.isRequired,
    noMarginRight: PropTypes.bool.isRequired,
  }

  render() {
    const { echoData = {}, bankCardLogin,addStyle=false} = this.props;
    const { logo_uri = '/static/img/3.4.0/zs@2x.png', name = '招商银行' } = echoData;
    const { abbr } = echoData;
    return (
      <div>
        <DebounceButton className={`${styles.noMargin} ${styles.activeBtn} ${addStyle?styles.newStyle:''}`}  onClick={() => bankCardLogin(abbr)}>
          <img src={logo_uri} className={styles.img}/>
          <span className={styles.des}>
            {name}
          </span>
        </DebounceButton>
      </div>
    )
  }
}