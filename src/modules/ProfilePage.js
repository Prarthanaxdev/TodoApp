import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserProvider";
import { signOutUser } from "../config/firebase";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import { addTodos } from "./actions/action.js";
import { connect } from 'react-redux';

import store from '../store.js';
import "../css/App.css";
import image from '../css/logo192.png'
import config from "../config/config.json";


const ProfilePage = () => {
  const user = useContext(UserContext);

  const [todo, setTodo] = useState('');
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState('')
  const [editTodoFlag, setEditTodo] = useState(false);
  const [subTodoFlag, setSubTodo] = useState(false);
  const [editId, setEditId] = useState('');
  const [todoId, setTodoId] = useState('');
  const [editField, setEditField] = useState('');
  const [addSubtodo, setAddSub] = useState('');
  const [addsubSubtodo, setAddSubsub] = useState('');
  const [subtodo, setSubTodos] = useState([])
  const [clicked, setClicked] = useState(false);
  const [subTodoupdate, setEditSubTodo] = useState(false);
  const [error, setError] = useState(false);
  const [subSubTodoFlag, setSubsubTodo] = useState(false);
  const [subdtodoError, setSubtodoError] = useState(false);

  useEffect(() => {
    axios.post(config.ip+'/setData', {
      uid: user.user.uid
    })
    .then(function (response) {
      getTodos();
    })

    window.addEventListener('beforeunload', (e) => {
      axios.post(config.ip+'/removeSession')
      .then(function (response) {
        console.log(response);
      })
    });
  }, [])

  const getTodos = () => {
    let j = 0
    axios.get(config.ip+'/getData/' + user.user.uid)
    .then(function (response) {
      let items = []

      response.data.map((doc) => {
        doc.subtodos.forEach(function (doc1) {
          let x = {
            id: doc.id,
            subTodo: doc1.subTodo,
            subTodoId: doc1.subTodoId,
            subSubTodo : doc1.subsubTodo
          }
          items.push(x)
        })

        setSubTodos({ ...subtodo, items })
      })

      setTodos(
        response.data.map((doc) => ({
          id: doc.id,
          title: doc.title,
        }))
      )
    })
  }

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;
    if (name === 'title') {
      setTitle(value);
    }
    else if (name === 'todo') {
      setTodo(value);
    }
  }

  const onUpdateHandler = (event) => {
    const { name, value } = event.currentTarget;
    setEditField(value);
  }

  const onSubHandler = (event) => {
    const { name, value } = event.currentTarget;
    setAddSub(value);
  }

  const onsubSubHandler = (event) => {
    const { name, value } = event.currentTarget;
    setAddSubsub(value);
  }

  const addTodo = () => {
    if (title.length != 0) {
      const { dispatch } = store;
      dispatch(addTodos(title, user.user.uid))

      axios.post(config.ip+'/addNewTodo', {
        title: title,
        userId: user.user.uid
      })
      .then(function (response) {
        getTodos()
        console.log(response);
      })
      setError(false)
      setTodo('');
      setTitle('');
    } else {
      setError(true)
    }
  }

  const deleteTodo = (id) => {
    axios.post(config.ip+'/deleteTodo', {
      id: id,
    })
    .then(function (response) {
      console.log(response);
      getTodos()
    })
  }

  const deleteSubTodo = (Subtodoid, todoId) => {
    axios.post(config.ip+'/deleteSubTodo', {
      subTodoId: Subtodoid,
      todoId: todoId
    })
    .then(function (response) {
      console.log(response);
      getTodos()
    })
  }

  const addSubSub = () => {
    if (addsubSubtodo.length != 0) {
      axios.post(config.ip+'/addNewSubsubTodo', {
        subTodo: addsubSubtodo,
        todoId: todoId,
        subTodoId: editId
      })
      .then(function (response) {
        getTodos()
        console.log(response);
      })
      setSubtodoError(true)
      handleClose()
      setAddSubsub('')
    }
    else {
      setSubtodoError(true)
    }
  }

  const addSub = () => {
    if (addSubtodo.length != 0) {
      axios.post(config.ip+'/addNewSubTodo', {
        subTodo: addSubtodo,
        todoId: editId
      })
      .then(function (response) {
        getTodos()
        console.log(response);
      })
      setSubtodoError(true)
      handleClose()
      setAddSub('');
    } else {
      setSubtodoError(true)
    }
  }

  const updateTodo = () => {
    if (editField.length != 0) {
      axios.post(config.ip+'/updateTodo', {
        id: editId,
        title: editField
      })
      .then(function (response) {
        getTodos()
        console.log(response);
      })
      setSubtodoError(false)
      handleClose();
    } else {
      setSubtodoError(true)
    }
  }

  const updateSubTodo = () => {
    if (editField.length != 0) {
      axios.post(config.ip+'/updateSubTodo', {
        id: editId,
        title: editField,
        todoId: todoId
      })
      .then(function (response) {
        getTodos()
      })
      setSubtodoError(false)
      handleClose();
    } else {
      setSubtodoError(true)
    }
  }

  const editSubTodo = (id, todoId, name) => {
    setEditSubTodo(true);
    setEditId(id);
    setTodoId(todoId)
    setEditField(name);
  }

  const editTodo = (id, name) => {
    setEditTodo(true)
    setEditId(id)
    setEditField(name);
  }

  const handleClose = () => {
    setEditTodo(false)
    setSubTodo(false)
    setAddSub('');
    setEditSubTodo(false)
    setEditField('');
    setSubtodoError(false)
    setSubsubTodo(false)
  }

  const addSubtodos = (id) => {
    setSubTodo(true)
    setClicked(true)
    setEditId(id)
    setTodo('');
    setTitle('');
  }

  const addsubSubtodos = (id, todoId) => {
    setSubsubTodo(true)
    setEditId(id)
    setTodoId(todoId)
  }

  let todoList = []
  let subTodos = []

  if (todos != '') {
    let name = ""
    todos.map((ob, i) => {
      let list = []
      if (subtodo != '') {
        subtodo.items.map((obj) => {
          if (obj.id == ob.id) {
           
            list.push(<div>
              <div style={{ "display": 'flex' }}>
                <li style={{ 'marginTop': '7px', 'marginLeft': '14px', 'wordBreak': 'break-all' }}>{obj.subTodo}</li>
                <DeleteIcon className='editIcon' style={{ "marginLeft": "10px" }} onClick={() => deleteSubTodo(obj.subTodoId, ob.id)} />
                <EditIcon className='editIcon' style={{ "marginLeft": "8px" }} onClick={() => editSubTodo(obj.subTodoId, ob.id, obj.subTodo)}></EditIcon>
              </div>
              {obj.subSubTodo.length !=0 ?
              <li style={{ 'marginTop': '7px', 'marginLeft': '55px', 'wordBreak': 'break-all' }}>{obj.subSubTodo.sub1.name}</li>:''}
              <AddIcon onClick={() => addsubSubtodos(obj.subTodoId, ob.id)} className='addIcon' style={{ "marginLeft": '60px' }} />
            </div>)
          }
        })
      }

      todoList.push(<Grid container xs={3} spacing={2} className="todosDiv" style={{ "margin": '10px' }} >
        <div style={{ 'display': 'flex' }}>
          <p class="todoTitle" >{ob.title}</p>
          <DeleteIcon className='deleteIcon' style={{ "marginLeft": "10px" }} onClick={() => deleteTodo(ob.id)} />
          <EditIcon className='deleteIcon' style={{ "marginLeft": "8px" }} onClick={() => editTodo(ob.id, ob.title)}></EditIcon>
        </div>
        {list}
        <AddIcon onClick={() => addSubtodos(ob.id)} className='addIcon' />
      </Grid>)
    })
  }

  return (
    <div className="container">
      <Grid container xs={12} spacing={2} className="profileLeft" >
        <Grid container xs={11} spacing={2}>
          <div style={{ "marginLeft": '11px', 'display': "flex" }}>
            {user.user.emailVerified == true ?
              <img src={user.user.photoURL} className="profileImage" /> :
              <img src={image} className="profileImage" />}
            <div style={{ 'marginLeft': "20px" }}>
              <div style={{ 'marginTop': '23px' }}>
                <div style={{ 'fontSize': '15px' }}>Display Name:- {user.user.displayName}</div>
              </div>
              <div style={{ 'marginTop': '10px' }}>
                <div style={{ 'fontSize': '15px' }}>Email Id:- {user.user.email}</div>
              </div>
            </div>
          </div>
        </Grid>

        <Grid container xs={1} spacing={2}  >
          <PowerSettingsNewIcon className="logout" title="Click here to signout" onClick={() => { signOutUser() }} />
        </Grid>
      </Grid>

      <Grid container xs={12} spacing={2} className="todoContainer" style={{ "marginTop": "22px" }}>
        <Grid container xs={12} spacing={2} style={{ 'marginTop': '10px', 'marginLeft': "15px", 'marginBottom': '10px' }}>
          <p class="addTodo" style={{ "textAlign": "none", "marginLeft": "22px" }} >Add a Todo</p>
          <Grid container xs={3}>
            <TextField id="standard-basic"
              label="Todo Title"
              name='title'
              style={{ 'marginLeft': '25px', "width": "92%" }}
              value={title}
              onChange={(event) => onChangeHandler(event)}
            />
          </Grid>

          <Grid container xs={3} spacing={1} >
            <Button className="submit" style={{ 'marginTop': '14px', 'marginLeft': '45px', 'width': '25%', 'height': '45%' }} onClick={addTodo}>Add Todo</Button>
            {error == true ? <div className='errorMessage'>Please enter a value</div> : ''}
          </Grid>
        </Grid>

        <Grid container xs={12} spacing={2} >
          {todoList}
        </Grid>
      </Grid>

      <Dialog open={editTodoFlag} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit Title</DialogTitle>
        <DialogContent>
          <TextField id="standard-basic"
            label="Todo Title"
            name='updateTodo'
            value={editField}
            style={{ "width": "80%" }}
            onChange={(event) => onUpdateHandler(event)}
          />
          
          {subdtodoError ? <div className='errorMessage' style={{ 'marginLeft': '-2px', 'marginTop': '14px' }}>Please enter a value</div>: ''}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={updateTodo} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={subTodoupdate} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit Sub-Todo</DialogTitle>
        <DialogContent>
          <TextField id="standard-basic"
            label="Write a Todo"
            name='updateTodo'
            value={editField}
            style={{ "width": "80%" }}
            onChange={(event) => onUpdateHandler(event)}
          />

          {subdtodoError ? <div className='errorMessage' style={{ 'marginLeft': '-2px', 'marginTop': '14px' }}>Please enter a value</div>: ''}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={updateSubTodo} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={subTodoFlag} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Sub-Todo</DialogTitle>
        <DialogContent>
          <TextField id="standard-basic"
            label="Add a Sub-Todo"
            name='updateTodo'
            value={addSubtodo}
            style={{ "width": "80%" }}
            onChange={(event) => onSubHandler(event)}
          />

          {subdtodoError ? <div className='errorMessage' style={{ 'marginLeft': '-2px', 'marginTop': '14px' }}>Please enter a value</div>: ''}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={addSub} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={subSubTodoFlag} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Sub Sub-Todo</DialogTitle>
        <DialogContent>
          <TextField id="standard-basic"
            label="Add a Sub-Todo"
            name='updateTodo'
            value={addsubSubtodo}
            style={{ "width": "80%" }}
            onChange={(event) => onsubSubHandler(event)}
          />

          {subdtodoError ? <div className='errorMessage' style={{ 'marginLeft': '-2px', 'marginTop': '14px' }}>Please enter a value</div>: ''}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={addSubSub} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
};

function mapStateToProps(state) {
  return {
    title: state.Todo,
  };
}

export default connect(mapStateToProps)(ProfilePage);

