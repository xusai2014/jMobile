import React, {Component} from 'react';
import styles from './Home.less';
import {Carousel} from 'antd-mobile';
import Header from '../../compoents/Header';
import BankList from './components/BankList';
import process from '../../../static/img/process.png'

export default class Home extends Component {
  state = {
    selected: false, // 银行图标是否是选中状态
    bankName: ''// 选中的银行名称
  }

  componentDidMount() {
  }

  // 选择相应的银行
  chooseBank = (name) => {
    const {bankName} = this.state;
    console.log('name', name);
    this.setState({
      bankName: name
    });
    console.log('bankName', bankName);
    const {selected} = this.state;
    if (selected) this.setState({selected: false});
    else this.setState({selected: true});
  }
  // 将银行列表在轮播图中分页展示
  bannerArrange = (bankList, min, max) => {
    const {bankName} = this.state;
    const bankShow = bankList.map((v, k) => {
      if (k >= min && k <= max) {
        return <BankList echoData={v} key={k} chooseBank={this.chooseBank} selected={v.name == bankName} />;
      }
    })
    return bankShow;
  }

  render() {
    const {
      bankList = [
        {logo_uri: '../../../../static/img/gd.png', name: '广大银行'},
        {logo_uri: '../../../../static/img/pf.png', name: '浦发银行'},
        {logo_uri: '../../../../static/img/zx.png', name: '中信银行'},
        {logo_uri: '../../../../static/img/zs.png', name: '招商银行'},
        {logo_uri: '../../../../static/img/gs.png', name: '工商银行'},
        {logo_uri: '../../../../static/img/gf.png', name: '广发银行'},
        {logo_uri: '../../../../static/img/xy.png', name: '兴业银行'},
        {logo_uri: '../../../../static/img/jt.png', name: '交通银行'},
        {logo_uri: '../../../../static/img/zs.png', name: '招商银行'},
        {logo_uri: '../../../../static/img/gs.png', name: '工商银行'},
        {logo_uri: '../../../../static/img/gf.png', name: '广发银行'},
        {logo_uri: '../../../../static/img/gd.png', name: '广大银行'},
        {logo_uri: '../../../../static/img/pf.png', name: '浦发银行'},
        {logo_uri: '../../../../static/img/zx.png', name: '中信银行'},
        {logo_uri: '../../../../static/img/gf.png', name: '广发银行'},
        {logo_uri: '../../../../static/img/xy.png', name: '兴业银行'},
        {logo_uri: '../../../../static/img/jt.png', name: '交通银行'},
        {logo_uri: '../../../../static/img/xy.png', name: '兴业银行'},
        {logo_uri: '../../../../static/img/jt.png', name: '交通银行'},
        {logo_uri: '../../../../static/img/gd.png', name: '广大银行'},
        {logo_uri: '../../../../static/img/pf.png', name: '浦发银行'},
        {logo_uri: '../../../../static/img/zx.png', name: '中信银行'},
        {logo_uri: '../../../../static/img/zs.png', name: '招商银行'},
        {logo_uri: '../../../../static/img/gs.png', name: '工商银行'},
      ]
    } = this.props;
    return (
      <div className={styles.container}>
        <Header title="积分兑换" right="兑换记录"/>
        <div className={styles.chooseBank}>选择银行</div>
        <div className={styles.bankList}>
          <Carousel
            autoplay={false}
            infinite
            dotStyle={{width: '0.1rem', height: '0.1rem', borderRadius: '50%', background: '#BBBBBB'}}
            dotActiveStyle={{width: '0.1rem', height: '0.1rem', borderRadius: '50%', background: '#3399FF'}}
          >
            <div className={styles.bankListShow}>
              <div className={styles.content}>
                {this.bannerArrange(bankList, 0, 7)}
              </div>
            </div>
            <div className={styles.bankListShow}>
              <div className={styles.content}>
                {this.bannerArrange(bankList, 8, 15)}
              </div>
            </div>
            <div className={styles.bankListShow}>
              <div className={styles.content}>
                {this.bannerArrange(bankList, 16, 23)}
              </div>
            </div>
          </Carousel>
        </div>
        <div className={styles.interval}>.</div>
        <div className={styles.bankDetail}>
          <img src="../../../../static/img/zs.png" alt="招商银行"/>
          <span className={styles.name}>招商银行</span>
          <div className={styles.exchangeInfo}>
            每
            <span className={styles.focus}>1000</span>
            积分的价值为
            <span className={styles.focus}>6.88</span>
            元，最低
            <span className={styles.focus}>58000</span>
            分起兑。
          </div>
          <span className={styles.integralQuery}>
            积分查询：&nbsp;[招商银行]使用银行预留手机号编辑短信"CXJF+空格+卡号后四位"发到95528，查询积分，（+号不用写）
          </span>
        </div>
        <div className={styles.interval}>.</div>
        <div className={styles.productList}>
          <span className={styles.text}>支持兑换产品列表</span>
          <div className={styles.list}>
            <div className={styles.row}>
              <div className={styles.columnFirst}><span>积分</span></div>
              <div className={styles.columnSecond}>银行商品</div>
              <div className={styles.columnThird}>可换购Pluss刷卡金</div>
            </div>
            <div className={styles.row} style={{fontSize: '0.26rem'}}>
              <div className={styles.columnFirst}>30000</div>
              <div className={styles.columnSecond}>100元沃尔玛购物券</div>
              <div className={styles.columnThird} style={{color: '#3399FF'}}>30元刷卡金</div>
            </div>
            <div className={styles.row}>
              <div className={styles.columnFirst}>50000</div>
              <div className={styles.columnSecond}>500元沃尔玛购物券</div>
              <div className={styles.columnThird} style={{color: '#3399FF'}}>50元刷卡金</div>
            </div>
          </div>
        </div>
        <div className={styles.interval}>.</div>
        <div className={styles.cashFlow}>
          <span className={styles.text}>兑换流程</span>
          <img src={process} alt="兑换流程" className={styles.process}/>
        </div>
        <div className={styles.interval} style={{height: '0.28rem'}}>.</div>
        <div className={styles.submit}>立即兑换</div>
      </div>
    );
  }
}

