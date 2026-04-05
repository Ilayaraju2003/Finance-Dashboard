import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './pages/dashboard/Dashboard';
import AddTransaction from './pages/addtransaction/AddTransaction';
import TransactionHistory from './pages/transactionhistory/TransactionHistory';
import Navbar from './components/navbar/Navbar';

import './App.css';
import './index.css';

// ✅ Default Data
const defaultTransactions = [
  {
    id: 1,
    title: "Salary",
    type: "income",
    amount: 5000,
    category: "Salary",
    date: "2026-04-01",
  },
  {
    id: 2,
    title: "Food",
    type: "expense",
    amount: 1200,
    category: "Food",
    date: "2026-04-02",
  },{ "id": 3, "title": "Electric Bill", "amount": 1800, "type": "expense", "category": "Bills", "date": "03/04/2026" },
    { "id": 4, "title": "Freelance Work", "amount": 12000, "type": "income", "category": "Freelance", "date": "04/04/2026" },
    { "id": 5, "title": "Petrol", "amount": 1500, "type": "expense", "category": "Transport", "date": "05/04/2026" },
    { "id": 6, "title": "Movie", "amount": 600, "type": "expense", "category": "Entertainment", "date": "06/04/2026" },
    { "id": 7, "title": "Restaurant", "amount": 1200, "type": "expense", "category": "Food", "date": "07/04/2026" },
    { "id": 8, "title": "Bonus", "amount": 8000, "type": "income", "category": "Job", "date": "08/04/2026" },
    { "id": 9, "title": "Mobile Recharge", "amount": 399, "type": "expense", "category": "Bills", "date": "09/04/2026" },
    { "id": 10, "title": "Gym Fee", "amount": 2000, "type": "expense", "category": "Health", "date": "10/04/2026" },
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

function App() {
  const [transactions, setTransactions] = useState([]);

  // ✅ LOAD from localStorage (only once)
 useEffect(() => {
  try {
    const saved = localStorage.getItem("transactions");

    if (saved) {
      const parsed = JSON.parse(saved);

      // ✅ FIX: check if empty
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

  // ✅ SAVE to localStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // ✅ ADD
  const handleAddTransaction = (newTransaction) => {
    const newTx = {
      ...newTransaction,
      id: Date.now(),
      amount: parseFloat(newTransaction.amount),
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  // ✅ DELETE
  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter(tx => tx.id !== id));
  };

  // ✅ EDIT
  const handleEditTransaction = (updatedTransaction) => {
    setTransactions((prev) =>
      prev.map(tx =>
        tx.id === updatedTransaction.id ? updatedTransaction : tx
      )
    );
  };

  return (
    <Router>
      <div className="app-container">

        <Navbar />

        <main className="main-content">
          <Routes>

            {/* Dashboard */}
            <Route
              path="/"
              element={
                <Dashboard
                  transactions={transactions}
                  onDeleteTransaction={handleDelete}
                />
              }
            />

            {/* Add / Edit */}
            <Route
              path="/add-transaction"
              element={
                <AddTransaction
                  onAddTransaction={handleAddTransaction}
                  onEditTransaction={handleEditTransaction}
                />
              }
            />

            {/* History */}
            <Route
              path="/transactions"
              element={
                <TransactionHistory
                  transactions={transactions}
                  onDelete={handleDelete}
                />
              }
            />

            {/* Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;