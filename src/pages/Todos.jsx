import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";
import refreshAccessToken from "../utility/refreshAccessToken";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.isLoggedIn) {
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      navigate(".", {
        state: { ...location.state, isLoggedIn: false },
        replace: true,
      });
    } else if (location.state?.todoCreated) {
      toast.success("Task created successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      navigate(".", {
        state: { ...location.state, todoCreate: false },
        replace: true,
      });
    } else if (location.state?.isUpdated) {
      toast.success("Task updated successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      navigate(".", {
        state: { ...location.state, isUpdated: false },
        replace: true,
      });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    async function fetchTodos() {
      let token = localStorage.getItem("token");
      const rToken = localStorage.getItem("rToken");

      if (token) {
        const { exp, user_id } = jwtDecode(token);

        const currentTime = Date.now() / 1000;

        if (exp < currentTime) {
          try {
            token = await refreshAccessToken(rToken);
          } catch (error) {
            console.error("Unable to refresh token:", error.message);
            return;
          }
        }

        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/user_tasks/?pk=${user_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

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

        toast.success("Task deleted successfully.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTodos(todos.filter((todo) => todo.id !== id));
      } catch (error) {
        toast.error("Error deleting task: " + error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        console.error("Error deleting todo: " + error.message);
      }
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="bg-neutral-100 w-full h-full min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-grow items-start justify-center p-4">
          <div className="w-full max-w-5xl bg-white shadow-md rounded-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-4xl mb-4 font-bold">Todos</h2>
              <Link
                to="/todos/create"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
                Create Todo
              </Link>
            </div>
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-200">
                <tr className="divide-x divide-gray-300">
                  <th className="py-2 px-4 border border-gray-300">Title</th>
                  <th className="py-2 px-4 border border-gray-300">
                    Description
                  </th>
                  <th className="py-2 px-4 border border-gray-300">Status</th>
                  <th className="py-2 px-4 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {todos.map((todo) => (
                  <tr key={todo.id} className="divide-x divide-gray-300">
                    <td className="py-2 px-4 border border-gray-300">
                      {todo.title}
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      {todo.description}
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      {todo.completed ? "Completed" : "Not Completed"}
                    </td>
                    <td className="py-2 px-4 border border-gray-300 flex space-x-2 justify-evenly">
                      <Link
                        to={`/todos/update/${todo.id}`}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Update
                      </Link>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
