"use client";
import React, { useEffect, useState, useRef } from "react";
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
import clsx from "clsx";
import MenuIcon from "./MenuIcon";
import { useCLMData } from "../CLMDataContext";
import { useThemeStore } from "../../../../store/themeStore";
import { fetchSubmissions } from "@/app/utils/fetchProcessSubmission";
import { calculateAgeDistribution } from "@/app/utils/fetchKpoDetails";

const AGE_GROUP_COLORS = [
  "#64B5F6",
  "#81C784",
  "#FFD54F",
  "#F48FB1",
  "#B39DDB",
  "#9E9E9E",
];

export default function AgeGroupDistributionChart({ selectedKpo }: { selectedKpo: string }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDarkMode } = useThemeStore();
  const [report, setReport] = useState<{ categories: string[]; series: number[] }>({
    categories: [],
    series: [],
  });

  useEffect(() => {
    async function loadData() {
      let submissions;
      if (selectedKpo && selectedKpo !== "all_kpos") {
        submissions = await fetchSubmissions({ kpo: [selectedKpo] });
      } else {
        submissions = await fetchSubmissions();
      }
      const data = calculateAgeDistribution(submissions);
      setReport(data);
    }
    loadData();
  }, [selectedKpo]);

  const ageDistribution = report || {
    categories: [],
    series: [],
  };

  const transformedData = ageDistribution.categories.map((category: string, index: number) => ({
    name: category,
    count: ageDistribution.series[index],
    color: AGE_GROUP_COLORS[index % AGE_GROUP_COLORS.length],
  }));

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
    const chartTitle = "Age_Group_Distribution_Chart";

    if (format === "csv") {
      const headers = ["Age Group", "Count"];
      const csvRows = [
        headers.join(","),
        ...transformedData.map((entry) => `"${entry.name}",${entry.count}`),
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

  if (!report || transformedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
          No data available for Age Group Distribution chart.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Dropdown menu */}
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
                : "bg-white border border-gray-200"
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
            data={transformedData}
            margin={{ top: 30, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridLineColor} />
            <XAxis dataKey="name" tick={{ fill: axisTickColor }} fontSize={14} />
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
              label={{
                position: "top",
                fill: labelFillColor,
              }}
            >
              {transformedData.map((entry: any, index: any) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}