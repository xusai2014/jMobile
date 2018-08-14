import {combineReducers} from 'redux';
import GlobalReducer from './GlobalReducer';
import BillReducer from './BillReducer';
import CardsReducer from './CardsReducer'


const mainReducer = combineReducers({
    GlobalReducer,
    BillReducer,
    CardsReducer,
});

export default  mainReducer;

