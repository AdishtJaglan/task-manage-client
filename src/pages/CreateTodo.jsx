import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTodo } from "../services/api";

export default function CreateTodo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTodo({ title, description, completed });
    navigate("/todos");
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
