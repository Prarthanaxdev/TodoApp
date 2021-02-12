import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserProvider";
import { auth, firestore } from "../firebase";
import Grid from '@material-ui/core/Grid';
import "../App.css";
import image from './logo192.png'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

const ProfilePage = () => {
  const user = useContext(UserContext);
  const { photoURL, displayName, email } = user;
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState('')

  useEffect(() => {
    getTodos();
  }, [])

  const getTodos = () => {
    firestore.collection("todos").onSnapshot(function (querySnapshot) {
      setTodos(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          todos: doc.data().todo
        }))
      )
    })
  }

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;
    setTodo(value);
  }

  const addTodo = () => {
    firestore.collection("todos").add({
      todo: todo,
    })

    setTodo('');
  }

  let todoList = []

  if (todos != '') {
    todos.map((ob) => {
      todoList.push(<div style={{"display":'flex'}}>
        <li style={{ 'marginTop': '10px','width':'30%' }}>{ob.todos}</li>
        <DeleteIcon className='deleteIcon'/>
        <EditIcon className='deleteIcon'></EditIcon>
      </div>
        
      )
    })
  }

  return (
    <div className="container">
      <Grid container xs={12} spacing={2} >
        <Grid container xs={3} spacing={2} className="profileLeft">
          <div style={{ "marginLeft": '11px' }}>
            <img src={image} className="profileImage" />

            <div style={{ "display": 'flex', 'marginTop': '15px' }}>
              <div style={{ 'fontSize': '15px' }}>{displayName}</div>
            </div>

            <div style={{ "display": 'flex', 'marginTop': '10px' }}>
              <div style={{ 'fontSize': '15px' }}>{email}</div>
            </div>

            <Button className="submit" style={{ 'marginTop': '20px' }} onClick={() => { auth.signOut() }}>Sign out</Button>
          </div>
        </Grid>

        <Grid container xs={8} spacing={2} style={{ "marginLeft": '35px' }} className="profileLeft">
          <Grid item xs={12}>
            <p class="sign" >Todos</p>

            <TextField id="standard-basic"
              label="Write a Todo"
              name='displayName'
              style={{ 'marginLeft': '25px' }}
              value={todo}
              onChange={(event) => onChangeHandler(event)}
            />

            <Button className="submit" style={{ 'marginTop': '9px', 'marginLeft': '45px' }} onClick={addTodo}>Add Todo</Button>
            
            <ul>
              {todoList}
            </ul>

          </Grid>
        </Grid>
      </Grid>
    </div>
  )
};

export default ProfilePage;