import React from 'react';
import styles from './DebounceButton.less'
type Props = {
  disabled?: boolean, // 初始化按钮状态， disable  True禁止使用 False允许点击
  onClick?: Function, //  点击事件
  className?: string, //  定义样式
  children?: React.ComponentType<any>, //子节点
  activeClassName?:string,// 激活状态样式
  activeOpen?:boolean, // 开启激活状态交互，会使用默认激活状态样式
}
export default class DebounceButton extends React.Component<{}, Props> {
  THROTTOLE_TIME = 250;

  constructor(props) {
    super(props);
    // 截流，函数抖动
    this.emitChangeDebounced = _.debounce(this.excute.bind(this), this.THROTTOLE_TIME);
  }

  excute(v) {
    this.props.onClick();
  }

  btnClick(e) {
    const v = 1;
    this.emitChangeDebounced(v)
  }

  render() {
    const {
      disabled = false,
      className = '',
      children = null,
      activeClassName = styles.activeBtn,
      activeOpen = false
    } = this.props;
    return (<button
      disabled={disabled}
      onClick={this.btnClick.bind(this)}
      className={`${className} ${styles.btn} ${activeOpen?activeClassName:""}`}
    >{children}</button>);
  }
}