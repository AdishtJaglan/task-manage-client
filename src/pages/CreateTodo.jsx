import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function CreateTodo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
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
