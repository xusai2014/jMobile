import React, { Component } from 'react';
import styles from './Process.less';
import Header from '../../compoents/Header';
import ProductShow from './components/ProductShow';

export default class Process extends Component {
  state ={
     status : false
  }
  // 跳转到兑换记录
  clickrightTitle = () => {
    this.props.history.push('/myapp/exchangeRecord');
  }
  // 电子码兑换链接
  exchangeAddress = () => {

  }
  // 立即报单
  ImmediateReport = () => {
    this.props.history.push('/myapp/UploadForm');
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
    ], processImage ='../../../static/img/processImage.png' } =this.props;
    const productShow = sourceData.map((v,k) =>{
      return <ProductShow echoData={v} key={k} />
    })
    return (
      <div className={styles.container}>
        <Header title="积分兑换" right="兑换记录" clickrightTitle={this.clickrightTitle}/>
        <div className={styles.productStyle}>
          <span className={styles.name}>产品类型</span>
        </div>
        <div className={styles.code}>
          {productShow}
        </div>
        <div className={styles.tip}>
          温馨提示：报单信息与选择商品不符的一律不予核销，损失自负
        </div>
        <div className={styles.link} onClick={this.exchangeAddress}>
          招商银行电子码兑换链接
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
            <img src={processImage} alt="" className={styles.processImage} />
            <img src={processImage} alt="" className={styles.processImage}/>
          </div>
        </div>
        <div className={styles.interval} style={{height:'0.32rem'}}>.</div>
        <div className={styles.submit} onClick={this.ImmediateReport}>立即报单</div>
      </div>
    );
  }
}
