import {createStore, applyMiddleware} from 'redux';
import reducers from '../reducers';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';

function promiseMiddleware() {
  return (next) => (action) => {
    const {promise, types, ...rest} = action

    if (!promise) {
      return next(action)
    }

    const [REQUEST, SUCCESS, FAILURE] = types;

    return promise().then(
      (result) => {
        const {RETURNCODE, DATA ={}, RESULTCODE} = result;
        if(RESULTCODE == '1001' || RESULTCODE == "1000"){
          return next({...rest, data:result, type: SUCCESS})
        }
        if (RETURNCODE == '0000' || RESULTCODE == '0000') {
          if(SUCCESS == 'M511'){
            const { bindList } = result;
            return next({...rest, data:bindList, type: SUCCESS})
          } else if(SUCCESS == "CH828" ){
            const { bankNm,type } = result;
            return next({...rest, data:{bankNm,type}, type: SUCCESS})
          }else  if( SUCCESS == 'M814'|| SUCCESS == 'M113'||SUCCESS == 'M512'
            ||SUCCESS == 'M502'|| SUCCESS =='MP013'|| SUCCESS == 'M503' || SUCCESS == 'CH803' || SUCCESS == 'CH813' ){
            return next({...rest, data:result, type: SUCCESS})
          } else {
            return next({...rest, data:DATA, type: SUCCESS})
          }
        } else{
          next({...rest, data: null, type: SUCCESS});
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

const Storage = () => {
  const finalCreateStore = composeWithDevTools(applyMiddleware(promiseMiddleware))(createStore)
  return finalCreateStore(reducers)
}


export default Storage();
