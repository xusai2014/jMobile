import React from 'react';
import styles from "./BankList.less";
import PropTypes from 'prop-types';
import DebounceButton from "../../../compoents/DebounceButton";

export default class BankList extends React.Component {
    static defaultProps = {
        echoData:{}
    }

    static propTypes = {
        echoData: PropTypes.object.isRequired,
    }
    render() {
        const {echoData = {},choose} = this.props;
        const {logo_uri='/static/img/3.4.0/zs@2x.png',name='招商银行'}=echoData;
        return (
          <DebounceButton onClick={choose}>
            <div  className={styles.contend} >
                <span><img src={logo_uri}/></span>
                <span>{name}</span>
            </div>
          </DebounceButton>
        )
    }
}