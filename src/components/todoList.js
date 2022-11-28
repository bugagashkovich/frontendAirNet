import { useState } from "react";
import axios from "axios";

export default function TodoList({ day, owner, todoList, setTodoList }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const activeTodo = todoList.filter(
    (todo) =>
      todo.date.year === day.date.year &&
      todo.date.month === day.date.month &&
      todo.date.day === day.date.day
  );

  const list = activeTodo.map((todo, key) => {
    return (
      <div key={key}>
        <Todo todo={todo} changeState={changeState} deleteTodo={deleteTodo} />
      </div>
    );
  });

  //   Добавить задачу
  async function handleAdd(e) {
    e.preventDefault();
    let res = await axios.post("http://localhost:4000/todo", null, {
      params: {
        name: name,
        description: description,
        owner: owner,
        date: day.date.toMillis(),
      },
    });
    setName("");
    setDescription("");
    setTodoList([...todoList, res.data]);
  }

  // Сменить статус задачи
  async function changeState(todo) {
    if (todo.state == 1) {
      try {
        let res = await axios.put("http://localhost:4000/undo", null, {
          params: { id: todo.id },
        });
        let newArray = todoList.filter((todo) => res.data.id != todo.id);
        newArray = [...newArray, res.data];
        console.log(newArray);
        setTodoList(newArray);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        let res = await axios.put("http://localhost:4000/do", null, {
          params: { id: todo.id },
        });
        let newArray = todoList.filter((todo) => res.data.id != todo.id);
        newArray = [...newArray, res.data];
        console.log(newArray);
        setTodoList(newArray);
      } catch (error) {
        console.log(error);
      }
    }
  }

  // Удалить задачу
  async function deleteTodo(todo) {
    try {
      let res = axios.delete("http://localhost:4000/todo", {
        params: {
          id: todo.id,
        },
      });
      console.log(res.data);
      let newArray = todoList.filter((_todo) => _todo.id != todo.id);
      console.log(newArray);
      setTodoList(newArray);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div>Задачи на {day.date.toLocaleString()}</div>
      <div>{list}</div>
      <form
        className="form-group mb-3"
        onSubmit={(e) => {
          handleAdd(e);
        }}
      >
        <label>Добавьте новую задачу</label>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          type="text"
          className="form-control"
          placeholder="Название задачи"
        />
        <input
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          type="text"
          className="form-control"
          placeholder="Описание задачи"
        />
        <button type="submit" className="btn btn-primary">
          Добавить новую задачу
        </button>
      </form>
    </div>
  );
}

function Todo({ todo, changeState, deleteTodo }) {
  const style = todo.state === "0" ? "todo notDone" : "todo done";
  return (
    <div className={style}>
      <h5 onClick={() => changeState(todo)}>Название: {todo.name}</h5>
      <h6>Описание: {todo.description}</h6>
      <button className="btn btn-danger" onClick={() => deleteTodo(todo)}>
        Удалить
      </button>
    </div>
  );
}
