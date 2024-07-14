import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTodo } from "../services/api";

export default function CreateTodo() {
  const [title, setTite] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTodo({ title });
    navigate("/todos");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Todo</h2>

      <label>Title:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTite(e.target.value)}
      />
    </form>
  );
}
