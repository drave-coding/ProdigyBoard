"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  title?: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      hoverBackgroundColor: string[];
    }[];
  };
}

const PieChart: React.FC<PieChartProps> = ({ title, data }) => {
  const options = {
    maintainAspectRatio: false, // Ensures chart fits the container
    responsive: true,
    plugins: {
      legend: {
        display: true, // Enable the legend
        position: "bottom" as const, // Position legend at the bottom
      },
    },
  };

  return (
    <div className="flex h-full flex-col items-center">
      {title && <h2 className="mb-4 text-lg font-semibold">{title}</h2>}
      <div className="flex-grow w-full max-w-[300px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
