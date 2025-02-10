"use client";

import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
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

const DonutChart: React.FC<DonutChartProps> = ({ title, data }) => {
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
      },
    },
    cutout: "60%", // Creates the donut effect
  };

  return (
    <div className="flex h-full flex-col items-center">
      {title && <h2 className="mb-4 text-lg font-semibold">{title}</h2>}
      <div className="flex-grow w-full max-w-[300px]">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default DonutChart;
