import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Todos() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function fetchTodos() {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/tasks/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTodos(response.data);
    }
    fetchTodos();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `http://127.0.0.1:8000/api/tasks/?pk=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <h2>Todos</h2>
      <Link to="/todos/create">Create Todo</Link>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <p>{todo.completed ? "Completed" : "Not Completed"}</p>
            <Link to={`/todos/update/${todo.id}`}>Update</Link>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
