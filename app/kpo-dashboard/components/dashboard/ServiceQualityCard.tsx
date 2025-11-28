"use client";

import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import {
  fetchSubmissions,
  calculateServiceAcceptability,
} from "../../../utils/fetchProcessSubmission";

import { useThemeStore } from "../../../store/themeStore";
import clsx from "clsx";

interface QualityMetric {
  label: string;
  responses: number;
  percentage: number;
}

interface Props {
  kpo?: string;
}

export default function ServiceQualityCard({ kpo }: Props) {
  const { isDarkMode } = useThemeStore();
  const [metrics, setMetrics] = useState<QualityMetric[]>([]);
  const [loading, setLoading] = useState(true);

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
        const result = calculateServiceAcceptability(submissions);
        const qualityMetrics = result.quality.aspects.map(
          (label: string, idx: number) => ({
            label,
            responses: result.quality.yes[idx] + result.quality.no[idx],
            percentage: result.quality.yesPercent[idx],
          })
        );
        setMetrics(qualityMetrics);
      } catch (err) {
        console.error("Error fetching service quality data:", err);
        setMetrics([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [kpo]);

  if (loading)
    return (
      <DashboardCard title="Service Quality">
        <p className="text-gray-400">Loading...</p>
      </DashboardCard>
    );

  if (!metrics.length)
    return (
      <DashboardCard title="Service Quality">
        <p className="text-gray-400">No data available</p>
      </DashboardCard>
    );

  return (
    <DashboardCard title="Service Quality">
      <div className="flex flex-col space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <span
                className={clsx(
                  "text-sm",
                  isDarkMode ? "text-slate-300" : "text-slate-700"
                )}
              >
                {metric.label} ({metric.responses} responses)
              </span>
              <span
                className={clsx(
                  "text-sm font-semibold",
                  isDarkMode ? "text-white" : "text-black"
                )}
              >
                {metric.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className={clsx(
                  "h-2.5 rounded-full",
                  isDarkMode ? "bg-cyan-500" : "bg-orange-500"
                )}
                style={{ width: `${metric.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
