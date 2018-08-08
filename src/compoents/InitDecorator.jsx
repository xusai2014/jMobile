import React from 'react';
import { nativeRequestBaseParams } from "../interface/jsNative";
import { connect } from 'react-redux';

export const InitDecorator = () => (Coms) => {
  return connect((state)=>{
    return {
      isLogged:state.GlobalReducer.isLogged,
      reqParams:state.GlobalReducer.reqParams,
    }
  },(dispatch)=>{
    return{
      syncData:(v)=>dispatch({type:'syncData',data:v}),
    }
  })(class extends React.Component {
    constructor(props) {
      super(props);
      this.resetParams();
    }

    /**
     * 重置native返回的请求参数
     */
    resetParams() {
      nativeRequestBaseParams().then((reqParams) => {
        this.props.syncData(reqParams);
      })
    }

    /**
     * 获取请求基础参数
     * @returns {{APPVERSION: *, OSVERSION: *, PLATFORM: *, TOKEN_ID: *, CHANNEL_NO: *}}
     */
    getBaseParams = () => nativeRequestBaseParams().then((reqParams) => {
      this.props.syncData(reqParams);
      return data;
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