"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";

import useAuthStore from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { fetchSubmissions } from "../../utils/fetchProcessSubmission";
import { getServiceAcceptabilityStats } from "../../utils/fetchKpoDetails";

import GenderTable from "./components/GenderTable";
import FacilityTable from "./components/FacilityTable";
import OverAllChart from "./components/OverAllChart";

const kpoDisplayNamesMap: Record<string, string> = {
  overall: "Overall",
  lhak_sam: "LhakSam",
  chithuen_phendhey: "CPA",
  pride_bhutan: "Pride Bhutan",
  red_purse_network: "Red Purse Network",
  others: "Others",
};

const allKpos = Object.keys(kpoDisplayNamesMap);

const ServiceAcceptabilityPage = () => {
  const { profile } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  const currentUserRole = profile?.role || "";
  const initialKpoFromProfile = profile?.kpo_name?.toLowerCase() || "";

  const [selectedKpo, setSelectedKpo] = useState("");
  //currentUserRole === "admin" ? "overall" : initialKpoFromProfile
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    setSelectedKpo(
      currentUserRole === "admin" ? "overall" : initialKpoFromProfile
    );
  },[profile])

  useEffect(() => {
    const fetchAndProcess = async () => {
      setLoading(true);
      try {
        const submissions = await fetchSubmissions({
          kpo: selectedKpo === "overall" ? undefined : [selectedKpo],
        });

        const stats = await getServiceAcceptabilityStats(submissions);
        setSummary(stats);
      } catch (err) {
        console.error("Error fetching acceptability data:", err);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcess();
  }, [selectedKpo, profile]);

  if (loading)
    return (
      <div
        className={clsx(
          "flex justify-center items-center h-full min-h-[400px]",
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        )}
      >
        Loading service acceptability data...
      </div>
    );

  if (!summary)
    return (
      <div
        className={clsx(
          "p-8 min-h-screen",
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        )}
      >
        No data available.
      </div>
    );

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1
        className={clsx(
          "text-2xl font-bold mb-4",
          isDarkMode ? "text-white" : "text-gray-900"
        )}
      >
        Service Acceptability - {kpoDisplayNamesMap[selectedKpo]}
      </h1>

      {currentUserRole === "admin" && (
        <div className="mb-6">
          <label className="mr-2 font-semibold">Select KPO:</label>
          <select
            value={selectedKpo}
            onChange={(e) => setSelectedKpo(e.target.value)}
            className={clsx(
              "px-3 py-1 rounded border",
              isDarkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-300"
            )}
          >
            {allKpos.map((kpo) => (
              <option key={kpo} value={kpo}>
                {kpoDisplayNamesMap[kpo]}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* --- Render the three separate components --- */}
      <div className="space-y-8">
        <div className="p-4 border rounded shadow">
          <h2
            className={clsx(
              "text-xl font-semibold mb-2",
              isDarkMode ? "text-white" : "text-gray-900"
            )}
          >
            Facility-wise Service Acceptability
          </h2>
          <FacilityTable
            data={summary.tableByFacility}
            isDarkMode={isDarkMode}
          />
        </div>

        <div className="p-4 border rounded shadow">
          <h2
            className={clsx(
              "text-xl font-semibold mb-2",
              isDarkMode ? "text-white" : "text-gray-900"
            )}
          >
            Gender-wise Service Acceptability
          </h2>
          <GenderTable data={summary.tableByGender} isDarkMode={isDarkMode} />
        </div>

        <div className="p-4 border rounded shadow">
          <h2
            className={clsx(
              "text-xl font-semibold mb-2",
              isDarkMode ? "text-white" : "text-gray-900"
            )}
          >
            Overall Summary
          </h2>
          <OverAllChart data={summary.chart} isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};

export default ServiceAcceptabilityPage;
