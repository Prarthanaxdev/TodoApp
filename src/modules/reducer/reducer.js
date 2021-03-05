import types from '../actionTypes';

var initialState ={
    todoList : ''
}

export default function TodoReducer(state = initialState, action){
    switch (action.type) {
        case types.TODO_LIST:
            return {
                ...state,
                todoList : action.todos
            }
    
        default:
            return {};
    }
}