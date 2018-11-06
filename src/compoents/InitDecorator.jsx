import React from 'react';
import { connect } from 'react-redux';
import { jsNative } from "sx-jsbridge";
const  { nativeRequestBaseParams } = jsNative;

export const InitDecorator = (mergeStateToprops  = ()=>{ return {} }) => (Coms) => {
  return connect((state)=>{
    return {
      isLogged:state.GlobalReducer.isLogged,
      reqParams:state.GlobalReducer.reqParams,
      ...mergeStateToprops(state)
    }
  })(class extends React.Component {
    constructor(props) {
      super(props);
      this.resetParams();
    }

    syncData(v){
      this.props.dispatch({type:'syncData',data:v})
    }

    /**
     * 重置native返回的请求参数
     */
    resetParams() {
      nativeRequestBaseParams().then((reqParams) => {
        this.syncData(reqParams);
      })
    }

    /**
     * 获取请求基础参数
     * @returns {{APPVERSION: *, OSVERSION: *, PLATFORM: *, TOKEN_ID: *, CHANNEL_NO: *}}
     */
    getBaseParams = () => nativeRequestBaseParams().then((reqParams) => {
      this.syncData(reqParams);
    })


    render() {
      return (
        <Coms
          {...this.props}
          getBaseParams={this.getBaseParams}
          resetParams={() => this.resetParams()}
        />

      )
    }
  })
}