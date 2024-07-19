import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = {
        username,
        email,
        password,
      };

      await axios.post("http://127.0.0.1:8000/api/users/", userInfo);

      navigate("/login", { state: { isRegistered: true } });
    } catch (error) {
      toast.error("Error registering user: " + error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.error("Registration failed", error.response.data);
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
        <div
          className={`flex flex-grow items-center justify-center h-[44rem] transition-opacity duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-blue-100 grid grid-rows-5 gap-6 max-w-md w-96 p-6 shadow-md rounded-lg h-[70%]"
          >
            <h2 className="text-4xl mt-6 text-neutral-950 font-semibold">
              Register
            </h2>

            <div className="flex flex-col justify-center items-start">
              <label className="text-base font-medium text-neutral-950">
                Username:
              </label>
              <input
                type="text"
                value={username}
                className="w-full p-3 rounded-md outline-none border border-gray-300 focus:border-blue-500"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="flex flex-col justify-center items-start">
              <label className="text-base font-medium text-neutral-950">
                Email:
              </label>
              <input
                type="email"
                value={email}
                className="w-full p-3 rounded-md outline-none border border-gray-300 focus:border-blue-500"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col justify-center items-start">
              <label className="text-base font-medium text-neutral-950">
                Password:
              </label>
              <input
                type="password"
                value={password}
                className="w-full p-3 rounded-md outline-none border border-gray-300 focus:border-blue-500"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="bg-blue-400 h-[70%] mt-4 rounded-lg hover:bg-blue-500 text-white font-bold"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
