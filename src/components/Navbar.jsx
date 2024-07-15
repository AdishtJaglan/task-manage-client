/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

export default function Navbar({ user }) {
  return (
    <nav className="bg-blue-500 flex justify-between items-center p-7">
      <h1 className="text-4xl font-black text-zinc-200">Tasks</h1>
      <div className="w-48 flex justify-evenly items-center text-zinc-200 font-bold text-xl">
        {user ? (
          `Hello, ${user}`
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
