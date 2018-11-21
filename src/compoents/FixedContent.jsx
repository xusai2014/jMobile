// @flow
import * as React from 'react';
import { withRouter } from 'react-router-dom';

type Props = {
  className:string,
  children:React.Node
}
type State = {}

@withRouter
export default class FixedContent extends React.Component<Props, State> {
  componentWillMount() {
    this.initStyle();
  }

  componentDidMount() {
    window.addEventListener('resize', this.initStyle);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.initStyle);
  }

  initStyle = () => {
    const designedWidth = 750;
    const actualWidth = Math.min(450, $(window).width());

    window.requestAnimationFrame(() => {
      if (document.body && document.body.style) {
        document.body.style.overflowY = '';
        document.body.style.position = 'static';
      }
    });
    if(document.documentElement){
      document.documentElement.style.fontSize = `${actualWidth * 100 / designedWidth}px`;
    }
  };

  render() {
    const { children, className } = this.props;
    return (
      <div
        ref="content"
        className={className}
        style={{ background: '#F5F5F5', width: '7.5rem', minHeight: gloablMinHeight }}>
        {children}
      </div>
    );
  }
}