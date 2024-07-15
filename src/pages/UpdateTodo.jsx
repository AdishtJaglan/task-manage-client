import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import refreshAccessToken from "../utility/refreshAccessToken";
import Navbar from "../components/Navbar";

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
    <div className="bg-zinc-200 w-full h-full min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-grow items-center justify-center h-[36rem]">
        <form
          onSubmit={handleSubmit}
          className="grid grid-row-5 gap-6 max-w-md w-96 p-6 shadow-md rounded-lg h-[60%] bg-blue-100"
        >
          <h2 className="text-black font-bold text-3xl">Update Todo</h2>

          <div className="flex flex-col justify-center items-start">
            <label className="text-lg font-semibold">Title:</label>
            <input
              type="text"
              value={title}
              className="w-full p-3 rounded-lg outline-none"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col justify-center items-start">
            <label className="text-lg font-semibold">Description:</label>
            <textarea
              value={description}
              className="w-full p-3 rounded-lg outline-none"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={completed}
              className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
              onChange={(e) => setCompleted(e.target.checked)}
            />
            <label className="ml-2 text-lg font-medium">Completed</label>
          </div>

          <button
            type="submit"
            className="bg-blue-300 h-full p-3 rounded-lg hover:bg-blue-400 text-white font-bold"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}
