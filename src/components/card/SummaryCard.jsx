import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './SummaryCard.css';

const SummaryCard = ({ title, amount, change, icon, trend }) => {
  const Icon = icon;
  const isPositive = trend === 'up';

  return (
    <div className="summary-card">
      <div className="summary-content">


        {/* Left Content */}
        <div>
          <p className="summary-title">{title}</p>
          <p className="summary-amount">

            ${Number(amount).toLocaleString()}
          </p>

          <div className={`summary-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? <FaArrowUp /> : <FaArrowDown />}
            <span>{change}% from last month</span>
          </div>
        </div>

        {/* Icon */}
        <div className={`summary-icon ${isPositive ? 'icon-positive' : 'icon-negative'}`}>
          <Icon size={22} />
        </div>

      </div>
    </div>
  );
};

export default SummaryCard;