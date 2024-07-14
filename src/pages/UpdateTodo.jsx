import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTodos, updateTodo } from "../services/api";

export default function UpdateTodo() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTodo() {
      const response = await getTodos();
      const todo = response.data.find((todo) => todo.id === parseInt(id));
      setTitle(todo.title);
      setDescription(todo.description);
      setCompleted(todo.completed);
    }
    fetchTodo();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateTodo(id, { title, description, completed });
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
