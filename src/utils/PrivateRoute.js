import { Navigate } from "react-router-dom";

function PrivateRoute({ children, requiredRole }) {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default PrivateRoute;
