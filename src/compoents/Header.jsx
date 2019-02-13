// @flow
import React from 'react';
import { withRouter } from 'react-router-dom';
import { jsNative } from 'sx-jsbridge';
import styles from './Header.less';

@withRouter
 export default class Header extends React.Component {
  componentWillMount() {
    const { props } = this;
    this.refreshTitle(props.title);
  }

  componentWillReceiveProps(nextprops) {
    const { props } = this;
    if (props.title !== nextprops.title) {
      this.refreshTitle(nextprops.title);
    }
  }

  refreshTitle = (title) => {
    if (!title) {
      return;
    }
    window.requestAnimationFrame(() => {
      document.title = title;
    });
  }

  backStart = () => {
    jsNative.nativeCallBindCreditCard({}, (data) => {
      const { TaskCenter = '' } = data;
      if (window.location.href.includes('/cards/cardslist') && parseInt(TaskCenter, 10) === 1) {
        jsNative.nativeCloseWebview({}, () => {
        });
      } else {
        window.history.go(-1);
      }
    });
  }

  render() {
    const { title, hide, right, color = '#FFFFFF', backStart = this.backStart } = this.props;
    return (
      [
        <div
          className={styles.container}
          style={{ background: color }}
          key={'1'}
        >
          {
            hide ? null
              :
              <div className={styles.body}>
                <div className={styles.left}
                     onClick={() => {
                       backStart();
                     }}
                >
                  <img src="/static/img/back.png" className={styles.left_icon}/>
                </div>
                <span className={styles.title}>{title}</span>
                <div className={styles.right}>{right}</div>
              </div>
          }
        </div>,
        <div key={'2'} className={styles.bottom} style={{background: color}}></div>
      ]
    );
  }
}
