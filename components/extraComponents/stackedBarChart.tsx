"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface StackedBarChartProps {
  title?: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({ title, data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <div className="flex h-full flex-col items-center">
      {title && <h2 className="mb-4 text-lg font-semibold">{title}</h2>}
      <div className="flex-grow w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default StackedBarChart;
