import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Icon} from "antd-mobile";
import {jsNative} from "sx-jsbridge";

class AllHeader extends React.Component {
  componentWillMount() {
    this.refreshTitle(this.props.title);
  }

  refreshTitle(title) {
    if (!title) {
      return;
    }
    document.title = title;
  }

  componentWillReceiveProps(nextprops) {
    if (this.props.title != nextprops.title) {
      this.refreshTitle(nextprops.title);
    }
  }

  backStart() {
    jsNative.nativeCallBindCreditCard({},(data)=>{
      const { TaskCenter = '' } = data;
      if( window.location.href.indexOf('/cards/cardslist') >0 && parseInt(TaskCenter) == 1 ){
        jsNative.nativeCloseWebview({},()=>{})
      } else {
        window.history.go(-1);
      }

    })

  }

  render() {
    const {title, hide, right ,color="#FFFFFF", backStart = this.backStart} = this.props;
    return ([<div style={{ zIndex: '100',position:'fixed',height:'0.96rem',width:'7.5rem',background: color,}}>
      {
        hide ? null :
            <div   style={{textAlign:'center',lineHeight:"0.96rem"}}>
              <div style={{
                height: "0.96rem",
                display: "inline-flex",
                alignItems: "center",
                position:'absolute',
                left:'0rem',
                width: '1rem'
              }} onClick={()=>{backStart();}}>
                <img src="/static/img/back.png" style={{ width:"0.19rem",height:'0.34rem',marginLeft:'0.31rem'}} />
              </div>
              <span style={{
                fontSize: '0.31rem',
                color: '#333333',
                letterSpacing: '0',
                fontWeight:'500'
              }}>
                {title}
              </span>
              <div style={{
                position: 'absolute',
                right: "0.29rem",
                color:"#4C7BFE",
                display: 'inline-flex',
                alignItems: 'center',
                height: '0.96rem',
              }}>{right}</div>
            </div>
      }

    </div>,<div style={{ height:'0.96rem',width:'7.4rem',background: color,border:"1px solid #F1F1F1"}}></div>])
  }
}

const mapPropsToState = (state) => {
  return {
    startPage: ''
  }
};

export default withRouter(connect(mapPropsToState)(AllHeader))
