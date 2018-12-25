import React from 'react';
import styles from "./CardList.less";
import PropTypes from 'prop-types';

export default class CardList extends  React.Component{
    static defaultProps = {
        echoData:[],
        noMarginRight:false
    }

    static propTypes = {
        echoData: PropTypes.object.isRequired,
        noMarginRight: PropTypes.bool.isRequired,
    }
    render(){
        const {echoData={},noMarginRight,bankCardLogin}=this.props;
        const {logo_uri='/static/img/3.4.0/zs@2x.png',name='招商银行'}=echoData;
        return(
            <div>
                {noMarginRight ?
                    <div className={styles.noMargin}>
                        <img src={logo_uri} className={styles.img} onClick={bankCardLogin}/>
                        <span className={styles.des}>
                            {name}
                        </span>
                    </div>
                    :
                    <div className={styles.container}>
                        <img src={logo_uri} className={styles.img} onClick={bankCardLogin}/>
                        <span className={styles.des}>
                            {name}
                        </span>
                    </div>
                }
            </div>
        )
    }
}