import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaWallet } from 'react-icons/fa';
import SummaryCard from '../../components/card/SummaryCard';
import TransactionTable from '../../components/table/TransactionTable';
import TopCategoriesChart from '../../components/chart/TopCategoriesChart';
import './Dashboard.css';
import { useNavigate } from "react-router-dom";

const Dashboard = ({ transactions = [], onDeleteTransaction, role }) => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });

  const [topCategories, setTopCategories] = useState([]);
  const navigate = useNavigate();

  //  SORT
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  //  DELETE
  const handleDelete = (id) => {
    onDeleteTransaction(id);
  };

  //  EDIT
  const handleEdit = (transaction) => {
    navigate("/add-transaction", { state: { transaction } });
  };

  //  CALCULATIONS
  useEffect(() => {
    const income = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expenses = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    setSummary({
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
    });

    const categoryMap = {};

    transactions
      .filter(tx => tx.type === 'expense')
      .forEach(tx => {
        categoryMap[tx.category] =
          (categoryMap[tx.category] || 0) + tx.amount;
      });

    const categories = Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        amount: Number(amount.toFixed(2)),
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    setTopCategories(categories);

  }, [transactions]);

  const summaryCards = [
    { title: "Total Income", amount: summary.totalIncome, icon: FaArrowUp, trend: "up" },
    { title: "Total Expenses", amount: summary.totalExpenses, icon: FaArrowDown, trend: "down" },
    { title: "Current Balance", amount: summary.balance, icon: FaWallet, trend: summary.balance >= 0 ? "up" : "down" },
  ];

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
      </div>

      {/* Summary */}
      <div className="summary-grid">
        {summaryCards.map((card, index) => (
          <SummaryCard
            key={index}
            title={card.title}
            amount={card.amount.toFixed(2)}
            icon={card.icon}
            trend={card.trend}
          />
        ))}
      </div>

      {/* Main */}
      <div className="main-grid">

        {/* Transactions */}
        <div className="card">
          <h2 className="card-title">Recent Transactions</h2>

          {transactions.length === 0 ? (
            <p className="empty-text">No transactions yet</p>
          ) : (
            <div className="table-container">
              <TransactionTable
                transactions={recentTransactions}
                showCategory
                role={role} 
                onDelete={role === "admin" ? handleDelete : null}
                onEdit={handleEdit}
              />
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="card">
          <h2 className="card-title">Top Categories</h2>
          <TopCategoriesChart data={topCategories} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;