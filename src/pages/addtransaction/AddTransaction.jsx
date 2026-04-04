import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TransactionForm from '../../components/form/TransactionForm';
import { updateTransaction } from '../../api/api';
import './AddTransaction.css';

const AddTransaction = ({ onAddTransaction, onUpdateTransaction }) => {
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
        // ✅ UPDATE FLOW
        const updated = await updateTransaction(editData.id, transaction);

        if (onUpdateTransaction) {
          onUpdateTransaction(updated);
        } else {
          onAddTransaction(updated); // fallback
        }

      } else {
        // ✅ ADD FLOW
        await onAddTransaction(transaction);
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