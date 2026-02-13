import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./utils/PrivateRoute";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup/>}/>
        <Route
  path="/admin"
  element={
    localStorage.getItem("role") === "ROLE_ADMIN"
      ? <AdminDashboard />
      : <Navigate to="/dashboard" />
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
