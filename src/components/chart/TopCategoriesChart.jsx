import React, { useRef, useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "./TopCategoriesChart.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const TopCategoriesChart = ({ data }) => {
  const chartRef = useRef(null);

  // Detect dark mode
  const isDark = document.documentElement.classList.contains("dark");

  // Generate colors
  const generateColors = (count) => {
    const colors = [];
    const hueStep = 360 / Math.max(1, count);

    for (let i = 0; i < count; i++) {
      const hue = i * hueStep;
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }

    return colors;
  };

  const chartData = useMemo(() => ({
    labels: data.map(item => item.category),
    datasets: [
      {
        data: data.map(item => item.amount),
        backgroundColor: generateColors(data.length),
        borderColor: isDark ? "#1e293b" : "#ffffff",
        borderWidth: 2,
      },
    ],
  }), [data, isDark]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: isDark ? "#e2e8f0" : "#333",
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#1e293b" : "#fff",
        titleColor: isDark ? "#fff" : "#000",
        bodyColor: isDark ? "#e2e8f0" : "#333",
        borderColor: isDark ? "#334155" : "#ddd",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "70%",
  };

  return (
    <div className="chart-card">
      <h3 className="chart-title">Spending by Category</h3>

      <div className="chart-container">
        {data.length === 0 ? (
          <p className="chart-empty">No data available</p>
        ) : (
          <Doughnut ref={chartRef} data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default TopCategoriesChart;