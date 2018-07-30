import React from 'react';
import { Modal, Icon } from 'antd-mobile'
export default class Index extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      interestShow:false, //免息期弹窗展示
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

  render(){
    const { interestShow, } = this.state;
    return <div>
      <div style={styles.top}>
        <div>
          <div>七日内待还|{"4"}笔</div>
          <div>{18889.00}元</div>
        </div>
        <div>
          <Icon type="smile" />
          <Icon type="plus" size="sm" color="#fff" />
        </div>
        </div>
      <div>Body</div>
      <Modal
        visible={interestShow}
        transparent
        maskClosable={false}
        onClose={()=>this.setState({interestShow:false})}
        title="Title"
        wrapProps={{ onTouchStart: this.onWrapTouchStart }}
      ><div style={{ height: 100, overflow: 'scroll' }}>
        scoll content...<br />
        scoll content...<br />
        scoll content...<br />
        scoll content...<br />
        scoll content...<br />
        scoll content...<br />
      </div>
      </Modal>
    </div>
  }

}

const styles = {
  container:{},
  top:{
    width:'6.8rem',
    margin:"0.1rem 0.35rem",
    height:"4rem",
    backgroundColor:"#2196F3",
    display:'flex',
    justifyContent: "space-between"
  }
}