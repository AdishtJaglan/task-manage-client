import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import refreshAccessToken from "../utility/refreshAccessToken";
import axios from "axios";

export default function CreateTodo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      const { user_id } = jwtDecode(token);
      console.log(user_id);

      try {
        const todoBody = {
          title,
          description,
          completed,
          user: user_id,
        };
        await axios.post("http://127.0.0.1:8000/api/tasks/", todoBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        navigate("/todos");
      } catch (error) {
        console.error("Erro occured while creating todo: " + error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Todo</h2>
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
      <button type="submit">Create</button>
    </form>
  );
}
