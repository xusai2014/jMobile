import React from 'react';
import styles from './DebounceButton.less';
import _debounce from 'lodash/debounce';

export default class DebounceButton extends React.Component{
  THROTTOLE_TIME = 250;

  constructor(props) {
    super(props);
    // 截流，函数抖动
    this.emitChangeDebounced = _debounce(this.excute.bind(this), this.THROTTOLE_TIME);
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
