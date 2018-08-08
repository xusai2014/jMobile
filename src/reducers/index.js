import {combineReducers} from 'redux';
import GlobalReducer from './GlobalReducer';
import BillReducer from './BillReducer';


const mainReducer = combineReducers({
    GlobalReducer,
    BillReducer,
});

export default  mainReducer;

