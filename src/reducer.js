// import Libraries
import {combineReducers} from "redux";

import TodoReducer from './modules/reducer/reducer.js';

// export global combined reducer
export const reducers = combineReducers({
    Todo : TodoReducer
});
