import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserProvider";
import { auth, firestore, signOutUser } from "../firebase";
import Grid from '@material-ui/core/Grid';
import "../App.css";
import image from './logo192.png'
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

const ProfilePage = () => {
  const user = useContext(UserContext);
  const [todo, setTodo] = useState('');
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState('')
  const [editTodoFlag, setEditTodo] = useState(false);
  const [subTodoFlag, setSubTodo] = useState(false);
  const [editId, setEditId] = useState('');
  const [editField, setEditField] = useState('');
  const [addSubtodo, setAddSub] = useState('');
  const [subtodo, setSubTodos] = useState([])
  const [clicked, setClicked] = useState(false);
  const [subTodoupdate, setEditSubTodo] = useState(false);

  useEffect(() => {
    let todoObj = []

    firestore.collection("todos").where('userId', '==', user.user.uid).get().then((doc) => {
      doc.forEach(function (doc) {
        let x = {
          title: doc.data().title,
          id: doc.id,
          uid: user.user.uid
        }
        todoObj.push(x);
      })
      axios.post('http://localhost:5000/setData', {
        todoObj
      })
      .then(function (response) {
        getTodos();       
      })

      let items = []

      doc.forEach(function (doc) {
        firestore.collection("subTodos").where('todoId', '==', doc.id).get().then((doc1) => {

          doc1.forEach(function (doc2) {
            let x = {
              subTodo: doc2.data().todo,
              subTodoId: doc2.id,
              id: doc2.data().todoId
            }
            items.push(x);
          })

          axios.post('http://localhost:5000/setSubtodo', {
            items
          })
          .then(function (response) {
            getTodos();       
          })
        })
      })
    })


    // window.onbeforeunload = function(e) {
    //   axios.post('http://localhost:5000/removeSession')
    //   .then(function (response) {
    //     console.log(response);
    //   })
    // };

  }, [])

  const getTodos = () => {
    axios.get('http://localhost:5000/getData/' + user.user.uid)
      .then(function (response) {
        console.log("response", response.data);
        setTodos(
          response.data.map((doc) => ({
            id: doc.id,
            title: doc.title,
          }))
        )

        let items = []

        response.data.map((doc) => {
          axios.get('http://localhost:5000/getSubtodos/' + doc.id)
          .then(function (response) {
            response.data.forEach(function (doc) {
              let x = {
                id: doc.id,
                subTodo: doc.subTodo,
                subTodoId: doc.subTodoId
              }
              items.push(x)
            })
            setSubTodos({ ...subtodo, items })
          })
        })
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
    axios.post('http://localhost:5000/addNewTodo', {
      title: title,
      userId: user.user.uid
    })
    .then(function (response) {
      getTodos()
      console.log(response);
    })

    setTodo('');
    setTitle('');
  }

  const deleteTodo = (id) => {
    axios.post('http://localhost:5000/deleteTodo', {
      id: id,
    })
    .then(function (response) {
      console.log(response);
      getTodos()
    })
  }

  const deleteSubTodo = (id) => {

    console.log("&&&&&&&&", id)
    axios.post('http://localhost:5000/deleteSubTodo', {
      id: id,
    })
    .then(function (response) {
      console.log(response);
      getTodos()
    })
  }

  const addSub = () => {
    axios.post('http://localhost:5000/addNewSubTodo', {
      subTodo : addSubtodo,
      todoId : editId
    })
    .then(function (response) {
      getTodos()
      console.log(response);
    })

    handleClose()
    setAddSub('');
  }

  const updateTodo = () => {
    axios.post('http://localhost:5000/updateTodo', {
      id : editId,
      title : editField
    })
    .then(function (response) {
      getTodos()
      console.log(response);
    })
    handleClose();
  }

  const editSubTodo = (id, name) => {
    setEditSubTodo(true)
    setEditId(id)
    setEditField(name);
  }

  const editTodo = (id, name) => {
    setEditTodo(true)
    setEditId(id)
    setEditField(name);
  }

  const updateSubTodo = () => {
    firestore.collection("subTodos").doc(editId).update({
      todo: editField
    });
    getTodos()
    handleClose();
  }

  const handleClose = () => {
    setEditTodo(false)
    setSubTodo(false)
    setAddSub('');
    setEditSubTodo(false)
  }

  const addSubtodos = (id) => {
    setSubTodo(true)
    setClicked(true)

    setEditId(id)
    setTodo('');
    setTitle('');
  }

  let todoList = []
  let subTodos = {}

  if (todos != '') {
    let name = ""
    todos.map((ob, i) => {
      let list = []

      if (subtodo != '') {
        subtodo.items.map((obj) => {
          if (obj.id == ob.id) {
            list.push(<div style={{ "display": 'flex' }}>
              <li style={{ 'marginTop': '7px', 'marginLeft': '14px', 'wordBreak': 'break-all' }}>{obj.subTodo}</li>
              <DeleteIcon className='editIcon' style={{ "marginLeft": "10px" }} onClick={() => deleteSubTodo(obj.subTodoId)} />
              <EditIcon className='editIcon' style={{ "marginLeft": "8px" }} onClick={() => editSubTodo(obj.subTodoId, obj.subTodo)}></EditIcon>
            </div>
            )
          }
        })
      }

      // let id = 0

      // if (ob.id != undefined) {
      //   id = ob.id
      // } else {
      //   id = i
      // }

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
        <DialogTitle id="form-dialog-title">Edit Todo</DialogTitle>
        <DialogContent>
          <TextField id="standard-basic"
            label="Write a Todo"
            name='updateTodo'
            value={editField}
            style={{ "width": "80%" }}
            onChange={(event) => onUpdateHandler(event)}
          />

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

export default ProfilePage;