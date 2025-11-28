// app/components/dashboard/DzongkhagChart.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import DashboardCard from "./DashboardCard";
import { useThemeStore } from "../../../store/themeStore";
import {
  calculateDzongkhagDistribution,
  fetchDzongkhags,
} from "../../../utils/fetchKpoDetails";
import { fetchSubmissions } from "../../../utils/fetchProcessSubmission";
// ---------------- Interfaces ----------------
interface DzongkhagChartData {
  id: string;
  value: number;
}
interface Props {
  kpo?: string; // optional KPO filter
}

// ---------------- Component -----------------
export default function DzongkhagChart({ kpo }: Props) {
  const { isDarkMode } = useThemeStore();
  const [dzongkhagChartData, setDzongkhagChartData] = useState<
    DzongkhagChartData[]
  >([]);
  const [loading, setLoading] = useState(true);

  const barColor = isDarkMode ? "fill-cyan-500" : "fill-orange-500";
  const barHoverColor = isDarkMode
    ? "hover:fill-cyan-400"
    : "hover:fill-orange-400";
  const titleColor = isDarkMode ? "text-slate-400" : "text-slate-500";
  const axisTextColor = isDarkMode ? "text-slate-400" : "text-slate-600";
  const gridLineColor = isDarkMode ? "stroke-slate-700" : "stroke-gray-200";

  // Tooltip state
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({ visible: false, x: 0, y: 0, content: "" });

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch + calculate data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let submissions;
        if (kpo === "all_kpos") {
          submissions = await fetchSubmissions();
        }
        else {
          submissions = await fetchSubmissions({
            kpo: kpo ? [kpo] : undefined,
          });
        }
        const dzongkhags = await fetchDzongkhags();
        const distribution = calculateDzongkhagDistribution(
          submissions,
          dzongkhags
        );

        const chartData = distribution.details.map((d) => ({
          id: d.dzongkhag,
          value: d.count,
        }));

        setDzongkhagChartData(chartData);
      } catch (err) {
        console.error("Error fetching Dzongkhag chart data:", err);
        setDzongkhagChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kpo]);

  if (loading) {
    return (
      <DashboardCard>
        <div className="p-6 flex items-center justify-center h-64 md:h-80 lg:h-96">
          <p className={`text-lg ${titleColor}`}>Loading Dzongkhag data...</p>
        </div>
      </DashboardCard>
    );
  }

  if (!dzongkhagChartData || dzongkhagChartData.length === 0) {
    return (
      <DashboardCard>
        <div className="p-6 flex items-center justify-center h-64 md:h-80 lg:h-96">
          <p className={`text-lg ${titleColor}`}>
            No Dzongkhag data available.
          </p>
        </div>
      </DashboardCard>
    );
  }

  // Chart dimensions
  const maxValue = Math.max(...dzongkhagChartData.map((item) => item.value), 0);
  const yAxisTop = Math.ceil(maxValue / 5) * 5 || 5;
  const svgWidth = 100;
  const svgHeight = 60;
  const chartPadding = { top: 5, right: 5, bottom: 15, left: 10 };
  const chartWidth = svgWidth - chartPadding.left - chartPadding.right;
  const chartHeight = svgHeight - chartPadding.top - chartPadding.bottom;
  const barCount = dzongkhagChartData.length;
  const barAndSpaceMultiplier = 1.2;
  const barWidth = chartWidth / (barCount * barAndSpaceMultiplier);
  const barSpacing = barWidth * (barAndSpaceMultiplier - 1);
  const axisLabelFontSize = "1.5";

  return (
    <DashboardCard>
      <div className="p-4 sm:p-6 relative">
        <h3
          className={`text-center font-bold uppercase tracking-wider text-lg mb-6 ${titleColor}`}
        >
          Participation by Dzongkhag
        </h3>

        <div
          ref={containerRef}
          className="relative w-full h-64 md:h-80 lg:h-96 overflow-x-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className={`h-full ${axisTextColor} min-w-[600px] md:min-w-[800px] lg:min-w-[1200px]`}
          >
            {/* Y-axis grid lines */}
            {[...Array(6)].map((_, i) => {
              const y = chartPadding.top + (i * chartHeight) / 5;
              const yValue = yAxisTop - (i * yAxisTop) / 5;
              return (
                <g key={`y-axis-${i}`}>
                  <line
                    x1={chartPadding.left}
                    y1={y}
                    x2={svgWidth - chartPadding.right}
                    y2={y}
                    className={gridLineColor}
                    strokeWidth="0.2"
                  />
                  <text
                    x={chartPadding.left - 1}
                    y={y}
                    fontSize={axisLabelFontSize}
                    textAnchor="end"
                    alignmentBaseline="middle"
                  >
                    {yValue}
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {dzongkhagChartData.map((item, index) => {
              const barX =
                chartPadding.left +
                index * (barWidth + barSpacing) +
                barSpacing / 2;
              const barH = (item.value / yAxisTop) * chartHeight;
              const barY = chartPadding.top + chartHeight - barH;

              return (
                <g key={item.id}>
                  <rect
                    x={barX}
                    y={barY}
                    width={barWidth}
                    height={barH}
                    className={`${barColor} ${barHoverColor} transition-colors duration-200 cursor-pointer`}
                    onMouseEnter={(e) => {
                      if (containerRef.current) {
                        const rect =
                          containerRef.current.getBoundingClientRect();
                        setTooltip({
                          visible: true,
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                          content: `${item.id}: ${item.value}`,
                        });
                      }
                    }}
                    onMouseLeave={() =>
                      setTooltip({ ...tooltip, visible: false })
                    }
                  />
                  <text
                    x={barX + barWidth / 2}
                    y={svgHeight - chartPadding.bottom + 3}
                    fontSize={axisLabelFontSize}
                    fontWeight="bold"
                    textAnchor="end"
                    alignmentBaseline="middle"
                    transform={`rotate(-45, ${barX + barWidth / 2}, ${svgHeight - chartPadding.bottom + 3
                      })`}
                  >
                    {item.id}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          {tooltip.visible && (
            <div
              className="absolute bg-gray-800 text-white px-2 py-1 rounded text-sm pointer-events-none z-50"
              style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
            >
              {tooltip.content}
            </div>
          )}
        </div>
      </div>
    </DashboardCard>
  );
}
