import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import refreshAccessToken from "../utility/refreshAccessToken";
import Navbar from "../components/Navbar";

export default function Profile() {
  const [userData, setUserData] = useState([]);
  const [taskLength, setTaskLength] = useState(0);

  useEffect(() => {
    async function fetchUserData() {
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
            `http://127.0.0.1:8000/api/users/?pk=${user_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setUserData(response.data);
          setTaskLength(response.data.tasks ? response.data.tasks.length : 0);
        } catch (error) {
          console.error("Error fetching todos: " + error.message);
        }
      }
    }
    fetchUserData();
  }, []);

  return (
    <div className="bg-neutral-100 w-full h-full min-h-screen flex flex-col ">
      <Navbar />
      <div className="flex items-center justify-center flex-grow">
        <div className="bg-zinc-200 shadow-lg rounded-lg p-6 max-w-sm w-full text-center">
          <img
            src="/face-man-profile.svg"
            alt="User Profile"
            className="w-24 h-24 mx-auto rounded-full"
          />
          <h1 className="text-2xl font-bold mt-4 text-gray-800">
            {userData.username}
          </h1>
          <h3 className="text-md mt-2 text-gray-600">{userData.email}</h3>

          <p className="mt-2 text-gray-600">Todos created: {taskLength}</p>
          <div className="mt-4">
            <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
