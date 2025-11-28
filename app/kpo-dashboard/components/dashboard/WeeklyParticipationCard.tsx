"use client";

import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { getweeklySubmissionsNumber } from "../../../utils/fetchKpoDetails";
import { useThemeStore } from "../../../store/themeStore";

interface WeeklyParticipationCardProps {
  selectedKpo: string; // passed from parent
}

export default function WeeklyParticipationCard({
  selectedKpo,
}: WeeklyParticipationCardProps) {
  console.log(selectedKpo);
  
  const { isDarkMode } = useThemeStore();
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  // console.log("bhsdbhdsvhsvh",selectedKpo)
  useEffect(() => {
    const fetchWeeklyData = async () => {
      setLoading(true);
      try {
        let kpo = selectedKpo
        if(selectedKpo ==="pride_bhutan") {
          kpo = "pride_Bhutan"
        }
        const weeklyCount = await getweeklySubmissionsNumber({
          kpo: kpo === "all_kpos" ? undefined : kpo,
        });
        setCount(weeklyCount);
      } catch (error) {
        console.error("Error fetching weekly submissions:", error);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyData();
  }, [selectedKpo]);

  return (
    <DashboardCard>
      <div className="flex justify-between items-center h-full">
        <div>
          <h3 className="text-gray-400 dark:text-slate-400">
            Weekly Participation
          </h3>
          <p className="text-7xl font-bold mt-1 text-gray-300 dark:text-slate-500">
            {loading ? "..." : count ?? "-"}
          </p>
          <p className="text-sm mt-2 text-gray-400 dark:text-slate-400">
            Based on last 7 days
          </p>
        </div>

        <div
          className={`p-3 rounded-full ${isDarkMode ? "bg-blue-700" : "bg-blue-600"
            }`}
        >
          <Check className="h-6 w-6 text-white" />
        </div>
      </div>
    </DashboardCard>
  );
}
