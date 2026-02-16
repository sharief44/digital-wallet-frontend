import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Normal User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRole="ROLE_USER">
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="ROLE_ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
