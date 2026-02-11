import { useEffect, useState } from "react";
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
  const fetchBalance = () => {
    api
      .get(`/api/wallet/balance/${userId}`)
      .then((res) => setBalance(res.data))
      .catch((err) => console.error(err));
  };

  const fetchTransactions = () => {
    api
      .get(`/api/wallet/transactions/${userId}`)
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error(err));
  };

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
  }, []);


  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("email");

  navigate("/");
};

  // ---------- UI ----------
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Digital Wallet Dashboard</h2>
      {successMsg && <div className="alert success">{successMsg}</div>}
{errorMsg && <div className="alert error">{errorMsg}</div>}

       
      {/* Wallet Balance */}
      <div className="card">
        <h3>Wallet Balance</h3>
        <p className="balance">₹ {balance}</p>
      </div>

      {/* Add Money */}
      <div className="card">
        <h3>Add Money</h3>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input"
        />
        <button onClick={addMoney} className="button">
          Add Money
        </button>
      </div>

      {/* Transfer Money */}
      <div className="card">
        <h3>Transfer Money</h3>
        <input
          type="number"
          placeholder="To User ID"
          value={toUserId}
          onChange={(e) => setToUserId(e.target.value)}
          className="input"
        />
        <input
          type="number"
          placeholder="Amount"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          className="input"
        />
        <button onClick={transferMoney} className="button">
          Transfer
        </button>
      </div>

      {/* Transaction History */}
      <div className="card">
        <h3>Transaction History</h3>
        <ul className="tx-list">
          {transactions.map((tx) => (
            <li key={tx.id} className="tx-item">
              <span
                className={
                  tx.type === "CREDIT" ? "tx-credit" : "tx-debit"
                }
              >
                {tx.type}
              </span>
              <span>₹ {tx.amount}</span>
              <small>{tx.timestamp}</small>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
  <button onClick={logout} className="button">
    Logout
  </button>
</div>

    </div>
  );
}

export default Dashboard;
