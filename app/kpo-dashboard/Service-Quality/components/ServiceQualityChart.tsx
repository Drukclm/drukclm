// service-quality/components/ServiceQualityChart.tsx
"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
  data: { label: string; yes: number; no: number }[];
};

const ServiceQualityChart = ({ data }: Props) => {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "YES",
        data: data.map((d) => d.yes),
        backgroundColor: "rgba(34,197,94,0.7)", // green
      },
      {
        label: "NO",
        data: data.map((d) => d.no),
        backgroundColor: "rgba(239,68,68,0.7)", // red
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default ServiceQualityChart;
