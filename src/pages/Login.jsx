import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "/spinner.gif";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.isRegistered) {
      toast.success("User registered successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.access);
      localStorage.setItem("rToken", response.data.refresh);

      navigate("/todos", { state: { isLoggedIn: true } });
    } catch (error) {
      toast.error("Error logging in: " + error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setLoading(false);
      console.error("Login failed", error);
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
      <div className="bg-blue-300 w-full h-full flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-blue-100 grid grid-rows-4 gap-6 max-w-md w-80 p-6 shadow-md rounded-md"
        >
          <h2 className="text-4xl font-semibold text-justify mt-6">Login</h2>

          <div className="w-full">
            <label className="block text-base font-medium mb-1">
              Username:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md outline-none focus:border-blue-500"
            />
          </div>

          <div className="w-full">
            <label className="block text-base font-medium mb-1">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md outline-none focus:border-blue-500"
            />
          </div>

          <div className="w-full place-self-start">
            <p>
              Dont have an account?{" "}
              <Link
                to="/register"
                className="text-blue-400 italic hover:text-blue-500 hover:underline"
              >
                Sign Up
              </Link>
            </p>

            <button
              type="submit"
              className="w-full h-[48px] py-2 bg-blue-200 text-white font-semibold rounded-md hover:bg-blue-500 flex justify-center items-center mt-2"
            >
              {loading ? (
                <img src={Spinner} alt="loading..." className="h-6 w-6" />
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
