import {combineReducers} from "redux";
import TodoReducer from './modules/reducer/reducer.js';

export const reducers = combineReducers({
    Todo : TodoReducer
});
