/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Navbar() {
  const [username, setUserName] = useState("");
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rToken");
    navigate("/login");
  };

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
              className="w-12 h-12 rounded-full cursor-pointer"
              onClick={() => setDropdownVisibility(!dropdownVisibility)}
            />

            {dropdownVisibility && (
              <div className="translate-y-6">
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
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
