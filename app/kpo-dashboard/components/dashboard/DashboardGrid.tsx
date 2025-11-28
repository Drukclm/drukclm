"use client";

import React from "react";
import Header from "./DashboardHeader";
import TotalParticipationCard from "./TotalParticipationCard";
import WeeklyParticipationCard from "./WeeklyParticipationCard";
import ServiceAvailabilityCard from "./ServiceAvailabilityCard";
import ServiceAccessibilityCard from "./ServiceAccessibilityCard";
import ServiceAcceptabilityCard from "./ServiceAcceptabilityCard";
import ServiceQualityCard from "./ServiceQualityCard";
import BhutanMap from "./BhutanMap";
import DzongkhagChart from "./DzongkhagChart";
import { useThemeStore } from "../../../store/themeStore";

type DashboardGridProps = {
  kpoName: string; // only pass KPO name
};



export default function DashboardGrid({ kpoName }: DashboardGridProps) {
  const { isDarkMode } = useThemeStore();

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard Header */}
        <div className="lg:col-span-3 flex justify-center">
          <div className="w-full md:w-2/3 lg:w-1/3">
            <Header
            // kpoName={kpoName} 
            />
          </div>
        </div>

        {/* Cards: each fetches its own data */}
        <TotalParticipationCard kpo={kpoName} />
        <WeeklyParticipationCard selectedKpo={kpoName} />
        <ServiceAvailabilityCard kpo={kpoName} />
        <ServiceAccessibilityCard kpo={kpoName} />
        <ServiceAcceptabilityCard kpo={kpoName} />
        <ServiceQualityCard kpo={kpoName} />

        {/* Bhutan Map */}
        <div
          className={`lg:col-span-3 h-[70vh] rounded-xl shadow-md overflow-hidden flex flex-col ${isDarkMode
            ? "bg-slate-800 border border-slate-700"
            : "bg-orange-50 border border-orange-200/60"
            }`}
        >
          <h2
            className={`text-center font-bold text-xl md:text-2xl py-4 flex-shrink-0 ${isDarkMode ? "text-slate-100" : "text-slate-800"
              }`}
          >
            Dzongkhag Distribution
          </h2>
          <div className="flex-grow min-h-0">
            <BhutanMap
            kpo={kpoName} 
            />
          </div>
        </div>

        {/* Dzongkhag Chart */}
        <div className="lg:col-span-3">
          <DzongkhagChart
           kpo={kpoName} 
          />
        </div>
      </div>
    </div>
  );
}
