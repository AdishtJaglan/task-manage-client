import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";
import refreshAccessToken from "../utility/refreshAccessToken";
import axios from "axios";

export default function Todos() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function fetchTodos() {
      let token = localStorage.getItem("token");
      const rToken = localStorage.getItem("rToken");

      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          try {
            token = await refreshAccessToken(rToken);
          } catch (error) {
            console.error("Unable to refresh token:", error.message);
            return;
          }
        }

        try {
          const response = await axios.get("http://127.0.0.1:8000/api/tasks/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setTodos(response.data);
        } catch (error) {
          console.error("Error fetching todos: " + error.message);
        }
      }
    }
    fetchTodos();
  }, []);

  const handleDelete = async (id) => {
    let token = localStorage.getItem("token");
    const rToken = localStorage.getItem("rItem");

    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        try {
          token = await refreshAccessToken(rToken);
        } catch (error) {
          console.error("Unable to refresh token:", error.message);
          return;
        }
      }

      try {
        await axios.delete(`http://127.0.0.1:8000/api/tasks/?pk=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTodos(todos.filter((todo) => todo.id !== id));
      } catch (error) {
        console.error("Error deleting todo: " + error.message);
      }
    }
  };

  return (
    <div className="bg-zinc-200 w-full h-full">
      <Navbar />
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
