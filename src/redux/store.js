import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import mainReducer from '../redux/mainReducer';

const promiseMiddleware = () => (next) => (action) => {
  if (!action.promise) {
    return next(action);
  }
  const {types, promise, ...rest} = action;
  const [, SUCCESS, FAILURE] = types;

  return promise().then(
    (result) => {
      next({...rest, data: null, type: SUCCESS});
      next({...rest, data: result, type: FAILURE});
      throw Error(`接口失败${JSON.stringify(result)}`);
    },
    (error) => {
      next({...rest, data: error, type: FAILURE});
      throw Error(error.message ? error.message : '接口失败');
    }
  );
};

const Storage = () => {
  const finalCreateStore = composeWithDevTools(applyMiddleware(promiseMiddleware))(createStore);
  return finalCreateStore(mainReducer);
};

export default Storage();

