"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface ChartDataItem {
  label: string;
  count: number;
  yesPercent?: number;
}

interface SeriousIncidentChartProps {
  data: ChartDataItem[];
  isDarkMode: boolean;
  chartTitle?: string;
}

export default function SeriousIncidentChart({
  data,
  isDarkMode,
  chartTitle,
}: SeriousIncidentChartProps) {
  const barColor = isDarkMode ? "#f87171" : "#dc2626"; // Tailwind red
  const textColor = isDarkMode ? "#f5f5f5" : "#111827";
  const gridColor = isDarkMode ? "#334155" : "#e5e7eb";

  if (!data || data.length === 0) {
    return (
      <p style={{ color: textColor, textAlign: "center" }}>
        No data to display
      </p>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {chartTitle && (
        <h3 style={{ color: textColor, textAlign: "center", marginBottom: 16 }}>
          {chartTitle}
        </h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            stroke={textColor}
            tick={{ fill: textColor, fontSize: 12 }}
            interval={0}
            angle={-30}
            textAnchor="end"
          />
          <YAxis
            stroke={textColor}
            tick={{ fill: textColor, fontSize: 12 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? "#1e293b" : "#f9fafb",
              color: isDarkMode ? "#f5f5f5" : "#111827",
              borderRadius: 6,
              border: "none",
              fontSize: 12,
            }}
            formatter={(value: any, name: string, props: any) => {
              const percent = props.payload?.yesPercent?.toFixed(1) || "0.0";
              return [`${value} (${percent}%)`, "Count"];
            }}
          />
          <Bar
            dataKey="count"
            fill={barColor}
            radius={[4, 4, 0, 0]}
            animationDuration={700}
          >
            <LabelList
              dataKey="yesPercent"
              position="top"
              formatter={(label: React.ReactNode) => {
                if (typeof label === "number") {
                  return `${label.toFixed(1)}%`;
                }
                return "0%";
              }}
              fill={textColor}
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
