import React from 'react';
import {Modal, Icon} from 'antd-mobile'
import CustomIcon from "../../compoents/CustomIcon";
import BillCard from "./BillCard";
export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      interestShow: false, //免息期弹窗展示
    }
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
    const {interestShow,} = this.state;
    return [<div style={{background: '#FFFFFF', paddingBottom: "0.7rem"}}>
      <div style={styles.top}>
        <div style={styles.topText}>7日内待还<span style={styles.topSubText}>{'0'}笔</span></div>
        <img style={styles.img} src="/static/img/canlendar@2x.png"/>
        <span style={styles.icon}><Icon type="plus" size="sm" color="#000"/></span>
      </div>
      <div style={{marginTop: "0.19rem"}}>
          <span style={{
            fontSize: '0.52rem',
            color: '#333333',
            letterSpacing: '0',
            textAlign: 'center',
            marginLeft: '0.26rem',
            fontWeight: 'bold'
          }}>{18889.00}<span style={{
            fontSize: '0.26rem',
            color: '#333333',
            letterSpacing: '0',
            textAlign: 'center',
            marginLeft: "0.045rem"
          }}>元</span></span></div>
      <div style={styles.cover}>
        {
          [{img: "/static/img/kabao@2x.png", text: "卡包"}, {img: "/static/img/banka@2x.png", text: "办卡"}].map((v, k) => {
            const {img, text} = v
            return <div>
              <span style={{margin: "0.32rem 0 0 0", display: 'inline-block'}}>
                <img src={img} style={{width: '0.65rem'}}/>
              </span>
              <div style={{fontSize: '0.3rem', color: '#FFFFFF', letterSpacing: '0', textAlign: 'center'}}>
                {text}
              </div>
            </div>
          })
        }
      </div>
    </div>,<div>
      {
        [1].map(()=>{
          return <BillCard  />
        })
      }
    </div>,
      <div style={{
        display: 'flex',justifyContent: 'center',alignItems: 'center',
        background: '#FFFFFF', height:'0.84rem',widht:'7.5rem',margin:"0.2rem 0 0 0"}}>
        <Icon  type="plus" color="#999999" size="xs"/>
        <span style={{
          fontSize: '0.28rem',
          color: '#999999',
          letterSpacing: '0',
          textAlign: 'center',
          marginLeft:'0.08rem'
        }}>添加信用卡账单</span>

      </div>,
      <Modal
        visible={interestShow}
        transparent
        maskClosable={false}
        onClose={() => this.setState({interestShow: false})}
        title="Title"
        wrapProps={{onTouchStart: this.onWrapTouchStart}}
      >
        <div style={{height: 100, overflow: 'scroll'}}>
          scoll content...<br />
          scoll content...<br />
          scoll content...<br />
          scoll content...<br />
          scoll content...<br />
          scoll content...<br />
        </div>
      </Modal>
    , <div>


    </div>]
  }

}

const styles = {
  container: {},
  topText: {
    fontSize: '0.3rem',
    color: '#999999',
    letterSpacing: "0",
    margin: '0.38rem 0 0 0.26rem',
    display: 'inline-block'
  },
  img: {
    width: '0.33rem',
    margin: '0.38rem 0.48rem 0 3.725rem '
  },
  topSubText: {
    color: '#151515',
    textAlign: 'center',
    lineHeight: '0.42rem',
    marginLeft: '0.1rem',
  },
  top: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    margin: '0.38rem 0 0 0 '
  },
  cover: {
    backgroundImage: 'linear-gradient(-141deg, #5E86FF 6%, #564CFE 88%)',
    borderRadius: '0.2rem',
    width: '6.94rem',
    height: '1.84rem',
    margin: '0.26rem auto 0 auto',
    display: 'flex',
    justifyContent: 'space-around'
  }
}