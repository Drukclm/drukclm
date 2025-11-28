"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import clsx from "clsx";
import { useThemeStore } from "../../../store/themeStore";

export interface ProcessedServiceAvailabilityData {
  label: string;
  soughtCount: number;
  receivedCount: number;
}

interface Props {
  rawData: ProcessedServiceAvailabilityData[];
  loading?: boolean;
  chartTitle: string;
}

export default function ServiceAvailabilityChart({
  rawData,
  loading = false,
  chartTitle,
}: Props) {
  const { isDarkMode } = useThemeStore();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400">
        Loading chart data...
      </div>
    );
  }

  if (!rawData || rawData.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400">
        No service availability data to display.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) =>
    active && payload?.length ? (
      <div
        className={clsx(
          "p-2 rounded shadow-md text-sm",
          isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
        )}
      >
        <p className="font-semibold">{label}</p>
        {payload.map((entry: any, idx: number) => (
          <p key={idx} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    ) : null;

  // --------------------
  // Theme-aware colors
  // --------------------
  const CHART_COLORS = {
    Sought: isDarkMode ? "#60A5FA" : "#F59E0B", // Cyan-400 / Amber-500
    Received: isDarkMode ? "#34D399" : "#10B981", // Emerald-400 / Emerald-500
  };

  return (
    <div
      className={clsx(
        "w-full h-full p-4 rounded-lg shadow-md",
        isDarkMode ? "bg-gray-800" : "bg-white"
      )}
    >
      <h3
        className={clsx(
          "text-xl font-semibold mb-4 text-center",
          isDarkMode ? "text-white" : "text-gray-900"
        )}
      >
        {chartTitle}
      </h3>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={rawData}
          margin={{ top: 20, right: 20, left: 0, bottom: 80 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDarkMode ? "#374151" : "#E5E7EB"}
          />
          <XAxis
            dataKey="label"
            angle={-45}
            textAnchor="end"
            interval={0}
            tick={{ fill: isDarkMode ? "#D1D5DB" : "#4B5563" }}
            height={60}
          />
          <YAxis
            tick={{ fill: isDarkMode ? "#D1D5DB" : "#4B5563" }}
            label={{
              value: "Count",
              angle: -90,
              position: "insideLeft",
              fill: isDarkMode ? "#D1D5DB" : "#4B5563",
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            wrapperStyle={{ color: isDarkMode ? "#D1D5DB" : "#4B5563" }}
          />
          <Bar dataKey="soughtCount" name="Sought" fill={CHART_COLORS.Sought} />
          <Bar
            dataKey="receivedCount"
            name="Received"
            fill={CHART_COLORS.Received}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
