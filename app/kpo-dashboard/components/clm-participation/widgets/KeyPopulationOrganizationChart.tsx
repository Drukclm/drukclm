"use client";
import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Text,
} from "recharts";
import { toPng, toSvg } from "html-to-image";
import clsx from "clsx";
import MenuIcon from "./MenuIcon";
import { useThemeStore } from "../../../../store/themeStore";
import { useCLMData } from "../CLMDataContext";
import {
  fetchSubmissions,
  calculateNetworkPercentage,
} from "../../../../utils/fetchProcessSubmission";

const NETWORK_COLORS = [
  "#4285F4",
  "#34A853",
  "#F9AB00",
  "#EA4335",
  "#9C27B0",
  "#9E9E9E",
];

export default function NetworkDistributionChart(selectedKpo: any) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useThemeStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [hoveredData, setHoveredData] = useState<any>(null);

  // ------------------ Fetch & Calculate ------------------
  useEffect(() => {
    const loadData = async () => {
      if (selectedKpo.selectedKpo === "all_kpos") {
        const data = await fetchSubmissions();
        const networkData = calculateNetworkPercentage(data);
        setData(networkData);
        const total = networkData.reduce((sum, entry) => sum + entry.count, 0);
        setTotalParticipants(total);
      } else {
        const data =
          selectedKpo && selectedKpo !== "all_kpos"
            ? await fetchSubmissions({ kpo: [selectedKpo.selectedKpo] })
            : await fetchSubmissions();
        const networkData = calculateNetworkPercentage(data);
        const total = networkData.reduce((sum, entry) => sum + entry.count, 0);

        setData(networkData);
        setTotalParticipants(total);
      }
    };

    loadData();
  }, [selectedKpo]);

  // ------------------ Center Label ------------------
  const CustomCenterLabel = ({ cx, cy }: { cx: number; cy: number }) => {
    if (!cx || !cy) return null;
    const displayValue = hoveredData ? hoveredData.count : totalParticipants;
    const displayName = hoveredData ? hoveredData.name : "Total";
    const fill = isDarkMode ? "#D1D5DB" : "#333";

    return (
      <g>
        <Text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          dominantBaseline="central"
          fill={fill}
          fontSize={14}
        >
          {displayName}
        </Text>
        <Text
          x={cx}
          y={cy + 15}
          textAnchor="middle"
          dominantBaseline="central"
          fill={fill}
          fontSize={24}
          fontWeight="bold"
        >
          {displayValue}
        </Text>
      </g>
    );
  };

  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const { name, count, percentage } = payload[0].payload;
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
          <p>Percentage: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  // ------------------ Download Chart ------------------
  const handleDownload = async (format: "png" | "svg" | "csv") => {
    if (!chartRef.current) return;
    const title = "Network_Distribution_Chart";

    if (format === "csv") {
      const headers = ["Network", "Count", "Percentage"];
      const csvRows = [
        headers.join(","),
        ...data.map((d) => `"${d.name}",${d.count},${d.percentage}`),
      ].join("\n");
      const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${title}.csv`;
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
      link.download = `${title}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(dataUrl);
    } catch (error) {
      console.error("Error exporting chart:", error);
      alert(`Failed to export chart as ${format.toUpperCase()}. Please try again.`);
    }
  };

  // ------------------ Render ------------------
  if (totalParticipants === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
          No data available.
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
                : "bg-white border border-gray-200"
            )}
            role="menu"
          >
            <button
              className={clsx(
                "block w-full text-left px-4 py-2 text-sm",
                isDarkMode
                  ? "text-white hover:bg-black/10"
                  : "text-gray-800 hover:bg-gray-100"
              )}
              onClick={() => handleDownload("svg")}
              role="menuitem"
            >
              Download SVG
            </button>
            <button
              className={clsx(
                "block w-full text-left px-4 py-2 text-sm",
                isDarkMode
                  ? "text-white hover:bg-black/10"
                  : "text-gray-800 hover:bg-gray-100"
              )}
              onClick={() => handleDownload("png")}
              role="menuitem"
            >
              Download PNG
            </button>
            <button
              className={clsx(
                "block w-full text-left px-4 py-2 text-sm",
                isDarkMode
                  ? "text-white hover:bg-black/10"
                  : "text-gray-800 hover:bg-gray-100"
              )}
              onClick={() => handleDownload("csv")}
              role="menuitem"
            >
              Download CSV
            </button>
          </div>
        )}
      </div>

      {/* Pie Chart */}
      <div ref={chartRef} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomChartTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="count"
              onMouseEnter={(entry) => setHoveredData(entry.payload)}
              onMouseLeave={() => setHoveredData(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={NETWORK_COLORS[index % NETWORK_COLORS.length]}
                />
              ))}
              <CustomCenterLabel cx={150} cy={150} />
            </Pie>
            <Legend layout="horizontal" align="center" verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}