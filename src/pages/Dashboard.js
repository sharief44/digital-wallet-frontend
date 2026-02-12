import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [toUserId, setToUserId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const [transactions, setTransactions] = useState([]);

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // ---------- API CALLS ----------

  const fetchBalance = useCallback(() => {
    api
      .get(`/api/wallet/balance/${userId}`)
      .then((res) => setBalance(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  const fetchTransactions = useCallback(() => {
    api
      .get(`/api/wallet/transactions/${userId}`)
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  const addMoney = () => {
    setSuccessMsg("");
    setErrorMsg("");

    api
      .post(`/api/wallet/add?userId=${userId}&amount=${amount}`)
      .then(() => {
        setSuccessMsg("Money added successfully");
        setAmount("");
        fetchBalance();
        fetchTransactions();
      })
      .catch(() => {
        setErrorMsg("Failed to add money");
      });
  };

  const transferMoney = () => {
    setSuccessMsg("");
    setErrorMsg("");

    api
      .post(
        `/api/wallet/transfer?fromUserId=${userId}&toUserId=${toUserId}&amount=${transferAmount}`
      )
      .then(() => {
        setSuccessMsg("Transfer successful");
        setToUserId("");
        setTransferAmount("");
        fetchBalance();
        fetchTransactions();
      })
      .catch(() => {
        setErrorMsg("Transfer failed (check balance or user ID)");
      });
  };

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, [fetchBalance, fetchTransactions]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    navigate("/");
  };

  // ---------- UI ----------
  return (
  <div className="dashboard-wrapper">
    
    {/* NAVBAR */}
    <div className="navbar">
      <h2>💳 Digital Wallet</h2>
      <div className="nav-right">
        <span className="user-email">
          {localStorage.getItem("email")}
        </span>
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

      {/* ACTIONS SECTION */}
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
          <button onClick={addMoney}>Add Money</button>
        </div>

        {/* TRANSFER */}
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
          <button onClick={transferMoney}>Transfer</button>
        </div>

      </div>

      {/* TRANSACTIONS */}
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
            {transactions.map((tx) => (
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
            ))}
          </tbody>
        </table>
      </div>

    </div>
  </div>
);

}

export default Dashboard;
