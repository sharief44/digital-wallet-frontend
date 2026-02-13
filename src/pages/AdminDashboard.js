import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    const res = await api.get("/api/admin/dashboard");
    setStats(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get("/api/admin/users");
    setUsers(res.data);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-wrapper">

      <div className="admin-navbar">
        <h2>Admin Dashboard</h2>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Users</h4>
            <h2>{stats.totalUsers}</h2>
          </div>
          <div className="stat-card">
            <h4>Total Admins</h4>
            <h2>{stats.totalAdmins}</h2>
          </div>
          <div className="stat-card">
            <h4>Total Transactions</h4>
            <h2>{stats.totalTransactions}</h2>
          </div>
          <div className="stat-card">
            <h4>Total Money</h4>
            <h2>₹{stats.totalMoneyInSystem}</h2>
          </div>
        </div>
      )}

      <div className="users-card">
        <h3>All Users</h3>

        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default AdminDashboard;
