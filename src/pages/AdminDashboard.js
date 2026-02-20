import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const loggedInEmail = localStorage.getItem("email");

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

  const deleteUser = async (userId, userEmail) => {

    if (userEmail === loggedInEmail) {
      alert("You cannot delete yourself!");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/admin/users/${userId}`);

      // Remove from UI
      setUsers(users.filter((u) => u.id !== userId));

      alert("User deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete user");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button
                      className="delete-btn"
                      disabled={u.role === "ROLE_ADMIN"}
                      onClick={() => deleteUser(u.id, u.email)}
                    >
                      Delete
                    </button>
                  </td>
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