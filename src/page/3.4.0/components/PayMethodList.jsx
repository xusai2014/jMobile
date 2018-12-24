import React from 'react';
import styles from './PayMethodList.less';
export default class PayMethodList extends React.Component{
    render() {
        const {echoData=[]} = this.props;
        const { img = "/static/img/email@2x.png",
                name = "邮箱导入",
                describe = "绑定账单后去邮箱，一键获取信用卡账单",
                path =""}=echoData;
        return (
            <div
            className={styles.container}
            >
                <div className={styles.content}>
                    <img src={img}  className={styles.img}/>
                    <div className={styles.textContent}>
                        <div className={styles.nameText} onClick={()=>{
                            this.props.history.push({path});
                        }}>{name}</div>
                        <div className={styles.describe}>{describe}</div>
                    </div>
                </div>
            </div>
        )
    }
}