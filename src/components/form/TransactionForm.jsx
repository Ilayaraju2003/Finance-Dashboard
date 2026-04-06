import React, { useState, useEffect } from 'react';
import './TransactionForm.css';

const TransactionForm = ({ onSubmit, initialData = {}, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
  });

  // ✅ Populate form when editing
  useEffect(() => {
    if (initialData && initialData.id) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        category: initialData.category || 'Food',
        type: initialData.type || 'expense',
        date: initialData.date || new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const categories = [
    'Food', 'Shopping', 'Transport', 'Housing',
    'Entertainment', 'Utilities', 'Healthcare',
    'Education', 'Salary', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount'
        ? value === '' ? '' : Number(value)
        : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.amount || isNaN(formData.amount)) {
      alert('Please enter a valid amount');
      return;
    }

    const transaction = {
      ...formData,
      id: initialData.id || Date.now(),
      amount: Number(formData.amount),
    };

    onSubmit(transaction);

    if (!initialData.id) resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      category: 'Food',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">

      {/* Title */}
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="form-input"
          placeholder="Enter title"
          required
        />
      </div>

      {/* Amount */}
      <div className="form-group">
        <label>Amount</label>
        <div className="amount-input-wrapper">
          <span className="currency-symbol">₹</span>
          <input
            type="number"
            step="0.01"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="form-input amount-input"
            placeholder="0.00"
            required
          />
        </div>
      </div>

      {/* Category + Type */}
      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-input"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-input"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>

      {/* Date */}
      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      {/* Buttons */}
      <div className="form-actions">
        <button
          type="button"
          className="btn btn-outline"
          onClick={resetForm}
          disabled={isSubmitting}
        >
          Reset
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Saving...'
            : initialData.id
              ? 'Update'
              : 'Add'}
        </button>
      </div>

    </form>
  );
};

export default TransactionForm;