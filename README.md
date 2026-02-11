# 💻 Digital Wallet Frontend (React + Axios + JWT)

Frontend application for the Digital Wallet system built using React.js.

This app connects to the Spring Boot backend using JWT authentication.

---

## 🚀 Features

- ✅ User Registration
- ✅ User Login
- ✅ JWT Token Handling
- ✅ Add Money
- ✅ Transfer Money
- ✅ View Wallet Balance
- ✅ Transaction History
- ✅ Protected Routes
- ✅ Clean UI with CSS

---

## 🛠 Tech Stack

- **Frontend:** React.js
- **HTTP Client:** Axios
- **Authentication:** JWT (stored in localStorage)
- **Routing:** React Router
- **Styling:** CSS

---

## 📂 Project Structure

```
src/
│
├── api/
│   └── axios.js
│
├── components/
│   ├── Login.js
│   ├── Register.js
│   ├── Dashboard.js
│   ├── PrivateRoutes.js
│
├── styles/
│   ├── Login.css
│   ├── Dashboard.css
│
└── App.js
```

---

## 🔐 Authentication Flow

1. User logs in
2. Backend returns JWT + userId
3. Token stored in localStorage
4. Axios automatically attaches:

```
Authorization: Bearer <token>
```

5. Protected routes require valid token

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/sharief44/digital-wallet-frontend.git
cd digital-wallet-frontend
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Configure Backend URL

Inside:

```
src/api/axios.js
```

Make sure baseURL matches backend:

```javascript
baseURL: "http://localhost:8080",
```

---

### 4️⃣ Start Application

```bash
npm start
```

App runs on:

```
http://localhost:3000
```

---

## 🔌 Backend Connection

Make sure backend is running:

```
http://localhost:8080
```

---

## 📦 API Used

| Action | Endpoint |
|--------|----------|
| Register | POST `/api/users/register` |
| Login | POST `/api/users/login` |
| Add Money | POST `/api/wallet/add` |
| Balance | GET `/api/wallet/balance/{userId}` |
| Transfer | POST `/api/wallet/transfer` |
| Transactions | GET `/api/wallet/transactions/{userId}` |

---

## 📈 Future Improvements

- Better UI Design
- Toast Notifications
- Loading Spinners
- Error Handling UI
- Dark Mode
- Deployment to Vercel / Netlify

---

## 👨‍💻 Author

Sharief Sk  
Full Stack Java Developer  

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
