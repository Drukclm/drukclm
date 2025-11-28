"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
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
import { useThemeStore } from "../../../../store/themeStore";
import { useCLMData } from "../CLMDataContext";
import { fetchSubmissions } from "@/app/utils/fetchProcessSubmission";
import { calculateKPOGenderDistribution } from "@/app/utils/fetchKpoDetails";
import MenuIcon from "./MenuIcon";

const GENDER_COLORS = [
  "#FF8A00",
  "#00BCD4",
  "#E0E0E0",
  "#FFC107",
  "#9C27B0",
  "#4CAF50",
];

type GenderDistribution = {
  categories: string[];
  series: number[];
  total: number;
  percentages: number[];
};

export default function GenderChart(selectedKpo: any) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDarkMode } = useThemeStore();
  const [data, setData] = useState<GenderDistribution>({
    categories: [],
    series: [],
    total: 0,
    percentages: [],
  });

  useEffect(() => {
    const fetchGenderData = async () => {
      if (selectedKpo.selectedKpo === "all_kpos") {
        const data = await fetchSubmissions();
        const genderdata = calculateKPOGenderDistribution(data);
        setData(genderdata);
      } else {
        const data = selectedKpo && selectedKpo !== "all_kpos"
          ? await fetchSubmissions({ kpo: [selectedKpo.selectedKpo] })
          : await fetchSubmissions();
        const genderdata = calculateKPOGenderDistribution(data);
        setData(genderdata);
      }
    };
    fetchGenderData();
  }, [selectedKpo]);

  const safeGenderDistribution = data || {
    categories: [],
    series: [],
    total: 0,
    percentages: [],
  };

  const transformedData = useMemo(() => {
    return safeGenderDistribution.categories
      .map((category: any, index: any) => ({
        name: category,
        value: safeGenderDistribution.series[index],
        percentage: safeGenderDistribution.percentages[index],
      }))
      .filter((item: any) => item.value > 0);
  }, [safeGenderDistribution]);

  const handleDownload = async (format: "png" | "svg" | "csv") => {
    if (!chartRef.current) return;

    const chartTitle = "Gender_Distribution_Chart";

    if (format === "csv") {
      const headers = ["Gender", "Count", "Percentage"];
      const csvRows = [
        headers.join(","),
        ...transformedData.map((row: any) => 
          `"${row.name}",${row.value},${row.percentage?.toFixed(2) || 0}`
        ),
      ].join("\n");

      const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${chartTitle}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
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

  if (!data || transformedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
          No data available for Gender chart.
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, percentage } = payload[0].payload;
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
          <p>Count: {value}</p>
          <p>Percentage: {percentage?.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  const legendFormatter = (value: string) => {
    const dataEntry = transformedData.find((item: any) => item.name === value);
    const textColor = isDarkMode ? "#D1D5DB" : "#333";
    return (
      <span style={{ color: textColor }}>
        {`${value} - ${dataEntry?.value || 0} (${dataEntry?.percentage?.toFixed(1) || 0}%)`}
      </span>
    );
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
          <PieChart>
            <Pie
              data={transformedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              dataKey="value"
              label={({ percent, name, x, y, cx: pieCx }) => {
                const actualValue =
                  transformedData.find((item: any) => item.name === name)?.value || 0;

                if (typeof percent !== "number") return null;

                const percentage = (percent * 100).toFixed(1);
                let labelText = "";

                if (actualValue > 0 && parseFloat(percentage) >= 1) {
                  labelText = `${percentage}%`;
                } else if (actualValue > 0 && parseFloat(percentage) > 0) {
                  labelText = `<${percentage}%`;
                }

                if (labelText) {
                  return (
                    <Text
                      key={`label-${name}`}
                      x={x}
                      y={y}
                      fill={isDarkMode ? "#D1D5DB" : "#333"}
                      textAnchor={x > pieCx ? "start" : "end"}
                      dominantBaseline="central"
                      fontSize={12}
                    >
                      {labelText}
                    </Text>
                  );
                }
                return null;
              }}
            >
              {transformedData.map((entry: any, index: any) => (
                <Cell
                  key={`cell-${index}`}
                  fill={GENDER_COLORS[index % GENDER_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: "10px" }}
              iconType="circle"
              formatter={legendFormatter}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}