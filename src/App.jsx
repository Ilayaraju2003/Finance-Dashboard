import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/dashboard/Dashboard";
import AddTransaction from "./pages/addtransaction/AddTransaction";
import TransactionHistory from "./pages/transactionhistory/TransactionHistory";
import Navbar from "./components/navbar/Navbar";

import "./App.css";
import "./index.css";

// ✅ DEFAULT DATA
const defaultTransactions = [
  { id: 1, title: "Salary", type: "income", amount: 5000, category: "Salary", date: "2026-03-01" },
  { id: 2, title: "Food", type: "expense", amount: 1200, category: "Food", date: "2026-03-02" },
  { id: 3, title: "Electric Bill", type: "expense", amount: 1800, category: "Bills", date: "2026-03-03" },
  { id: 4, title: "Freelance Work", type: "income", amount: 12000, category: "Freelance", date: "2026-03-04" },
  { id: 5, title: "Petrol", type: "expense", amount: 1500, category: "Transport", date: "2026-02-05" },
  { id: 6, title: "Movie", type: "expense", amount: 600, category: "Entertainment", date: "2026-02-06" },
  { id: 7, title: "Restaurant", type: "expense", amount: 1200, category: "Food", date: "2026-02-07" },
  { id: 8, title: "Bonus", type: "income", amount: 8000, category: "Job", date: "2026-02-08" },
  { id: 9, title: "Mobile Recharge", type: "expense", amount: 399, category: "Bills", date: "2026-02-09" },
  { id: 10, title: "Gym Fee", type: "expense", amount: 2000, category: "Health", date: "2026-01-10" },
  { "id": 11, "title": "Stock Profit", "amount": 7000, "type": "income", "category": "Investment", "date": "11/04/2026" },
    { "id": 12, "title": "Shopping", "amount": 3500, "type": "expense", "category": "Lifestyle", "date": "12/04/2026" },
    { "id": 13, "title": "Bus Ticket", "amount": 150, "type": "expense", "category": "Transport", "date": "13/04/2026" },
    { "id": 14, "title": "Gift Received", "amount": 2000, "type": "income", "category": "Other", "date": "14/04/2026" },
    { "id": 15, "title": "Water Bill", "amount": 800, "type": "expense", "category": "Bills", "date": "15/04/2026" },
    { "id": 16, "title": "Online Course", "amount": 2500, "type": "expense", "category": "Education", "date": "16/04/2026" },
    { "id": 17, "title": "Dividends", "amount": 3000, "type": "income", "category": "Investment", "date": "17/04/2026" },
    { "id": 18, "title": "Snacks", "amount": 200, "type": "expense", "category": "Food", "date": "18/04/2026" },
    { "id": 19, "title": "Uber Ride", "amount": 450, "type": "expense", "category": "Transport", "date": "19/04/2026" },
    { "id": 20, "title": "Laptop Repair", "amount": 2200, "type": "expense", "category": "Maintenance", "date": "20/04/2026" }
];

//  APP
function App() {
  const [role, setRole] = useState("admin");
  const [transactions, setTransactions] = useState([]);

  // LOAD DATA
  useEffect(() => {
    try {
      const saved = localStorage.getItem("transactions");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (parsed.length > 0) {
          setTransactions(parsed);
        } else {
          setTransactions(defaultTransactions);
        }
      } else {
        setTransactions(defaultTransactions);
      }
    } catch (error) {
      console.error("Load error:", error);
      setTransactions(defaultTransactions);
    }
  }, []);

  // SAVE DATA
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  //  ADD
  const handleAddTransaction = (tx) => {
    if (role !== "admin") return;

    const newTx = {
      ...tx,
      id: Date.now(),
      amount: parseFloat(tx.amount),
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  //  DELETE
  const handleDelete = (id) => {
    if (role !== "admin") return;
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  //  EDIT
  const handleEditTransaction = (updatedTx) => {
    if (role !== "admin") return;

    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === updatedTx.id ? updatedTx : tx
      )
    );
  };

  return (
    <Router>
      <div className="app-container">

        {/*  Navbar with role */}
        <Navbar role={role} setRole={setRole} />

        <main className="main-content">
          <Routes>

            {/*  Dashboard */}
            <Route
              path="/"
              element={
                <Dashboard
                  transactions={transactions}
                  onDeleteTransaction={handleDelete}
                  role={role}
                />
              }
            />

            {/*  Add / Edit (Protected) */}
            <Route
              path="/add-transaction"
              element={
                role === "admin" ? (
                  <AddTransaction
                    onAddTransaction={handleAddTransaction}
                    onEditTransaction={handleEditTransaction}
                  />
                ) : (
                  <h2 style={{ textAlign: "center" }}>Access Denied 🚫</h2>
                )
              }
            />

            {/*  Transactions */}
            <Route
              path="/transactions"
              element={
                <TransactionHistory
                  transactions={transactions}
                  onDelete={handleDelete}
                  role={role}
                />
              }
            />

            {/*  Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;