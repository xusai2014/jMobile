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
    const {title, hide, right ,color="#FFFFFF"} = this.props;
    const ua = window.navigator.userAgent;
    return (<div style={{height:'0.81rem',width:'7.4rem',background: color,border:"1px solid #F1F1F1"}}>
      {
        hide ? null :
            <div   style={{textAlign:'center',lineHeight:"0.81rem"}}>
              <div style={{
                height: "0.81rem",
                display: "inline-flex",
                alignItems: "center",
                position:'absolute',
                left:'0.11rem',
                width: '1rem'
              }} onClick={()=>{this.backStart();}}>
                <Icon color="#666666" type="left" size={'md'} />
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
                height: '0.81rem',
              }}>{right}</div>
            </div>
      }

    </div>)
  }
}

const mapPropsToState = (state) => {
  return {
    startPage: ''
  }
};

export default withRouter(connect(mapPropsToState)(AllHeader))
