import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import AddTransaction from './pages/addtransaction/AddTransaction';
import TransactionHistory from './pages/transactionhistory/TransactionHistory';
import Navbar from './components/navbar/Navbar';
import { getTransactions, addTransaction, deleteTransaction } from './api/api';
import './App.css';
import './index.css';

function App() {
  const [transactions, setTransactions] = useState([]);

  // Load from API
  const loadData = async () => {
    const res = await getTransactions();
    setTransactions(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Add transaction
  const handleAddTransaction = async (newTransaction) => {
    await addTransaction({
      ...newTransaction,
      amount: parseFloat(newTransaction.amount)
    });
    loadData(); // refresh
  };

  // Delete transaction
  const handleDelete = async (id) => {
    await deleteTransaction(id);
    loadData();
  };
  

  
  

  return (
    <Router>
      <div className="app-container">

        <Navbar />


        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={<Dashboard
                transactions={transactions}
                refreshData={loadData}
              />}
            />
            <Route
              path="/add-transaction"
              element={<AddTransaction onAddTransaction={handleAddTransaction} />}
            />
            <Route
              path="/transactions"
              element={
                <TransactionHistory
                  transactions={transactions}
                  onDelete={handleDelete}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </main>

      </div>
    </Router>

  );
}

export default App;