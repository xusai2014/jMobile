// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { actionGenerator } from '../actions/reqAction';

export function InitDecorator<
  S, // Redux state
  RS:{ dispatch: Function, isLogged:string, reqParams:Object }, // 注入返回的 Props
  Con, // 装饰的最终容器
  C:React.ComponentType<RS>, // 目标组件
  M:<S, RS>(s: S) => RS // 订阅Redux
  >(m: M): (WrappedComponent: C) => Con {
  return WrappedComponent => connect(state => ({
    isLogged: state.GlobalReducer.isLogged,
    reqParams: state.GlobalReducer.reqParams,
    ...m(state)
  }))(
    class extends React.Component<RS> {
      render() {
        const { props } = this;
        return (
          <WrappedComponent
            {...props}
            apiDispatcher={(type: PromiseActionType, data: Object) => props.dispatch(actionGenerator({ type, data }))}
          />);
      }
    }
  );
}

export default InitDecorator;

