import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import refreshAccessToken from "../utility/refreshAccessToken";
import Navbar from "../components/Navbar";
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
    <div className="bg-zinc-200 w-full h-full min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-grow items-center justify-center h-[36rem]">
        <form
          onSubmit={handleSubmit}
          className="grid grid-row-5 gap-6 max-w-md w-96 p-6 shadow-md rounded-lg h-[60%] bg-blue-100"
        >
          <h2 className="text-black font-bold text-3xl">Create Todo</h2>

          <div className="flex flex-col justify-center items-start">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              className="w-full p-3 rounded-lg outline-none"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col justify-center items-start">
            <label>Description:</label>
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
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
