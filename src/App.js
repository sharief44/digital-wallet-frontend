import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./utils/PrivateRoute";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            role === "ROLE_ADMIN"
              ? <AdminDashboard />
              : <Navigate to="/dashboard" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
