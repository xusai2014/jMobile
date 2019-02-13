import {combineReducers} from 'redux';
import GlobalReducer from './globalReducer';


const mainReducer = combineReducers({
    GlobalReducer,
});

export default  mainReducer;

