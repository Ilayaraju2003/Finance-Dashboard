import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaWallet } from 'react-icons/fa';
import SummaryCard from '../../components/card/SummaryCard';
import TransactionTable from '../../components/table/TransactionTable';
import TopCategoriesChart from '../../components/chart/TopCategoriesChart';
import { deleteTransaction } from '../../api/api'; // ✅ IMPORT API
import './Dashboard.css';
import { useNavigate } from "react-router-dom";

const Dashboard = ({ transactions = [], refreshData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [topCategories, setTopCategories] = useState([]);

  // ✅ SORT + RECENT
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // ✅ DELETE FUNCTION (API)
  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      refreshData(); // 🔥 reload from API
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // ✅ EDIT FUNCTION (for now simple)
 const navigate = useNavigate();

const handleEdit = (transaction) => {
  navigate("/add-transaction", { state: { transaction } });
};



  // ✅ CALCULATIONS
  useEffect(() => {
    const timer = setTimeout(() => {
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
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [transactions]);

  // ✅ LOADING UI
  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  // ✅ SUMMARY CARDS
  const summaryCards = [
    {
      title: "Total Income",
      amount: summary.totalIncome,
      change: 5.2,
      icon: FaArrowUp,
      trend: "up",
    },
    {
      title: "Total Expenses",
      amount: summary.totalExpenses,
      change: 2.7,
      icon: FaArrowDown,
      trend: "down",
    },
    {
      title: "Current Balance",
      amount: summary.balance,
      change: 3.8,
      icon: FaWallet,
      trend: summary.balance >= 0 ? "up" : "down",
    },
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>

      

      {/* Summary Cards */}
      <div className="summary-grid">
        {summaryCards.map((card, index) => (
          <SummaryCard
            key={index}
            title={card.title}
            amount={card.amount.toFixed(2)}
            change={card.change}
            icon={card.icon}
            trend={card.trend}
          />
        ))}
      </div>
      

      {/* Main Section */}
      <div className="main-grid">
        
        {/* Transactions */}
        <div className="card">
          <h2>Recent Transactions</h2>

          {transactions.length === 0 ? (
            <p className="empty-text">No transactions yet</p>
          ) : (
            <TransactionTable
              transactions={recentTransactions}
              showCategory
              onDelete={handleDelete}   // ✅ FIXED
              onEdit={handleEdit}       // ✅ FIXED
            />
          )}
        </div>

        {/* Chart */}
        <div className="card">
          <TopCategoriesChart data={topCategories} />

          
        </div>

      </div>
    </div>
  );
};

export default Dashboard;