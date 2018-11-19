import React from 'react';
import Header from "../../compoents/Header";
import Card from "./components/Card";
import {Menu, Icon, Toast, Modal} from "antd-mobile";
import {InitDecorator} from "../../compoents/InitDecorator";
import {getBillId, getCardsList, getIndetiyInfo, looseCard} from "../../actions/reqAction";
import {jsNative} from 'sx-jsbridge'
import {judgeEnv} from "../../utils/util";
import globalStyle from "../../style/globalStyle";


@InitDecorator(
  (state) => {
    return {
      cardsList: state.CardsReducer.cardsList,
      examineAccount: state.CardsReducer.examineAccount,
    }
  }
)
export default class CardsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCard: -1,// -1不选择，其它值选择
      activeData: {},
      cardStatus: false,
      examineAccount: true,
    };
    this._isUnMount = false;
  }

  methodList = [
    {
      value: '0',
      label: '手写账单',
    }, {
      value: '1',
      label: '查看账单',
    }, {
      value: '2',
      label: '解绑',
      action: () => this.removeCard()
    },
  ]

  async getCards() {
    this.props.dispatch(getCardsList({
      type: '01',
    })).then((result) => {
      this.setState({
        cardStatus: true
      })
    }, (err) => {

    });

  }

  async removeCard(cardNo) {
      Modal.alert('', <span className="alert_content">是否确认解绑该信用卡</span>, [
      {text: '取消', onPress: () => console.log('cancel'), style: globalStyle.cancelStyle},
      {
        text: "确认", onPress: () => {
        this.props.dispatch(looseCard({
          isQuick: "00",
          cardNo
        })).then(() => {
          Toast.info('解绑成功');
          this.getCards()
        })
      }, style: globalStyle.sureStyle
      },
    ])
  }

  componentWillMount() {
    if(!this._isUnMount){
      this.getCards();
      this.getIdentityInfo()
    }
  }
  componentWillUnmount() {
    this._isUnMount = true;
    promiseList.cancel();
  }

  getIdentityInfo() {
    this.props.dispatch(getIndetiyInfo({
      appType: 'mpos'
    })).then((result) => {
      const {data} = result;
      const {MERC_SN = ''} = data;
      this.setState({
        examineAccount: MERC_SN == '700000000620451'
      })
    })
  }

  openCardMarket() {
    if (this.props.examineAccount) {
      return
    }
    let url = '';
    if (window.location.host.indexOf('mpmw.vbill.cn') > -1) {
      url = `https://cca.vbill.cn/cca/home?source=creditCard`
    } else {
      url = `https://mpcw${judgeEnv()}.vbill.cn/cca/home?channelId=1000&source=creditCard`
    }
    jsNative.nativeOpenNewWebView({
      url,
    })
    //https://mpcw-test.vbill.cn/cca/home
  }

  render() {
    const {activeCard, cardStatus,} = this.state;
    const {examineAccount} = this.props
    const {cardsList} = this.props;
    return <div>
      <Header title="卡包" hide={false}
              right={(<Icon style={{height: '0.3rem'}} type="plus" onClick={() => {
                this.props.history.push('/cards/edit');
              }}/>)}
      />
      <div style={{
        background: "#F0F7FF",
        lineHeight: '0.68rem',
        display: 'flex',
        justifyContent: 'center',
      }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }} onClick={() => this.openCardMarket()}>
          <img src="/static/img/信用卡@2x.png" style={{width: "0.3rem"}}/>
          <span style={{margin: '0.08rem', fontSize: '0.24rem', color: '#4C7BFE', letterSpacing: '0'}}>
            {examineAccount ? '  ' : '办信用卡'}
        </span>
          <img src="/static/img/Path 3@2x.png" style={{width: "0.1rem"}}/>
        </div>
      </div>
      <div>
        {cardStatus ? cardsList.length != 0 ? cardsList.map((v, k) => {
          const {actNo, bankNo, actName, bankNm} = v;
          return <Card id={k} {...v} key={k} popupCard={(v) => this.setState({
            activeCard: parseInt(v),
            activeData: {bankNm, actName, actNo, bankNo}
          })}></Card>
        }) : <div>
          <img src='/static/img/Bitmap2@1x.png' style={{width: '2.02rem', margin: '3rem 0rem 0.32rem 2.74rem'}}/>
          <div style={{
            fontSize: '0.26rem',
            color: '#999999',
            letterSpacing: '0',
            textAlign: 'center'
          }}>您暂未绑定信用卡
          </div>
          <div className="enableBtn" onClick={() => {
            this.props.history.push('/cards/edit');
          }}>添加信用卡
          </div>
        </div> : null
        }
      </div>
      {
        activeCard > -1 ? [
          <style key={'a'}>{`
        .single-foo-menu {
          z-index: 90 !important;
          width: 7.5rem;
          position:fixed;
          bottom:0;
        }

        .single-menu-active .single-top-nav-bar{
          z-index: 90;
        }

        .single-top-nav-bar {
          position: relative;
          background-color: #008AE6;
          color: #FFF;
        }
        .am-navbar-title {
          color: #FFF!important;
        }
        .menu-mask {
          position: fixed;
          top: 0;
          width: 7.5rem;
          background-color: #000;
          opacity: 0.23;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0;
          margin: 0;
        }
        .am-menu .am-flexbox .am-flexbox-item:first-child .am-list .am-list-item .am-list-line .am-list-content{
          text-align:center;
        }
      `}</style>, <Menu
            key={'c'}
            className="single-foo-menu"
            data={this.methodList}
            level={1}
            height={document.documentElement.clientHeight / 4}
            onChange={(data) => {
              const {activeData = {}} = this.state;
              const {actNo, bankNo, actName, bankNm} = activeData
              const index = data[0];
              this.setState({activeCard: -1})
              if (parseInt(index) == 0) {
                this.props.history.push("/manual/add", {
                  fullCardNum: actNo, nameOnCard: actName, bankNo, bankName: bankNm
                })
              } else if (parseInt(index) == 1) {
                const num = actNo.substr(-4, 4)
                this.props.dispatch(getBillId({
                  bankNo, cardNum: num
                })).then((result) => {
                  if (Object.keys(result.data).length != 0) {

                    this.props.history.push(`/bill/detail/${result.data}`,{bank_name:bankNm,card_num:actNo.substr(actNo.length-4),bank_id:bankNo})
                  } else {
                    // TODO  跳转逻辑 jerry
                      Modal.alert('', <span className="alert_content">此卡还未添加账单，请先导入账单再查看详情。</span>, [
                      {
                        text: "添加账单", onPress: () => {
                        this.props.history.push('/bill/method')
                      }, style: globalStyle.cancelStyle
                      },
                      {text: '取消', onPress: () => console.log('cancel'), style: globalStyle.sureStyle},
                    ])

                  }
                })
              } else if (parseInt(index) == 2) {
                this.removeCard(actNo)
              }
            }}
            multiSelect={false}
          />,
          <div key={'d'} className="menu-mask" onClick={() => {
            this.setState({activeCard: -1,})
          }}/>
        ] : null
      }
    </div>
  }
}