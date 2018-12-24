import React from 'react';
import styles from "./AllCount.less";


export default class  AllCount extends React.Component{
    render(){
        const {echoData={}} = this.props;
        const{email='an****01@163.com',des='全部账号'}=echoData;
        return (
            <div className={styles.allAccount}>
                <div className={styles.input}><input placeholder={email}/></div>
                <button>{des}</button>
            </div>
        )
    }
}