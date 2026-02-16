import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const statsRes = await api.get("/api/admin/dashboard");
      const usersRes = await api.get("/api/admin/users");

      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Admin load error:", error);
      alert("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return <div className="admin-wrapper">Loading...</div>;
  }

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
            <h4>Total Wallets</h4>
            <h2>{stats.totalWallets}</h2>
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

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
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
        )}
      </div>

    </div>
  );
}

export default AdminDashboard;
