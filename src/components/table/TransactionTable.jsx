import React from 'react';
import { FaArrowUp, FaArrowDown, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import './TransactionTable.css';

const TransactionTable = ({
  transactions,
  showCategory = true,
  onDelete,
  onEdit,
  role = "viewer"
}) => {

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="table-container">
      <table className="transaction-table">

        <thead>
          <tr>
            <th>Description</th>
            <th>Date</th>
            {showCategory && <th>Category</th>}
            <th className="text-right">Amount</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={showCategory ? 5 : 4} className="empty-row">
                No transactions available
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => {
              const isIncome = transaction.type === 'income';

              return (
                <tr key={transaction.id}>

                  {/* Description */}
                  <td data-label="Description">
                    <div className="transaction-info">
                      <div className={`icon ${isIncome ? 'income' : 'expense'}`}>
                        {isIncome ? <FaArrowUp /> : <FaArrowDown />}
                      </div>
                      <span className="title">{transaction.title}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td data-label="Date" className="date">
                    {formatDate(transaction.date)}
                  </td>

                  {/* Category */}
                  {showCategory && (
                    <td data-label="Category">
                      <span className="category-badge">
                        {transaction.category}
                      </span>
                    </td>
                  )}

                  {/* Amount */}
                  <td
                    data-label="Amount"
                    className={`amount ${isIncome ? 'income' : 'expense'}`}
                  >
                    {isIncome ? '+' : '-'}₹
                    {Math.abs(transaction.amount).toFixed(2)}
                  </td>

                  {/*  ACTIONS */}
                  <td data-label="Actions" className="actions">

                    {role === "admin" ? (
                      <>
                        <button
                          className="edit-btn"
                          onClick={() => onEdit(transaction)}
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => onDelete(transaction.id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    ) : (
                      <button
                        className="view-btn"
                        onClick={() => onEdit(transaction)} // reuse edit as view
                      >
                        <FaEye />
                      </button>
                    )}

                  </td>

                </tr>
              );
            })
          )}
        </tbody>

      </table>
    </div>
  );
};

export default TransactionTable;