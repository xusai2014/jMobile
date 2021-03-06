// @flow
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import styles from './FixedContent.less';

// import { TransitionGroup, CSSTransition } from "react-transition-group";

@withRouter
export default class FixedContent extends React.Component {
  componentWillMount() {
    //this.initStyle();
  }

  componentDidMount() {
    //window.addEventListener('resize', this.initStyle);
  }

  // Scroll Restoration
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount() {
    //window.removeEventListener('resize', this.initStyle);
  }


  render() {
    const { children, className = '' } = this.props;
    return (
        <div
          ref="content"
          className={`${styles.container} ${className}`}
          style={{ minHeight: gloablMinHeight }}>
          {children}
        </div>
    );
  }
}
