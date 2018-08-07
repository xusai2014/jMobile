import React from 'react';
import { nativeRequestBaseParams } from "../interface/jsNative";
import { connect } from 'react-redux';

export const InitDecorator = () => (Coms) => {
  return connect((state)=>{
    return {isLogged:state.GlobalReducer.isLogged}
  },(dispatch)=>{
    return{
      setLogin:(v)=>dispatch({type:'setLogin',data:v})
    }
  })(class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        APPVERSION:'',
        OSVERSION:'',
        PLATFORM:'',
        TOKEN_ID:'',
        CHANNEL_NO:""
      }
      this.resetParams();
    }

    /**
     * 重置native返回的请求参数
     */
    resetParams() {
      nativeRequestBaseParams().then((reqParams) => {
        this.props.setLogin(!!reqParams['token']);
        this.setState({
          APPVERSION: reqParams['APP_VERSIONS'],
          OSVERSION: reqParams['PHONE_VERSIONS'],
          PLATFORM: reqParams['PHONE_PLATFORM'],
          TOKEN_ID: reqParams['token'],
          CHANNEL_NO: reqParams['channelNo'],
        })
      })
    }

    /**
     * 获取请求基础参数
     * @returns {{APPVERSION: *, OSVERSION: *, PLATFORM: *, TOKEN_ID: *, CHANNEL_NO: *}}
     */
    getBaseParams = () => nativeRequestBaseParams().then((reqParams) => {
      this.props.setLogin(!!reqParams['token']);
      const data = {
        APPVERSION: reqParams['APP_VERSIONS'],
        OSVERSION: reqParams['PHONE_VERSIONS'],
        PLATFORM: reqParams['PHONE_PLATFORM'],
        TOKEN_ID: reqParams['token'],
        CHANNEL_NO: reqParams['channelNo'],
      }
      this.setState({...data})
      return data;
    })


    render() {
      const { APPVERSION, OSVERSION, PLATFORM, TOKEN_ID, CHANNEL_NO } = this.state;
      return (
        <Coms
          {...this.props}
          reqParams={{
            APPVERSION,
            OSVERSION,
            PLATFORM,
            TOKEN_ID,
            CHANNEL_NO
          }}
          getBaseParams={this.getBaseParams}
          resetParams={() => this.resetParams()}
        />
      )
    }
  })
}