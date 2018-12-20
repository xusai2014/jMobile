// @flow
import { createStore, applyMiddleware } from 'redux';
import type { DispatchAPI } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import reducers from '../reducers';

// 处理旧API的数据逻辑

const handleOldAPI = (result: Object, next: Function, types: PromiseActionType, rest: any): Promise<BaseAction> => {
  const [, SUCCESS] = types;
  const { DATA = {} } = result;
  if (SUCCESS === 'M511') {
    const { bindList } = result;
    return next({ ...rest, data: bindList, type: SUCCESS });
  }
  if (SUCCESS === 'CH828') {
    const { bankNm, type } = result;
    return next({ ...rest, data: { bankNm, type }, type: SUCCESS });
  }
  if (SUCCESS === 'M814' || SUCCESS === 'M113' || SUCCESS === 'M512'
    || SUCCESS === 'M502' || SUCCESS === 'MP013' || SUCCESS === 'M503' || SUCCESS === 'CH803' || SUCCESS === 'CH813') {
    return next({ ...rest, data: result, type: SUCCESS });
  }
  return next({ ...rest, data: DATA, type: SUCCESS });
};

type Action = PromiseAction | BaseAction;

const promiseMiddleware: any = () => (next): DispatchAPI<Action> => (action: Action) => {
  if (!action.promise) {
    return next(action);
  }
  const { types, promise, ...rest } = action;
  const [, SUCCESS, FAILURE] = types;

  return promise().then(
    (result) => {
      const { RETURNCODE, RESULTCODE } = result;
      if (RESULTCODE === '1001' || RESULTCODE === '1000') {
        return next({ ...rest, data: result, type: SUCCESS });
      }
      if (RETURNCODE === '0000' || RESULTCODE === '0000') {
        return handleOldAPI(result, next, types, rest);
      }
      next({ ...rest, data: null, type: SUCCESS });
      next({ ...rest, data: result, type: FAILURE });
      throw Error(`接口失败${JSON.stringify(result)}`);
    },
    (error) => {
      next({ ...rest, data: error, type: FAILURE });
      throw Error(error.message?error.message:"接口失败");
    }
  );
};

type State = any;
const Storage = () => {
  const finalCreateStore = composeWithDevTools(applyMiddleware<Action, State, DispatchAPI<Action>>(promiseMiddleware))(createStore);
  return finalCreateStore(reducers);
};

export default Storage();
