import { createStore, applyMiddleware } from 'redux';
import reducers from '../reducers';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

function promiseMiddleware() {
  return (next) => (action) => {
    const { promise, types, ...rest } = action

    if (!promise) {
      return next(action)
    }

    const [REQUEST, SUCCESS, FAILURE] = types;

    next({...rest, type: REQUEST})

    return promise().then(
      (result) => {
        const { data, code} =  result;
        next({...rest, data, type: 'FINISH'})
        if(code  == '200'){

            return next({...rest, data, type: SUCCESS})

        } else {
            next({...rest, data:null, type: SUCCESS});
            next({...rest, result, type: FAILURE})
          throw Error('接口失败')

        }
      },
      (error) => {
         next({...rest, error, type: FAILURE})
        throw Error('接口失败')
      }
    )
  }
}

 const Storage = ()=> {
  const finalCreateStore = composeWithDevTools(applyMiddleware(promiseMiddleware))(createStore)
  return finalCreateStore(reducers)
}


export default Storage();
