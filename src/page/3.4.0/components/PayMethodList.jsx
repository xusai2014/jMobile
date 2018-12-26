import React from 'react';
import styles from './PayMethodList.less';
import PropTypes from 'prop-types';

export default class PayMethodList extends React.Component{
    static defaultProps = {
        echoData:{}
    }

    static propTypes = {
        echoData: PropTypes.object.isRequired,
    }
    render() {
        const {echoData={},exportEmail} = this.props;
        const { img = "/static/img/3.4.0/email@2x.png",
                name = "邮箱导入",
                describe = "绑定账单后去邮箱，一键获取信用卡账单"}=echoData;
        return (
            <div
            className={styles.container}
            >
                <div className={styles.content}>
                    <img src={img}  className={styles.img}/>
                    <div className={styles.textContent}>
                        <div className={styles.nameText} onClick={exportEmail}>{name}</div>
                        <div className={styles.describe}>{describe}</div>
                    </div>
                </div>
            </div>
        )
    }
}