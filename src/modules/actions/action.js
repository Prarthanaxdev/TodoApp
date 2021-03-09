export const addTodos = (text) => {
  return {
    type: 'ADD_TODO',
    todoName: text,
    
  }
}

