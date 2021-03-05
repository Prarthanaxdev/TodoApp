// import types from './actionTypes';

// const addTodos = text => ({
//   type: types.ADD_TODO,
//   text,
// });

// export function addTodos(text) {
//   return {
//     type: types.ADD_TODO,
//     text
//   }
// }

let nextTodoId = 0
export const addTodos = (text) => {
  return {
    type: 'TODO_LIST',
    todos: text.data,
    
  }
}

// export default addTodos;