import React from 'react';
import {getActivityData} from "../../actions/reqAction";
import {InitDecorator} from "../../compoents/InitDecorator";
import {jsNative} from "sx-jsbridge";

@InitDecorator((state)=>{
  return {
    activityData:state.BillReducer.activityData
  }
})
export default class Adtivity extends React.Component{

  componentWillMount(){
    this.props.dispatch(getActivityData({activeType:'04'}))
  }

  render(){
    const { activityData ={} }  = this.props;
    const { operateActivities =[] } = activityData
    return <div style={{marginTop:'0.5rem'}}>
      {
        operateActivities.map((v,k)=>{
          const { url, icon} = v;
          return <img onClick={()=>jsNative.nativeOpenNewWebView({url:url},()=>{})} src={icon} style={{width:'6.94rem',margin:"0 0.28rem"}} />
        })
      }
    </div>
  }
}