// src/pages/UpdateTodo.js
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTodos, updateTodo } from "../services/api";

function UpdateTodo() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTodo() {
      const response = await getTodos(id);
      setTitle(response.data.title);
    }
    fetchTodo();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateTodo(id, { title });
    navigate("/todos");
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
      <button type="submit">Update</button>
    </form>
  );
}

export default UpdateTodo;
