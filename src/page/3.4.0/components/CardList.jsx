import React from 'react';
import styles from "./CardList.less";

export default class CardList extends  React.Component{

    render(){
        const {echoData={}}=this.props;
        const {img='/static/img/3.4.0/zs@2x.png',describe='招商银行',noMarginRight}=echoData;
        return(
            <div>
                {noMarginRight ?
                    <div className={styles.noMargin}>
                        <img src={img} className={styles.img}/>
                        <span className={styles.des}>
                            {describe}
                        </span>
                    </div>
                    :
                    <div className={styles.container}>
                        <img src={img} className={styles.img}/>
                        <span className={styles.des}>
                            {describe}
                        </span>
                    </div>
                }
            </div>
        )
    }
}