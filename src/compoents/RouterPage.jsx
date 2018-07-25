import React from 'react';

export default class RouterPage extends React.Component {
  static title;
  constructor(props){
    super(props);
    const { title = '1111' } = props;
    this.refreshTitle( title )

  }

  refreshTitle(title){
    if(!title){
      return;
    }
    document.title = title;
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'display: none; width: 0; height: 0;';
    iframe.src = '/thirdfile/js/demo.js';
    const listener = () => {
      setTimeout(() => {
        iframe.removeEventListener('load', listener);
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 0);
      }, 0);
    };
    iframe.addEventListener('load', listener);
    document.body.appendChild(iframe);
  }
}