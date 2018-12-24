import React from 'react';
import styles from "./AllCount.less";
import PropTypes from 'prop-types';

export default class  AllCount extends React.Component{
    static defaultProps = {
        echoData:{}
    }

    static propTypes = {
        echoData: PropTypes.object.isRequired,
    }
    render(){
        const {echoData={},getEmailAccount=()=>{
        }} = this.props;
        const{email='an****01@163.com',des='全部账号'}=echoData;
        return (
            <div className={styles.allAccount}>
                <div className={styles.input}><input placeholder={email}/></div>
                <button onClick={getEmailAccount}>{des}</button>
            </div>
        )
    }
}