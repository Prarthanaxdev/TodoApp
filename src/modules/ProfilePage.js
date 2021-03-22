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
  const [json, setJson] = useState([])

  useEffect(() => {
    axios.post(config.ip + '/setData', {
      uid: user.user.uid
    })
      .then(function (response) {
        getTodos();
      })

    window.addEventListener('beforeunload', (e) => {
      axios.post(config.ip + '/removeSession')
        .then(function (response) {
          console.log(response);
        })
    });
  }, [])

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
      setTodo('');
      setTitle('');
    } else {
      setError(true)
    }
  }

  let deleteItem = (id) => obj => {
    if (obj.id === id) {
      // let index = json.findIndex(x => x.id ===id);
      // console.log("HERE",json[0].name)
      delete obj.id
      delete obj.name
      delete obj.subtodos
      // obj.subtodos.splice(index)
      // obj.subtodos.push(text)
    }
    else if (obj.subtodos)
      return obj.subtodos.some(deleteItem(id));
  };

  const deleteTodo = (id) => {
    json.forEach(deleteItem(id));
    setJson(json)

    console.log("*****", json)
    // axios.post(config.ip + '/deleteTodo', {
    //   data: json,
    // })
    // .then(function (response) {
    //   console.log(response);
    //   getTodos()
    // })
  }

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
      axios.post(config.ip + '/updateTodo', {
        id: editId,
        title: editField,
        
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
    setEditSubTodo(false)
    setAddSubsub('')
    setEditField('');
    setSubtodoError(false)
    setSubsubTodo(false)
  }

  const updateSubTodo = () => {
    if (editField.length != 0) {
      axios.post(config.ip + '/updateSubTodo', {
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

    if (addsubSubtodo != '') {
      if (editField.length != 0) {
        axios.post(config.ip + '/updateSubsubTodo', {
          id: editId,
          title: editField,
          todoId: todoId,
          subTodoId: addsubSubtodo
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
  }

  const editTodo = (id, name) => {
    setEditTodo(true)
    setEditId(id)
    setEditField(name);
  }

  const addSubtodos = (id) => {
    setSubTodo(true)
    setClicked(true)
    setEditId(id)
    setTodo('');
    setTitle('');
  }

  const Todo = ({ data }) => {

    const subTodo = (data.subtodos || []).map((ob) => {
      return <Todo key={ob.id} data={ob} type="child" />;
    });

    return (<div style={{ paddingLeft: "10px" }}>
      <div style={{ display: "flex", 'marginTop': "-7px" }}>
        <li className="todoTitle" >{data.name}</li>
        <DeleteIcon className='deleteIcon' style={{ "marginLeft": "10px" }} onClick={() => deleteTodo(data.id)} />
        <EditIcon className='deleteIcon' style={{ "marginLeft": "8px" }} onClick={() => editTodo(data.id, data.name)}></EditIcon>
        <AddIcon onClick={() => addSubtodos(data.id)} style={{ "marginLeft": "8px", "color": "blue" }} className='deleteIcon' />
      </div>
      <div>{subTodo}</div>
    </div>
    );
  };

  let list = []
  let subTodos = []

  if (todos != '') {
    let name = ""

    list = json.map((ob) => {
      return <Grid container xs={3} spacing={2} className="todosDiv" style={{ "margin": '10px' }} >
        <div style={{ 'display': 'flex' }}>
          <Todo key={ob.id} data={ob} />
        </div>
      </Grid>
    });
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
          {list}
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

          {subdtodoError ? <div className='errorMessage' style={{ 'marginLeft': '-2px', 'marginTop': '14px' }}>Please enter a value</div> : ''}

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

          {subdtodoError ? <div className='errorMessage' style={{ 'marginLeft': '-2px', 'marginTop': '14px' }}>Please enter a value</div> : ''}

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

          {subdtodoError ? <div className='errorMessage' style={{ 'marginLeft': '-2px', 'marginTop': '14px' }}>Please enter a value</div> : ''}

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

