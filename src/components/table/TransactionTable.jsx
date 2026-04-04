import React from 'react';
import { FaArrowUp, FaArrowDown, FaEdit, FaTrash } from 'react-icons/fa';
import './TransactionTable.css';

const TransactionTable = ({
  transactions,
  showCategory = true,
  onDelete = () => {},
  onEdit = () => {}
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
                  
                  <td>
                    <div className="transaction-info">
                      <div className={`icon ${isIncome ? 'income' : 'expense'}`}>
                        {isIncome ? <FaArrowUp /> : <FaArrowDown />}
                      </div>
                      <span className="title">{transaction.title}</span>
                    </div>
                  </td>

                  <td className="date">
                    {formatDate(transaction.date)}
                  </td>

                  {showCategory && (
                    <td>
                      <span className="category-badge">
                        {transaction.category}
                      </span>
                    </td>
                  )}

                  <td className={`amount ${isIncome ? 'income' : 'expense'}`}>
                    {isIncome ? '+' : '-'}₹
                    {Math.abs(transaction.amount).toFixed(2)}
                  </td>

                  <td className="actions">
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