import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TransactionForm from '../../components/form/TransactionForm';
import './AddTransaction.css';

const AddTransaction = ({ onAddTransaction, onEditTransaction }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const editData = location.state?.transaction;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (transaction) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (editData) {
        //  EDIT (LOCAL)
        const updatedTransaction = {
          ...transaction,
          id: editData.id,
          amount: parseFloat(transaction.amount),
        };

        onEditTransaction(updatedTransaction);
      } else {
        //  ADD
        onAddTransaction(transaction);
      }

      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-transaction-page">

      {/* Header */}
      <div className="page-header">
        <h1>
          {editData ? 'Edit Transaction' : 'Add New Transaction'}
        </h1>

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      {/* Card */}
      <div className="form-card">

        {/* Error */}
        {error && (
          <div className="error-box">
            <span>⚠</span>
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <TransactionForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          initialData={editData || {}}
        />

      </div>
    </div>
  );
};

export default AddTransaction;