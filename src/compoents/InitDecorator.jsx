import React from 'react';
import { connect } from 'react-redux';
import { jsNative } from 'sx-jsbridge';
import { ActionCreator } from '../utils/fetch-middleware';

const { nativeRequestBaseParams } = jsNative;

export const InitDecorator = (mergeStateToprops = () => ({})) => Coms => connect(state => ({
  isLogged: state.GlobalReducer.isLogged,
  reqParams: state.GlobalReducer.reqParams,
  ...mergeStateToprops(state)
}))(class extends React.Component {
  constructor(props) {
    super(props);
    this.resetParams();
  }

  /**
   * 获取请求基础参数
   * @returns {{APPVERSION: *, OSVERSION: *, PLATFORM: *, TOKEN_ID: *, CHANNEL_NO: *}}
   */
  getBaseParams = () => nativeRequestBaseParams().then((reqParams) => {
    this.syncData(reqParams);
  });

  /**
   * 重置native返回的请求参数
   */
  resetParams() {
    nativeRequestBaseParams().then((reqParams) => {
      this.syncData(reqParams);
    });
  }

  syncData(v) {
    const { props } = this;
    props.dispatch({ type: 'syncData', data: v });
  }

  render() {
    const { props } = this;
    return (
      <Coms
        {...props}
        getBaseParams={this.getBaseParams}
        resetParams={() => this.resetParams()}
        apiDispatcher={(type, data) => props.dispatch(ActionCreator({
          type,
          url: '/api',
          method: 'POST',
          data: { ...data, TRDE_CODE: type[1] }
        })())}
      />);
  }
});
export default InitDecorator;

