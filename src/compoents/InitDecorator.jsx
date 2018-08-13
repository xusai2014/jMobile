import React from 'react';
import { nativeRequestBaseParams } from "../interface/jsNative";
import { connect } from 'react-redux';

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
      return {
        APPVERSION: reqParams['APP_VERSIONS'],
        OSVERSION: reqParams['PHONE_VERSIONS'],
        PLATFORM: reqParams['PHONE_PLATFORM'],
        TOKEN_ID: reqParams['token'],
        CHANNEL_NO: reqParams['channelNo'],
      };
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