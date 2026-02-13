import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");

  const [toUserId, setToUserId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const [transactions, setTransactions] = useState([]);

  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const navigate = useNavigate();

  // ---------- API CALLS ----------

  const fetchBalance = useCallback(() => {
    if (!userId) return;

    api
      .get(`/api/wallet/balance/${userId}`)
      .then((res) => setBalance(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  const fetchTransactions = useCallback(() => {
    if (!userId) return;

    api
      .get(`/api/wallet/transactions/${userId}`)
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  const addMoney = () => {
    if (!amount || amount <= 0) return;

    api
      .post(`/api/wallet/add?userId=${userId}&amount=${amount}`)
      .then(() => {
        setAmount("");
        fetchBalance();
        fetchTransactions();
      })
      .catch(() => {
        alert("Failed to add money");
      });
  };

  const transferMoney = () => {
    if (!toUserId || !transferAmount || transferAmount <= 0) return;

    api
      .post(
        `/api/wallet/transfer?fromUserId=${userId}&toUserId=${toUserId}&amount=${transferAmount}`
      )
      .then(() => {
        setToUserId("");
        setTransferAmount("");
        fetchBalance();
        fetchTransactions();
      })
      .catch(() => {
        alert("Transfer failed (check balance or user ID)");
      });
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    fetchBalance();
    fetchTransactions();
  }, [fetchBalance, fetchTransactions, userId, navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ---------- UI ----------

  return (
    <div className="dashboard-wrapper">

      {/* NAVBAR */}
      <div className="navbar">
        <h2>💳 Digital Wallet</h2>

        <div className="nav-right">
          <span className="user-email">{email}</span>

          {role === "ROLE_ADMIN" && (
            <button
              onClick={() => navigate("/admin")}
              className="admin-btn"
            >
              Admin Panel
            </button>
          )}

          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">

        {/* BALANCE CARD */}
        <div className="balance-card">
          <div>
            <p className="balance-label">Available Balance</p>
            <h1 className="balance-amount">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR"
              }).format(balance)}
            </h1>
          </div>
        </div>

        {/* ACTION SECTION */}
        <div className="actions-grid">

          {/* ADD MONEY */}
          <div className="action-card">
            <h3>Add Money</h3>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={addMoney}>
              Add Money
            </button>
          </div>

          {/* TRANSFER MONEY */}
          <div className="action-card">
            <h3>Transfer Money</h3>
            <input
              type="number"
              placeholder="To User ID"
              value={toUserId}
              onChange={(e) => setToUserId(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
            />
            <button onClick={transferMoney}>
              Transfer
            </button>
          </div>

        </div>

        {/* TRANSACTION HISTORY */}
        <div className="transaction-card">
          <h3>Recent Transactions</h3>

          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                    No transactions yet
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className={tx.type === "CREDIT" ? "credit" : "debit"}>
                      {tx.type}
                    </td>
                    <td>
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR"
                      }).format(tx.amount)}
                    </td>
                    <td>
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
