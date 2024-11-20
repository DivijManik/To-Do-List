import './App.css';
import { useEffect, useState } from 'react'

// IMAGES
import DeleteImg from './Images/Delete.svg';

// API url ->
const API_URL = 'http://localhost:3001/todos';

function App() {

  // To do list data
  const [todoData, setTodoData] = useState([]);

  // Fetch to do list data
  useEffect(() => {
    GetToDoList({ setTodoData });
  }, []);

  // HTML
  return (
    <div className="App">

      <h1>Hello 👋</h1>

      <div className='ToDoParent'>
        <h3 className='ToDoText'>Your To-Do list</h3>
        {
          // Show to do list
          todoData.map((todo_) =>
            (<ToDo data={todo_} setTodoData={setTodoData} />))
        }

        <h3 className='ToDoText'>Add new task to your list</h3>
        {/* Post new To Do */}
        <CreateToDo setTodoData={setTodoData} />
      </div>

    </div>
  );
}

// To do HTML - Check/Uncheck, Delete
function ToDo({ data, setTodoData }) {
  return (
    <div className='Todo'>
      <input type='checkbox' defaultChecked={data.todo.done === true ? true : false} onChange={(e) => EditToDo(data._id, e.target.checked, data.todo.desc)} className='Todo_Done'></input>
      <h3 className='Todo_Title'>{data.todo.desc}</h3>
      <button className='DeleteTodo' onClick={() => DeleteToDo({ setTodoData }, data._id)} > <img src={DeleteImg}></img> </button>
    </div>
  )
}

// Post new ToDo
function CreateToDo({ setTodoData }) {
  const [todoDesc, setTodoDesc] = useState("");
  const [todoDone, setTodoDone] = useState(false);

  // Post btn click function
  async function OnClickPost() {
    if (todoDesc === null || todoDesc === "")
      return;

    // Post Api
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "todo": {
          "done": todoDone,
          "desc": todoDesc
        }
      })
    })

    // Make input fields empty
    setTodoDesc("")
    setTodoDone(false)

    // get list again
    GetToDoList({ setTodoData });
  }

  // HTML - for posting new To-Do
  return (
    <div className='CreateTodo'>
      <input type='checkbox' className='CreateTodo_Done' checked={todoDone} onChange={(e) => { setTodoDone(e.target.checked) }}></input>
      <input placeholder='Write ToDo' className='CreateTodo_Desc' maxLength={100} value={todoDesc} onChange={(e) => { setTodoDesc(e.target.value) }}></input>

      <button className='PostBtn' onClick={() => OnClickPost()}>POST</button>
    </div>
  )
}

// ----------------------  API ----------------------

// Get To Do list
async function GetToDoList({ setTodoData }) {

  const response = await fetch(API_URL);
  const data = await response.json();

  setTodoData(data);
}

// Edit Todo - check/ Uncheck
function EditToDo(id, todoDone, todoDesc) {

  // Put Api
  fetch(API_URL + "?id=" + id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "todo": {
        "done": todoDone,
        "desc": todoDesc
      }
    })
  })
}

// Delete ToDo using id
async function DeleteToDo({ setTodoData }, id) {

  // Delete Api
  await fetch(API_URL + "?id=" + id, {
    method: 'DELETE'
  })

  // Get list again
  GetToDoList({ setTodoData });
}

export default App;

// End










// Unused code

// Alternate way of calling function
// const fetchData = async () => {
//   const response = await fetch(API_URL);
//   const data = await response.json();

//   setTodoData(data);
// }