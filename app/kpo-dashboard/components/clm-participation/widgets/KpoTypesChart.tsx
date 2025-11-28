// app/kpo-dashboard/CLM-Participation/components/clm-participation/widgets/KpoTypesChart.tsx
"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { toPng, toSvg } from "html-to-image";
import MenuIcon from "./MenuIcon";
import clsx from "clsx";
import { useThemeStore } from "../../../../store/themeStore"; // Correct path if needed
import { useCLMData } from "../CLMDataContext";
import { fetchSubmissions } from "@/app/utils/fetchProcessSubmission";
import { calculateClmParticipationByKPO, calculateKpoKeyPopulationDistribution } from "@/app/utils/fetchKpoDetails";

// Define colors for KPO categories
const KPO_COLORS = [
  "#30C0E8", // Blue
  "#667781", // Grey
  "#F44336", // Red
  "#FFC107", // Yellow
  "#4CAF50", // Green
  "#9C27B0", // Purple
  "#E0E0E0", // Light Grey for other categories if they emerge
];

export default function KpoTypesChart({ selectedKpo }: { selectedKpo: string }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDarkMode } = useThemeStore();

  const { report } = useCLMData(); // Get the entire report object

  const [data, setData] = useState<any>({
    categories: [],
    series: [],
    total: 0,
    percentages: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      let submissions;
      if (selectedKpo && selectedKpo !== "all_kpos") {
        submissions = await fetchSubmissions({ kpo: [selectedKpo] });
      } else {
        submissions = await fetchSubmissions();
      }
      const kpoData = calculateKpoKeyPopulationDistribution(submissions);
      setData(kpoData);
    };
    fetchData();
  }, [selectedKpo]);

  const transformedData = useMemo(() => {
    return (data.categories || [])
      .map((category: any, index: number) => ({
        name: category,
        count: data.series[index],
      }))
      .filter((item: any) => item.count > 0)
      .sort((a: any, b: any) => b.count - a.count);
  }, [data]);

  const handleDownload = async (format: "png" | "svg" | "csv") => {
    if (!chartRef.current) return;

    const chartTitle = "KPO_Types_Chart";

    if (format === "csv") {
      const headers = ["KPO Type", "Count"];
      const csvRows = [
        headers.join(","),
        ...transformedData.map((row: any) => `"${row.name}",${row.count}`),
      ].join("\n");

      const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${chartTitle}.csv`;
      link.click();
      return;
    }

    try {
      setIsDropdownOpen(false);
      
      // Wait longer for Recharts to fully render
      await new Promise((resolve) => setTimeout(resolve, 500));

      const node = chartRef.current;

      const options = {
        backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
        cacheBust: true,
        pixelRatio: 3, // Increased for better quality
        quality: 1,
        useCORS: true,
        // More comprehensive filter to handle Recharts elements
        filter: (domNode: HTMLElement) => {
          // Exclude the dropdown menu
          if (domNode.classList?.contains('absolute') && 
              domNode.getAttribute('role') === 'menu') {
            return false;
          }
          
          // Try to handle text nodes that might cause issues
          if (domNode.tagName === 'text') {
            return true;
          }
          
          return true;
        },
        // Skip fonts that might cause issues
        skipFonts: false,
        fontEmbedCSS: '',
        // Add style to ensure everything is visible
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

      // Download the file
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${chartTitle}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(dataUrl);
    } catch (error) {
      console.error("Error exporting chart:", error);
      alert(`Failed to export chart as ${format.toUpperCase()}. Please try again.`);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={clsx(
            "p-2 border rounded shadow-lg text-sm",
            isDarkMode
              ? "bg-slate-700 text-white border-slate-600"
              : "bg-white text-gray-800 border-gray-300"
          )}
        >
          <p className="font-semibold">{label}</p>
          <p>Count: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-0 right-0 z-10 p-1">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={clsx(
            "rounded-md ",
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
            margin={{
              top: 30,
              right: 0,
              left: -20,
              bottom: 70,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDarkMode ? "#374151" : "#E0E0E0"}
            />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={70}
              tick={{ fill: isDarkMode ? "#D1D5DB" : "#666", fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: isDarkMode ? "#D1D5DB" : "#666" }}
              label={{
                value: "Count",
                angle: -90,
                position: "insideLeft",
                fill: isDarkMode ? "#D1D5DB" : "#666",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              label={{
                position: "top",
                fill: isDarkMode ? "#D1D5DB" : "#000",
              }}
            >
              {transformedData.map((_: any, index: any) => (
                <Cell
                  key={`cell-${index}`}
                  fill={KPO_COLORS[index % KPO_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}