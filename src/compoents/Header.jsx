import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Icon} from "antd-mobile";

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
    const {startPage} = this.props;
    startPage ? this.props.history.push(startPage) : window.history.back();
  }

  render() {
    const {title, hide, right} = this.props;
    const ua = window.navigator.userAgent;
    return (<div style={{height:'0.81rem',width:'7.5rem',background: "#FFFFFF",border:"1px solid #F1F1F1"}}>
      {
        hide ? null :
            <div   style={{textAlign:'center',lineHeight:"0.81rem"}}>
              <div style={{
                height: "0.81rem",
                display: "inline-flex",
                alignItems: "center",
                position:'absolute',
                left:'0.11rem'
              }}>
                <Icon color="#666666" type="left" size={'md'} onClick={()=>{
                  window.history.go(-1);
                }}/>
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
                display:'inline-block',
                position: 'absolute',
                right: "0.29rem",
                color:"#4C7BFE"
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
