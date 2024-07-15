import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import refreshAccessToken from "../utility/refreshAccessToken";

export default function UpdateTodo() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTodo() {
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

          const todo = response.data.find((todo) => todo.id === parseInt(id));
          setTitle(todo.title);
          setDescription(todo.description);
          setCompleted(todo.completed);
        } catch (error) {
          console.error("Error fetching todos: " + error.message);
        }
      }
    }
    fetchTodo();
  }, [id]);

  const handleSubmit = async (e) => {
    const token = localStorage.getItem("token");

    if (token) {
      const { user_id } = jwtDecode(token);

      e.preventDefault();
      const tasksInfo = {
        title,
        description,
        completed,
        user: user_id,
      };
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/tasks/?pk=${id}`,
        tasksInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      navigate("/todos");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Todo</h2>
      <label>Title:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>Description:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label>
        Completed:
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
      </label>
      <button type="submit">Update</button>
    </form>
  );
}
