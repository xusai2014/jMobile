import React, {Component} from 'react';
import styles from './Home.less';
import { Carousel } from 'antd-mobile';
import Header from '../../compoents/Header';
import BankList from './components/BankList';
import BannerItem from './components/BannerItem';
import process from '../../../static/img/process.png';
import DebounceButton from '../../compoents/DebounceButton';

export default class Home extends Component {
  state = {
    bankName: '广大银行', // 选中的银行名称
    dotsShow: true,  // 是否显示指示点
    bankList: [], // 银行列表
    hasGoods: true, // 是否有可换购的商品
    number: '1000', // 积分数
    value: '6.88', // 换购价值
    lowestcoreS: '58000',// 最低起购分数
  }
  componentWillMount() {
    // this.props.dispatch(getbankList({ bankName: abbr })).then((result) => {
    //   if(false) this.setState({
    //     hasGoods: false
    //   })
    // });
    // for (let i=0;i<data.length;i++) // 默认选中第一家有产品的银行
    // {
    //   if(data[i].product) { // 如果产品列表不为空
    //     this.setState({
    //           bankName: result.data[i].name,
    //       number:result.data[i].number,
    //       value
    //       lowestcoreS
    //         });
    //   }
    //    return;
    // }
      // const { bankList } = this.state;
    // if (bankList.length <= 8) {
    //   this.setState({
    //     dotsShow: false
    //   });
    // };
  }
  componentDidMount() {
  }

  // 选择相应的银行
  chooseBank = (name,productList) => {
    // if (!productList) {//如果银行下没有正常状态的商品
    //   this.setState({
    //     hasGoods: false
    //   });
    // } esle{
    //   this.setState({
    //     number: '1000', // 积分数
    //     value: '6.88', // 换购价值
    //     lowestcoreS: '58000',// 最低起购分数
    //   })
    // }
    const { bankName } = this.state;
    console.log('name', name);
    this.setState({
      bankName: name
    });
    console.log('bankName', bankName);
  }
  // 实现银行列表的自动分页
  bannerArrange = (bankList) => {
    const { bankName } = this.state;
    const pageNumber = Math.ceil(bankList.length / 8);
    const newArray = [];
    for (let i = 0; i < pageNumber; i++) newArray.push(i);
    const content = newArray.map((v) => {
      const pageContent = bankList.slice(8 * v, 8 * (v + 1));
      const bankitems = pageContent.map((v, k) => {
        return <BankList echoData={v} key={k} chooseBank={this.chooseBank} selected={v.name == bankName} />;
      });
      return <BannerItem children={bankitems} key={v} />;
    });
    return content;
  }
  // 点击兑换记录
  clickrightTitle = () => {
    this.props.history.push('/myapp/exchangeRecord');
  }
  // 点击刷卡金跳到对应的兑换流程
  processMange = () => {
    this.props.history.push('/myapp/Process');
  }
  // 点击立即兑换实现跳转
  immediatelyChange = () => {
     this.props.history.push('/myapp/Process');
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
    const { dotsShow, hasGoods, number, value, lowestcoreS } = this.state;
    return (
      <div className={styles.container}>
        <Header title="积分兑换" right="兑换记录" clickrightTitle={this.clickrightTitle} />
        <div className={styles.chooseBank}>选择银行</div>
        <div className={styles.bankList}>
          <Carousel
            autoplay={false}
            infinite
            dotStyle={{width: '0.1rem', height: '0.1rem', borderRadius: '50%', background: '#BBBBBB'}}
            dotActiveStyle={{width: '0.1rem', height: '0.1rem', borderRadius: '50%', background: '#3399FF'}}
            dots={dotsShow}
          >
            {this.bannerArrange(bankList)}
          </Carousel>
        </div>
        <div className={styles.interval}>.</div>
        <div className={styles.bankDetail}>
          <img src="../../../../static/img/zs.png" alt="招商银行" />
          <span className={styles.name}>招商银行</span>
          <div className={styles.exchangeInfo}>
            每
            <span className={styles.focus}>{number}</span>
            积分的价值为
            <span className={styles.focus}>{value}</span>
            元，最低
            <span className={styles.focus}>{lowestcoreS}</span>
            分起兑。
          </div>
          <span className={styles.integralQuery}>
            积分查询：&nbsp;[招商银行]使用银行预留手机号编辑短信"CXJF+空格+卡号后四位"发到95528，查询积分，（+号不用写）
          </span>
        </div>
        <div className={styles.interval}>.</div>
        {
          hasGoods ?
            <div>
              <div className={styles.productList}>
                <span className={styles.text}>支持兑换产品列表</span>
                <div className={styles.list}>
                  <div className={styles.row}>
                    <div className={styles.columnFirst}><span>积分</span></div>
                    <div className={styles.columnSecond}>银行商品</div>
                    <div className={styles.columnThird}>可换购Pluss刷卡金</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.columnFirst}>30000</div>
                    <div className={styles.columnSecond}>100元沃尔玛购物券</div>
                    <div className={styles.columnThird} style={{ color: '#3399FF' }} onClick={this.processMange}>30元刷卡金</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.columnFirst}>50000</div>
                    <div className={styles.columnSecond}>500元沃尔玛购物券</div>
                    <div className={styles.columnThird} style={{ color: '#3399FF' }} onClick={this.processMange}>50元刷卡金</div>
                  </div>
                </div>
              </div>
              <div className={styles.interval}>.</div>
            </div>
            :null
        }
        <div className={styles.cashFlow}>
          <span className={styles.text}>兑换流程</span>
          <img src={process} alt="兑换流程" className={styles.process} />
        </div>
        <div className={styles.interval} style={{ height: '0.28rem' }}>.</div>
        <div className={styles.submit}>
          <DebounceButton className={styles.button} onClick={this.immediatelyChange}>
            立即兑换
          </DebounceButton>
        </div>
      </div>
    );
  }
}

