"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { toPng, toSvg } from "html-to-image";
import MenuIcon from "./MenuIcon";
import clsx from "clsx";
import { useThemeStore } from "../../../../store/themeStore";
import { fetchSubmissions } from "../../../../utils/fetchProcessSubmission";
import { calculateRegionDistribution } from "../../../../utils/fetchKpoDetails";

const CHART_COLORS = [
  "#4DD0E1",
  "#757575",
  "#EF5350",
  "#81C784",
  "#FFC107",
  "#BA68C8",
  "#FF8A65",
  "#A1887F",
  "#BDBDBD",
  "#7986CB",
  "#F06292",
  "#90A4AE",
  "#66BB6A",
  "#FFEE58",
  "#5C6BC0",
  "#8D6E63",
  "#26A69A",
  "#FF7043",
];

export default function DzongkhagChart({ selectedKpo }: { selectedKpo: string }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [hasData, setHasData] = useState(false);
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    const loadData = async () => {
      let submissions;
      if (selectedKpo && selectedKpo !== "all_kpos") {
        submissions = await fetchSubmissions({ kpo: [selectedKpo] });
      } else {
        submissions = await fetchSubmissions();
      }
      // Assuming you also have regions list somewhere
      const regions = submissions
        .map((s) => s.answers?.["4"])
        .filter((r, i, arr) => r && arr.indexOf(r) === i)
        .map((name) => ({ name }));

      const regionDist = calculateRegionDistribution(submissions, regions);

      const transformed = regionDist.categories.map((cat, index) => ({
        name: cat,
        count: regionDist.counts[index] ?? 0,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }));

      setChartData(transformed);
      setHasData(transformed.some((entry) => entry.count > 0));
    };

    loadData();
  }, [selectedKpo]);

  const axisTickColor = isDarkMode ? "#D1D5DB" : "#666";
  const gridLineColor = isDarkMode ? "#4B5563" : "#E0E0E0";
  const labelFillColor = isDarkMode ? "#D1D5DB" : "#000";

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const { name, count } = payload[0].payload;
      return (
        <div
          className={clsx(
            "p-2 border rounded shadow-lg text-sm",
            isDarkMode
              ? "bg-slate-700 text-white border-slate-600"
              : "bg-white text-gray-800 border-gray-300"
          )}
        >
          <p className="font-semibold">{name}</p>
          <p>Count: {count}</p>
        </div>
      );
    }
    return null;
  };

  const handleDownload = async (format: "png" | "svg" | "csv") => {
    if (!chartRef.current) return;
    const chartTitle = "Dzongkhag_Chart";

    if (format === "csv") {
      const headers = ["Region", "Count"];
      const csvRows = [
        headers.join(","),
        ...chartData.map((entry) => `"${entry.name}",${entry.count}`),
      ].join("\n");
      const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${chartTitle}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      setIsDropdownOpen(false);
      return;
    }

    try {
      setIsDropdownOpen(false);
      
      // Wait for Recharts to fully render
      await new Promise((resolve) => setTimeout(resolve, 500));

      const node = chartRef.current;

      const options = {
        backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
        cacheBust: true,
        pixelRatio: 3,
        quality: 1,
        useCORS: true,
        filter: (domNode: HTMLElement) => {
          // Exclude the dropdown menu
          if (domNode.classList?.contains('absolute') && 
              domNode.getAttribute('role') === 'menu') {
            return false;
          }
          
          if (domNode.tagName === 'text') {
            return true;
          }
          
          return true;
        },
        skipFonts: false,
        fontEmbedCSS: '',
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      };

      let dataUrl: string;
      if (format === "png") {
        dataUrl = await toPng(node, options);
      } else {
        dataUrl = await toSvg(node, options);
      }

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${chartTitle}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(dataUrl);
    } catch (error) {
      console.error("Error exporting chart:", error);
      alert(`Failed to export chart as ${format.toUpperCase()}. Please try again.`);
    }
  };

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
          No data available for Dzongkhag chart.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Dropdown */}
      <div className="absolute top-0 right-0 z-10 p-1">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={clsx(
            "rounded-md",
            isDarkMode
              ? "hover:bg-slate-700 text-gray-200"
              : "hover:bg-gray-100 text-gray-700"
          )}
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
        >
          <MenuIcon />
        </button>
        {isDropdownOpen && (
          <div
            className={clsx(
              "absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5",
              isDarkMode
                ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                : "bg-white text-gray-800 border border-gray-200"
            )}
            role="menu"
          >
            <button
              onClick={() => handleDownload("svg")}
              className={clsx(
                "block w-full text-left px-4 py-2 text-sm",
                isDarkMode
                  ? "text-white hover:bg-black/10"
                  : "text-gray-800 hover:bg-gray-100"
              )}
              role="menuitem"
            >
              Download SVG
            </button>
            <button
              onClick={() => handleDownload("png")}
              className={clsx(
                "block w-full text-left px-4 py-2 text-sm",
                isDarkMode
                  ? "text-white hover:bg-black/10"
                  : "text-gray-800 hover:bg-gray-100"
              )}
              role="menuitem"
            >
              Download PNG
            </button>
            <button
              onClick={() => handleDownload("csv")}
              className={clsx(
                "block w-full text-left px-4 py-2 text-sm",
                isDarkMode
                  ? "text-white hover:bg-black/10"
                  : "text-gray-800 hover:bg-gray-100"
              )}
              role="menuitem"
            >
              Download CSV
            </button>
          </div>
        )}
      </div>

      <div ref={chartRef} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridLineColor} />
            <XAxis
              dataKey="name"
              tick={{ fill: axisTickColor }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: axisTickColor }}
              label={{
                value: "Count",
                angle: -90,
                position: "insideLeft",
                fill: axisTickColor,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              label={{ fill: labelFillColor, position: "top" }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}