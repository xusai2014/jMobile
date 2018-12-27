import React from 'react';
import styles from './PayMethodList.less';
import DebounceButton from "../../../compoents/DebounceButton";
import PropTypes from 'prop-types';

export default class PayMethodList extends React.Component {
    static defaultProps = {
        echoData: {}
    }

    static propTypes = {
        echoData: PropTypes.object.isRequired,
    }

    render() {
        const {
            echoData = {}, exportEmail = () => {
            }
        } = this.props;
        const {
            img = "/static/img/3.4.0/email@2x.png",
            name = "邮箱导入",
            describe = "绑定账单后去邮箱，一键获取信用卡账单"
        } = echoData;
        return (
            <DebounceButton onClick={exportEmail} className={styles.container} activeOpen={true} activeClassName={styles.active}>
                <div className={styles.content}>
                    <div className={styles.imgContainer}>
                        <img src={img} className={styles.img}/>
                    </div>
                    <div className={styles.textContent}>
                        <span className={styles.nameText}>
                            {name}
                        </span>
                        <span className={styles.describe}>{describe}</span>
                    </div>
                </div>
            </DebounceButton>
        )
    }
}