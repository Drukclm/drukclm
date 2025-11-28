"use client";
import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import { getServiceAccessibilitySummary } from "../../../utils/fetchKpoDetails";
import { fetchSubmissions } from "../../../utils/fetchProcessSubmission";
import { useThemeStore } from "../../../store/themeStore";
import clsx from "clsx";

interface AccessibilityData {
  label: string;
  yes: number;
  no: number;
  yesPercent: number;
  noPercent: number;
  total: number;
}

export default function ServiceAccessibilityCard({ kpo }: { kpo?: string }) {
  const [data, setData] = useState<AccessibilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let submissions;
        if (kpo === "all_kpos") {
          submissions = await fetchSubmissions();
        } else {
          submissions = await fetchSubmissions({
            kpo: kpo ? [kpo] : undefined,
          });
        }

        const summary = getServiceAccessibilitySummary(submissions);
        setData(
          summary.details.map(({ label, yes, no, yesPercent, noPercent, total }) => ({
            label,
            yes,
            no,
            yesPercent,
            noPercent,
            total,
          }))
        );
      } catch (error) {
        console.error("Error fetching accessibility data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [kpo]);

  if (loading)
    return (
      <DashboardCard title="Service Accessibility">Loading...</DashboardCard>
    );

  if (data.length === 0)
    return (
      <DashboardCard title="Service Accessibility">
        No data available
      </DashboardCard>
    );

  const maxCount = Math.max(...data.flatMap((item) => [item.yes, item.no]));

  return (
    <DashboardCard title="Service Accessibility">
      <div className="flex flex-col space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center text-sm">
            {/* Label */}
            <div
              className={clsx(
                "w-32 flex-shrink-0",
                isDarkMode ? "text-slate-300" : "text-slate-700"
              )}
            >
              {item.label}
            </div>

            {/* Bars */}
            <div className="flex-grow ml-2">
              <div className="flex items-center h-6 space-x-1 relative">
                {/* Yes Bar */}
                {item.yes > 0 && (
                  <div
                    className="relative h-4 bg-teal-500 rounded-sm cursor-pointer transition-all hover:opacity-80 group"
                    style={{ width: `${(item.yes / maxCount) * 100}%`, minWidth: item.yes > 0 ? '30px' : '0' }}
                  >
                    {/* Percentage inside bar - only show if width is sufficient */}
                    { (
                      <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                      </span>
                    )}
                    
                    {/* Hover tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      Yes: {item.yes}
                    </div>
                  </div>
                )}

                {/* No Bar */}
                {item.no > 0 && (
                  <div
                    className="relative h-4 bg-blue-500 rounded-sm cursor-pointer transition-all hover:opacity-80 group"
                    style={{ width: `${(item.no / maxCount) * 100}%`, minWidth: item.no > 0 ? '30px' : '0' }}
                  >
                    
                    
                    {/* Hover tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      No: {item.no}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="flex justify-end pt-4 space-x-4">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-teal-500 rounded-full mr-1"></span>
            <span className={clsx(isDarkMode ? "text-white" : "text-black")}>
              Yes
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
            <span className={clsx(isDarkMode ? "text-white" : "text-black")}>
              No
            </span>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}