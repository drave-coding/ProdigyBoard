"use client"
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Sales in USD',
        data: [5000, 4000, 3000, 7000, 6000, 8000], // Example data
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false, // Ensures the chart fits the container
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
