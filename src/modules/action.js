
let nextTodoId = 0
export const TodosList = (text) => {
  return {
    type: 'TODO_LIST',
    todos: text.data,
    
  }
}

export const addTodos = (text) => {
  return {
    type: 'ADD_TODO',
    todoName: text,
    
  }
}

