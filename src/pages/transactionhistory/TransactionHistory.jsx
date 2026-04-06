import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import './TransactionHistory.css';

const TransactionHistory = ({ transactions = [] }) => {
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });

  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    startDate: '',
    endDate: '',
  });

  //  Safe date parser
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return new Date(`${year}-${month}-${day}`);
    }
    return new Date(dateStr);
  };

  useEffect(() => {
    let result = [...transactions];

    // 🔍 Search (SAFE)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(tx =>
        (tx.title || '').toLowerCase().includes(term) ||
        (tx.category || '').toLowerCase().includes(term) ||
        String(tx.amount ?? '').includes(term)
      );
    }

    //  Filters
    if (filters.type !== 'all') {
      result = result.filter(tx => tx.type === filters.type);
    }

    if (filters.category !== 'all') {
      result = result.filter(tx => tx.category === filters.category);
    }

    if (filters.startDate) {
      result = result.filter(tx => parseDate(tx.date) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      result = result.filter(tx => parseDate(tx.date) <= new Date(filters.endDate));
    }

    //  SAFE SORT
    result.sort((a, b) => {
      if (sortConfig.key === "date") {
        return sortConfig.direction === "asc"
          ? parseDate(a.date) - parseDate(b.date)
          : parseDate(b.date) - parseDate(a.date);
      }

      if (sortConfig.key === "amount") {
        return sortConfig.direction === "asc"
          ? (a.amount ?? 0) - (b.amount ?? 0)
          : (b.amount ?? 0) - (a.amount ?? 0);
      }

      return sortConfig.direction === "asc"
        ? (a[sortConfig.key] || '').localeCompare(b[sortConfig.key] || '')
        : (b[sortConfig.key] || '').localeCompare(a[sortConfig.key] || '');
    });

    setFilteredTransactions(result);

  }, [transactions, searchTerm, filters, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    const date = parseDate(dateString);

    if (isNaN(date)) return '—';

    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const categories = [...new Set(transactions.map(tx => tx.category))];

  return (
    <div className="history-container">

      {/* Header */}
      <div className="history-header">
        <h1>Transaction History</h1>

        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="filters-card">
        <h2>Filters</h2>

        <div className="filters-grid">
          <select name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
          <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <table className="history-table">

          <thead>
            <tr>
              <th>No</th>
              <th onClick={() => handleSort('title')}>Description</th>
              <th onClick={() => handleSort('date')}>Date</th>
              <th onClick={() => handleSort('category')}>Category</th>
              <th onClick={() => handleSort('amount')}>Amount</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx, index) => {
                const safeAmount = Number(tx.amount ?? 0);

                return (
                  <tr key={tx.id}>
                    <td data-label="No">{index + 1}</td>
                    <td data-label="Description">{tx.title || '-'}</td>
                    <td data-label="Date">{formatDate(tx.date)}</td>
                    <td data-label="Category">
                      <span className="badge">{tx.category || '-'}</span>
                    </td>
                    <td data-label="Amount" className={`amount ${tx.type}`}>
                      {tx.type === 'income' ? '+' : '-'}₹{safeAmount.toFixed(2)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="empty">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default TransactionHistory;