"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = {
  data: {
    respect: { yes: number; no: number; yesPercent: number; noPercent: number };
    consent: { yes: number; no: number; yesPercent: number; noPercent: number };
  };
  isDarkMode: boolean;
};

const OverallChart = ({ data, isDarkMode }: Props) => {
  if (!data) return <p>No overall summary available.</p>;

  // Convert to chart-friendly format
  const chartData = [
    {
      metric: "Respect",
      Yes: data.respect.yes,
      No: data.respect.no,
    },
    {
      metric: "Consent",
      Yes: data.consent.yes,
      No: data.consent.no,
    },
  ];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDarkMode ? "#444" : "#ccc"}
          />
          <XAxis dataKey="metric" stroke={isDarkMode ? "#fff" : "#000"} />
          <YAxis stroke={isDarkMode ? "#fff" : "#000"} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Yes" fill="#22c55e" /> {/* green */}
          <Bar dataKey="No" fill="#ef4444" /> {/* red */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OverallChart;
