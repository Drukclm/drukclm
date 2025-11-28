"use client";

import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import { useThemeStore } from "../store/themeStore"; 
import { getKpoReport } from "../utils/fetchKpoDetails";
import DashboardGrid from "./components/dashboard/DashboardGrid";

const kpoDisplayNamesMap: Record<string, string> = {
  lhak_sam: "LhakSam",
  chithuen_phendhey: "CPA",
  pride_bhutan: "PrideBhutan",
  red_purse_network: "RPN",
  others: "Others",
  all_kpos: "All KPOs",
};

const normalizeKpoKey = (label: string) => {
  const key = label.trim().toLowerCase().replace(/\s+/g, "_");
  const map: Record<string, string> = {
    lhak_sam: "lhak_sam",
    chithuen_phendhey: "chithuen_phendhey",
    pride_bhutan: "pride_bhutan",
    red_purse_network: "red_purse_network",
    others: "others",
    cpa: "chithuen_phendhey",
  };
  return map[key] || key;
};

const allKpos = Object.keys(kpoDisplayNamesMap);

export default function KpoDashboard() {
  const { profile, loading } = useAuthStore();
  const { isDarkMode } = useThemeStore(); // ✅ dark/light mode flag
  const [selectedKpo, setSelectedKpo] = useState("loading");

  useEffect(() => {
    if(profile?.role === "admin") setSelectedKpo("all_kpos");
    
    else if (profile?.kpo_name) {
      setSelectedKpo(
        normalizeKpoKey(profile.kpo_name)
      );
    }

  }, [profile, loading]);


  if (loading|| !profile)
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Loading Dashboard...</h1>
      </div>
    );

  if (!profile)
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Redirecting...</h1>
        <p className="mt-2">
          You have been logged out or your session expired.
        </p>
      </div>
    );




  return (


    <div className="p-6">

      <h1 className="text-4xl font-bold mb-6 text-center">Dashboard</h1>

      {/* --- Admin KPO selector dropdown --- */}
      {profile.role === "admin" && (
        <div className="mb-6 flex items-center justify-center gap-2">
          <label
            className={`font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-700"
              }`}
          >
            Select KPO:
          </label>
          <select
            className={`px-3 py-1 border rounded transition-colors duration-200
              ${isDarkMode
                ? "bg-slate-800 border-slate-600 text-slate-200"
                : "bg-white border-slate-300 text-slate-800"
              }`}
            value={selectedKpo}
            onChange={(e) => setSelectedKpo(e.target.value)}
          >
            {allKpos.map((kpoKey) => (
              <option
                key={kpoKey}
                value={kpoKey}
                className={
                  isDarkMode
                    ? "bg-slate-800 text-slate-200"
                    : "bg-white text-slate-800"
                }
              >
                {kpoDisplayNamesMap[kpoKey]}
              </option>
            ))}
          </select>
        </div>
      )}
{!loading && selectedKpo!=="loading" && (
      <DashboardGrid
        // totalParticipation={dashboardData.totalParticipation}
        // weeklyParticipation={dashboardData.weeklyParticipation}
        // kpoCount={dashboardData.kpoCount}
        // serviceAvailability={dashboardData.serviceAvailability}
        // accessibilityData={dashboardData.accessibilityData}
        // qualityMetrics={dashboardData.qualityMetrics}
        // respectfulTreatment={dashboardData.respectfulTreatment}
        // consentSought={dashboardData.consentSought}
        // dzongkhagChartData={dashboardData.dzongkhagChartData}
        kpoName={selectedKpo}
      // selectedKpo={selectedKpo}
      />)}
    </div>

  );
}
