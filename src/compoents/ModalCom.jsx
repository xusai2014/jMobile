import React from 'react';
import { Modal } from "antd-mobile";
/**
*   @author jerryxu
*   @methodName ModalCom
*   @params
 *   {
  *     visible ,
  *     showAction ,
  *     description,
  *     title,
  *     showAction
  *   }
*   @description 封装Alert弹出框
*/
export default class ModalCom extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      modal:false
    }
  }

  showModal = key => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.props.showAction(true)
  }
  onClose = key => () => {
    this.props.showAction(false)
  }

  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  }


  render() {
    const { visible ,description } = this.props;

    return <Modal
      visible={visible}
      transparent
      maskClosable={false}
      onClose={this.onClose('modal')}
      footer={[{ text: '我知道了', onPress: () => { console.log('ok'); this.onClose('modal')(); } }]}
      wrapProps={{ onTouchStart: this.onWrapTouchStart }}
    >
      <div>
        { description }
      </div>
    </Modal>
  }
}

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}