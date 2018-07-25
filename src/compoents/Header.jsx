import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

class  AllHeader extends React.Component{
  componentWillMount () {
    this.refreshTitle(this.props.title);
  }
  refreshTitle(title){
    if(!title){
      return;
    }
    document.title = title;
  }
  componentWillReceiveProps(nextprops){
    if(this.props.title != nextprops.title){
      this.refreshTitle(nextprops.title);
    }
  }

  backStart(){
    const { startPage } = this.props;
    startPage ? this.props.history.push(startPage) : window.history.back();
  }

  render(){
    const {title,hide} = this.props;
    const ua = window.navigator.userAgent;
    return (<div>
      {(hide||/MicroMessenger/i.test(ua) || /SuiXingPay-Mpos/i.test(ua)||/SuiXingPay-Cashier/i.test(ua) ) ? '':<div className={styles.this+' '+styles['white']}>
        <div className={styles.center}>
          {title}
        </div>
        <div onClick={()=>{}}></div>
      </div>}
    </div>)
  }
}

const mapPropsToState = (state)=>{
  return {
    startPage:''
  }
};

export default withRouter(connect(mapPropsToState)(AllHeader))
