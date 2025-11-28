"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WaitingTimeLineChartProps {
  chartData: { x: number; y: number }[];
  isDarkMode?: boolean;
  chartTitle?: string;
}

export default function WaitingTimeLineChart({
  chartData,
  isDarkMode = false,
  chartTitle = "Waiting Time Chart",
}: WaitingTimeLineChartProps) {

  const sortedChartData = [...chartData].sort((a, b) => a.x - b.x);

  const data = {
    labels: sortedChartData.map((d) => d.x),
    datasets: [
      {
        label: "Number of Patients",
        data: sortedChartData.map((d) => d.y),
        fill: false,
        borderColor: "rgba(34,197,94,0.9)",
        backgroundColor: "rgba(34,197,94,0.5)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: isDarkMode ? "white" : "black" } },
      title: {
        display: true,
        text: chartTitle,
        color: isDarkMode ? "white" : "black",
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Waiting Time (minutes)",
          color: isDarkMode ? "white" : "black",
        },
        ticks: { color: isDarkMode ? "white" : "black" },
      },
      y: {
        title: {
          display: true,
          text: "Number of Patients",
          color: isDarkMode ? "white" : "black",
        },
        ticks: { color: isDarkMode ? "white" : "black" },
        beginAtZero: true,
      },
    },
  };

  return <Line width={"2000"} height={"700"}  data={data} options={options} />;
}
