/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Navbar() {
  const [username, setUserName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const { user_id } = jwtDecode(token);

        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/users/?pk=${user_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setUserName(response.data.username);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <nav className="bg-blue-500 flex justify-between items-center p-7 shadow-md">
      <h1 className="text-4xl font-black text-gray-800">Tasks</h1>
      <div className="w-48 flex justify-evenly items-center text-gray-800-200 font-bold text-xl">
        {username ? (
          <>
            <span className="text-gray-800">Hello, {username}</span>
            <img
              src="/user-icon.png"
              alt="User Icon"
              className="w-12 h-12 rounded-full"
            />
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
