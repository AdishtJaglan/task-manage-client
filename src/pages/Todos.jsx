import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTodos, deleteTodo } from "../services/api";

export default function Todos() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function fetchTodos() {
      const response = await getTodos();
      setTodos(response.data);
    }
    fetchTodos();
  }, []);

  const handleDelete = async (id) => {
    await deleteTodo(id);
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
