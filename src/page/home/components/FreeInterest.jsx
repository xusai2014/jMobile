/**
 *   @author jerryxu
 *   @className FreeInterest
 *   @params
 *   {
 *      parentParams, 父组件传递
 *      apiInitData，  Redux 订阅
 *   }
 *   @warning 免息期面板，部分服务端数据需二次加工，接口需优化
 */
import React from 'react';
import { Modal } from "antd-mobile";
import { getFreeInterest } from "../../../actions/reqAction";
import { InitDecorator } from "../../../compoents/InitDecorator";
import FreeItem from "./FreeItem";
import { computerFreePeriod } from "../../../utils/util";
@InitDecorator((state) => {
  return {
    apiInitData: state.BillReducer.freeIntrestData,
  }
})
export default class FreeInterest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingData: true,
    }
  }

  componentDidMount() {
    this.initData()
  }

  initData() {
    this.props.dispatch(getFreeInterest()).then((result) => {
      this.setState({ loadingData: false })
    }, () => {
      this.setState({ loadingData: false })
    })
  }

  onWrapTouchStart = (e) => {
    // antd-mobile 提供的差异化处理，貌似没个卵用
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = this.closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  }

  closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
      if (matchesSelector.call(el, selector)) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  render() {
    const {
      parentParams = {},
      apiInitData = [],
    } = this.props;
    const {
      isShow, closeFunc,
    } = parentParams;
    const {
      loadingData
    } = this.state;
    return isShow ?
      <Modal
        style={{ width: '6rem' }}
        key={'d'}
        visible={isShow}
        transparent
        maskClosable={true}
        onClose={() => {
          document.body.style.position = 'static';//恢复默认position
          closeFunc();
        }}
        title={<div style={{ textAlign: 'left' }}>最长免息期</div>}
        wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        closable={true}
      >
        <div style={{ height: '5.03rem', overflow: 'scroll' }}>
          {
            !loadingData ? (apiInitData.length == 0 ? <div style={{ marginTop: '0.6rem' }}>
              <img style={{ width: '1.55rem' }} src="/static/img/Bitmap@1x.png"/>
              <div>未导入信用卡账单</div>
              <div>无记录查看</div>
            </div>
              : apiInitData.map((v, k) => {
                const { bank_logo: imgSrc, credit_limit, balance, bank_name, payment_due_date, card_number, bill_type } = v;
                const freeInterest = computerFreePeriod(bill_type, payment_due_date);
                return <FreeItem key={k}
                                 credit_limit={credit_limit}
                                 imgSrc={imgSrc}
                                 title={bank_name}
                                 card_number={card_number}
                                 freeInterest={freeInterest}
                                 balance={balance}
                                 {...v}
                />
              })) : null
          }
        </div>
      </Modal> : null
  }
}