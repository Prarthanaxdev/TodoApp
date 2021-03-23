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
import { connect } from 'react-redux';

import "../css/App.css";
import image from '../css/logo192.png'
import config from "../config/config.json";

const ProfilePage = () => {
  const user = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState('')
  const [editTodoFlag, setEditTodo] = useState(false);
  const [subTodoFlag, setSubTodo] = useState(false);
  const [editId, setEditId] = useState('');
  const [editField, setEditField] = useState('');
  const [addSubtodo, setAddSub] = useState('');
  const [error, setError] = useState(false);
  const [subdtodoError, setSubtodoError] = useState(false);
  const [json, setJson] = useState([])

  useEffect(() => {
    setJson([])
    axios.post(config.ip + '/setData', {
      uid: user.user.uid
    })
    .then(function (response) {
      getTodos();
    })

    window.addEventListener('beforeunload', (e) => {
      setJson([])
      axios.post(config.ip + '/removeSession')
      .then(function (response) {
        console.log(response);
      })
    });
  }, [])

  /* Fetches Todos and SubTodos from redis cache */
  const getTodos = () => {
    let j = 0
    axios.get(config.ip + '/getData/' + user.user.uid)
    .then(function (response) {
      let items = []
      setJson([])
      response.data.map((doc) => {
        setJson(json => [...json, doc])
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
  }

  const onUpdateHandler = (event) => {
    const { name, value } = event.currentTarget;
    setEditField(value);
  }

  const onSubHandler = (event) => {
    const { name, value } = event.currentTarget;
    setAddSub(value);
  }

  const addTodo = () => {
    if (title.length != 0) {
      axios.post(config.ip + '/addNewTodo', {
        title: title,
        userId: user.user.uid
      })
      .then(function (response) {
        getTodos()
        console.log(response);
      })
      setError(false)
      setTitle('');
    } else {
      setError(true)
    }
  }

  let deleteItem = (id) => obj => {
    if (obj.id === id) {
      delete obj.id
      delete obj.name
      delete obj.subtodos
    }
    else if (obj.subtodos)
      return obj.subtodos.some(deleteItem(id));
  };

  const deleteTodo = (id) => {
    json.forEach(deleteItem(id));
    setJson(json)
    axios.post(config.ip + '/deleteTodo', {
      id: id,
    })
    .then(function (response) {
      getTodos()
    })
  }

  /* A recursive function to add multiple subtodos */
  let update = (id, text) => obj => {
    if (obj.id === id) {
      obj.subtodos.push(text)
    }
    else if (obj.subtodos)
      return obj.subtodos.some(update(id, text));
  };

  const addSub = () => {
    if (addSubtodo.length != 0) {
      const randomnumber = Math.floor(Math.random() * 100) + 1;
      let obj = {
        name: addSubtodo,
        id: randomnumber,
        subtodos: [],
      }

      json.forEach(update(editId, obj));
      setJson(json)
      axios.post(config.ip + '/addNewSubTodo', {
        data : json
      })
      .then(function (response) {
        getTodos()
      })
      setSubtodoError(true)
      handleClose()
      setAddSub('');
    } else {
      setSubtodoError(true)
    }
  }

  let updateItem = (id, text) => obj => {
    if (obj.id === id) {
      obj.name = text.name
    }
    else if (obj.subtodos)
      return obj.subtodos.some(updateItem(id, text));
  };

  const updateTodo = () => {
    if (editField.length != 0) {
      json.forEach(updateItem(editId, {'name': editField}));

      axios.post(config.ip + '/updateTodo', {
        data : json
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

  const handleClose = () => {
    setEditTodo(false)
    setSubTodo(false)
    setAddSub('');
    setEditField('');
    setSubtodoError(false)
  }

  const editTodo = (id, name) => {
    setEditTodo(true)
    setEditId(id)
    setEditField(name);
  }

  const addSubtodos = (id) => {
    setSubTodo(true)
    setEditId(id)
    setTitle('');
  }

  const Todo = ({ data }) => {
    const subTodo = (data.subtodos || []).map((ob) => {
      return <Todo key={ob.id} data={ob} type="child" />;
    });

    return (<div className="divContainer">
      <div>
        <li className="todoTitle" >{data.name}</li>
        <DeleteIcon className='deleteIcon' onClick={() => deleteTodo(data.id)} />
        <EditIcon className='editIcon' onClick={() => editTodo(data.id, data.name)}></EditIcon>
        <AddIcon className='addIcon' onClick={() => addSubtodos(data.id)} />
      </div>
      <div>{subTodo}</div>
    </div>
    );
  };

  /* Used to show the list of todos and subTodos */
  let list = []
  if (todos != '') {
    list = json.map((ob,i) => {
      return <Grid container key={i} xs={3} spacing={2} className="todosDiv" >
        <div>
          <Todo key={ob.id} data={ob} />
        </div>
      </Grid>
    });
  }

  return (
    <div className="container">
      <Grid container xs={12} spacing={2} className="profileLeft" >
        <Grid container xs={11} spacing={2}>
          <div className="divFlex">
            {user.user.emailVerified == true ?
              <img src={user.user.photoURL} className="profileImage" /> :
              <img src={image} className="profileImage" />}
            <div className="userDetails">
              <div className="spaceTop">
                <div>Display Name:- {user.user.displayName}</div>
              </div>
              <div className='emailDiv'>
                <div>Email Id:- {user.user.email}</div>
              </div>
            </div>
          </div>
        </Grid>

        <Grid container xs={1} spacing={2}  >
          <PowerSettingsNewIcon className="logout" title="Click here to signout" onClick={() => { signOutUser() }} />
        </Grid>
      </Grid>

      <Grid container xs={12} spacing={2} className="todoContainer">
        <Grid container xs={12} spacing={2} >
          <p className="addTodo">Add a Todo</p>
          <Grid container xs={3}>
            <TextField id="standard-basic"
              label="Todo Title"
              name='title'
              className='divTodo'
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
          {list}
        </Grid>
      </Grid>

      <Dialog open={editTodoFlag} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit Item</DialogTitle>
        <DialogContent>
          <TextField id="standard-basic"
            label="Todo Title"
            name='updateTodo'
            value={editField}
            style={{ "width": "80%" }}
            onChange={(event) => onUpdateHandler(event)}
          />

          {subdtodoError ? <div className='errorMessageTodo'>Please enter a value</div> : ''}

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

          {subdtodoError ? <div className='errorMessageSubTodo'>Please enter a value</div> : ''}

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
    </div>
  )
};

function mapStateToProps(state) {
  return {
    title: state.Todo,
  };
}

export default connect(mapStateToProps)(ProfilePage);

