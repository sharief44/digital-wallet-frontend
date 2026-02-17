import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />   {/* ✅ Added this */}
        <Route path="/signup" element={<Signup />} />

        {/* User Dashboard (USER + ADMIN allowed) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Admin Dashboard (ADMIN only) */}
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="ROLE_ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Optional: Catch all unknown routes */}
        <Route path="*" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
