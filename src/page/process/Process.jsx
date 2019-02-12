import React, { Component } from 'react';
import styles from './Process.less';
import Header from '../../compoents/Header';
import ProductShow from './components/ProductShow';

export default class Process extends Component {
  state ={
     status : false
  }
  render() {
    const { sourceData = [
      { backgroundImage : '../../../../static/img/background.png',
        money : '100',
        detail : '沃尔玛电子码'
      },{ backgroundImage : '../../../../static/img/background1.png',
        money : '100',
        detail : '沃尔玛电子码'
      },{ backgroundImage : '../../../../static/img/background2.png',
        money : '100',
        detail : '沃尔玛电子码'
      }
    ] } =this.props;
    const productShow = sourceData.map((v,k) =>{
      return <ProductShow echoData={v} key={k} />
    })
    return (
      <div className={styles.container}>
        <Header title="积分兑换" right="兑换记录" />
        <div className={styles.productStyle}>
          <span className={styles.name}>产品类型</span>
          <div className={styles.code}>
            {productShow}
          </div>
          <span className={styles.tip}>
            温馨提示：报单信息与选择商品不符的一律不予核销，损失自负
          </span>
          <div className={styles.link}>
            招商银行电子码兑换链接
          </div>
        </div>
        <div className={styles.interval}>.</div>
        <div className={styles.process}>
          <span className={styles.name}>
            产品兑换流程
          </span>
          <span className={styles.describe}>
            关注【招商银行信用卡】公众号，进入微信公众号点击【办卡推荐】-【绑定.红包】-【微信账户绑定】 绑定信用卡。
          </span>
          <div className={styles.show}>
            <img src="../../../static/img/processImage.png" alt="" className={styles.processImage} />
            <img src="../../../static/img/processImage.png" alt="" className={styles.processImage}/>
          </div>
        </div>
        <div className={styles.interval} style={{height:'0.32rem'}}>.</div>
        <div className={styles.submit}>立即报单</div>
      </div>
    );
  }
}
