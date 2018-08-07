import React from 'react';
import { nativeRequestBaseParams } from "../interface/jsNative";

export const InitDecorator = () => (Coms) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state ={
        reqParams:{}
      }
    }

    /**
     * 重置native返回的请求参数
     */
    resetParams() {
      return nativeRequestBaseParams().then((reqParams) => {
        debugger;
        this.setState({ reqParams })
      })
    }



    /**
     * 获取请求基础参数
     * @returns {{APPVERSION: *, OSVERSION: *, PLATFORM: *, TOKEN_ID: *, CHANNEL_NO: *}}
     */
    getBaseParams = () => nativeRequestBaseParams().then((reqParams) => {
        this.setState({ reqParams })
        return {
          APPVERSION: reqParams['APP_VERSIONS'],
          OSVERSION: reqParams['PHONE_VERSIONS'],
          PLATFORM: reqParams['PHONE_PLATFORM'],
          TOKEN_ID: reqParams['TOKEN_ID'],
          CHANNEL_NO: reqParams['CHANNEL_NO'],
        }
      })



    /**
     * 是否登录
     * @returns {boolean}
     */
    isLogged = () => !!this.state.reqParams.TOKEN_ID;

    render() {
      const { reqParams } = this.state;
      return (
        <Coms
          {...this.props}
          reqParams={reqParams}
          isLogged={this.isLogged}
          getBaseParams={this.getBaseParams}
          resetParams={() => this.resetParams()}
        />
      )
    }
  }
}