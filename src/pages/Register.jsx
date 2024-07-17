import { useState } from "react";
import { useNavigate } from "react-router-dom";
import refreshAccessToken from "../utility/refreshAccessToken";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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

        const userInfo = {
          username,
          email,
          password,
        };

        await axios.post("http://127.0.0.1:8000/api/users/", userInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        navigate("/login", { state: { isRegistered: true } });
      }
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
      console.error("Registration failed", error.message);
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
      <div className="bg-neutral-100 w-full h-full">
        <Navbar />
        <div className="flex flex-grow items-center justify-center h-[44rem]">
          <form
            onSubmit={handleSubmit}
            className="bg-zinc-200 grid grid-rows-5 gap-6 max-w-md w-96 p-6 shadow-md rounded-lg h-[65%]"
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
                className="w-full p-2 rounded-md outline-none"
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
                className="w-full p-2 rounded-md outline-none"
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
                className="w-full p-2 rounded-md outline-none focus:border-blue-500"
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
