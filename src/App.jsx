import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Todos from "./pages/Todos";
import CreateTodo from "./pages/CreateTodo";
import UpdateTodo from "./pages/UpdateTodo";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/todos"
          element={
            <PrivateRoute>
              <Todos />
            </PrivateRoute>
          }
        />
        <Route
          path="/todos/create"
          element={
            <PrivateRoute>
              <CreateTodo />
            </PrivateRoute>
          }
        />
        <Route
          path="/todos/update/:id"
          element={
            <PrivateRoute>
              <UpdateTodo />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
