import React from 'react';
import styles from './DebounceButton.less'
type Props = {
  disabled?: boolean,
  onClick?: Function,
  className?: string,
  children?: React.ComponentType<any>,
  activeClassName?:string,
  activeOpen?:boolean,
}
export default class DebounceButton extends React.Component<{}, Props> {
  THROTTOLE_TIME = 250;

  constructor(props) {
    super(props);
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
      className={`${className} ${activeOpen?activeClassName:""} ${styles.btn}`}
    >{children}</button>);
  }
}