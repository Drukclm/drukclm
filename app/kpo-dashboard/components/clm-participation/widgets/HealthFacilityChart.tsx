"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
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
import { toPng, toSvg } from "html-to-image";
import MenuIcon from "./MenuIcon";
import clsx from "clsx";
import { useThemeStore } from "../../../../store/themeStore";
import { fetchSubmissions } from "../../../../utils/fetchProcessSubmission";
import { calculateServiceFacilityStats } from "../../../../utils/fetchKpoDetails";

const HEALTH_COLORS = {
  National: "#42A5F5",
  Regional: "#9E9E9E",
  Hospitals: "#EF5350",
  PHCs: "#4CAF50",
  "Sub-posts": "#FFD54F",
  HISCs: "#26A69A",
  Others: "#90A4AE",
};

function getHealthFacilityCategory(
  facilityName: string
): keyof typeof HEALTH_COLORS {
  const name = facilityName.toLowerCase();
  if (name.includes("national")) return "National";
  if (name.includes("regional")) return "Regional";
  if (name.includes("hospital")) return "Hospitals";
  if (name.includes("phc") || name.includes("basic health unit")) return "PHCs";
  if (name.includes("sub-post")) return "Sub-posts";
  if (name.includes("hisc")) return "HISCs";
  return "Others";
}

export default function HealthFacilityChart({ selectedKpo }: { selectedKpo: string }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [transformedData, setTransformedData] = useState<any[]>([]);
  const [hasData, setHasData] = useState(false);
  const { isDarkMode } = useThemeStore();

  // ------------------ Fetch and Transform Data ------------------
  useEffect(() => {
    const loadData = async () => {
      let submissions;
      if (selectedKpo && selectedKpo !== "all_kpos") {
        submissions = await fetchSubmissions({ kpo: [selectedKpo] });
      } else {
        submissions = await fetchSubmissions();
      }
      const stats = await calculateServiceFacilityStats(submissions);

      const dataObj: { [key: string]: number } = {};
      Object.keys(HEALTH_COLORS).forEach((key) => (dataObj[key] = 0));

      stats.details.forEach((detail: any) => {
        const category = getHealthFacilityCategory(detail.name);
        dataObj[category] += detail.count || 0;
      });

      setTransformedData([{ name: "Facilities", ...dataObj }]);
      setHasData(Object.keys(dataObj).some((key) => dataObj[key] > 0));
    };

    loadData();
  }, [selectedKpo]);

  // ------------------ Legend ------------------
  const legendPayload = useMemo(() => {
    if (!transformedData[0]) return [];
    return Object.keys(HEALTH_COLORS).map((key) => ({
      id: key,
      value: key,
      type: "square",
      color: HEALTH_COLORS[key as keyof typeof HEALTH_COLORS],
    }));
  }, [transformedData]);

  // ------------------ Tooltip ------------------
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const { dataKey, value } = payload[0];
      // Only show tooltip if the value is greater than 0
      if (value > 0) {
        return (
          <div
            className={clsx(
              "p-2 border rounded shadow-lg text-sm",
              isDarkMode
                ? "bg-slate-700 text-white border-slate-600"
                : "bg-white text-gray-800 border-gray-300"
            )}
          >
              <p className="font-semibold">{dataKey}</p>
            <p>Count: {value}</p>
          </div>
        );
      }
    }
    return null;
  };

  // ------------------ Download ------------------
  const handleDownload = async (format: "png" | "svg" | "csv") => {
    if (!chartRef.current) return;
    const title = "Health_Facility_Chart";

    if (format === "csv") {
      const headers = ["Facility Type", "Count"];
      const csvRows = [
        headers.join(","),
        ...Object.keys(HEALTH_COLORS).map(
          (key) => `"${key}",${transformedData[0][key]}`
        ),
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

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
          No data available for Health facility chart.
        </p>
      </div>
    );
  }

  // ------------------ Render ------------------
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
            margin={{ top: 30, right: 30, left: -20, bottom: 5 }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDarkMode ? "#374151" : "#E0E0E0"}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: isDarkMode ? "#D1D5DB" : "#666" }}
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
            <Tooltip 
              content={<CustomTooltip />} 
              shared={false}
            />
            <Legend
              layout="horizontal"
              align="left"
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: "10px" }}
              iconType="square"
            />
            {Object.keys(HEALTH_COLORS).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={HEALTH_COLORS[key as keyof typeof HEALTH_COLORS]}
                label={{
                  position: "top",
                  fill: isDarkMode ? "#D1D5DB" : "#000",
                }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}