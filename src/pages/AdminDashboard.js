import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();
  const loggedInEmail = localStorage.getItem("email");

  useEffect(() => {
    loadAdminData();
  }, []);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [users]);

  const loadAdminData = async () => {
    try {
      const statsRes = await api.get("/api/admin/dashboard");
      const usersRes = await api.get("/api/admin/users");

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setFilteredUsers(usersRes.data);
    } catch (error) {
      console.error("Admin load error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= SEARCH =================
  const handleSearch = (value) => {
    setSearchTerm(value);

    const filtered = users.filter((u) =>
      u.name.toLowerCase().includes(value.toLowerCase()) ||
      u.email.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  // ================= PAGINATION =================
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // ================= DELETE =================
  const openDeleteModal = (user) => {
    if (user.email === loggedInEmail) {
      alert("You cannot delete yourself!");
      return;
    }
    setSelectedUser(user);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/admin/users/${selectedUser.id}`);

      const updatedUsers = users.filter((u) => u.id !== selectedUser.id);

      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setShowModal(false);
    } catch (error) {
      console.error("Delete error:", error);
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
          <div className="stat-card"><h4>Total Users</h4><h2>{stats.totalUsers}</h2></div>
          <div className="stat-card"><h4>Total Admins</h4><h2>{stats.totalAdmins}</h2></div>
          <div className="stat-card"><h4>Total Wallets</h4><h2>{stats.totalWallets}</h2></div>
          <div className="stat-card"><h4>Total Transactions</h4><h2>{stats.totalTransactions}</h2></div>
          <div className="stat-card"><h4>Total Money</h4><h2>₹{stats.totalMoneyInSystem}</h2></div>
        </div>
      )}

      <div className="users-card">
        <h3>All Users</h3>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />

        {currentUsers.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <>
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
                {currentUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <button
                        className="delete-btn"
                        disabled={u.role === "ROLE_ADMIN"}
                        onClick={() => openDeleteModal(u)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? "active-page" : ""}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* CONFIRMATION MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete <b>{selectedUser.name}</b>?
            </p>
            <div className="modal-buttons">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button className="confirm-delete" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;
