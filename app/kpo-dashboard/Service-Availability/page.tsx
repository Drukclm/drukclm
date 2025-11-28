"use client"; // Required for Next.js client-side rendering

import React, { useState, useEffect, useMemo } from "react";
import clsx from "clsx";

import useAuthStore from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";

import ServiceAvailabilityChart from "./components/ServiceAvailabilityChart";
import ServiceAvailabilityTable from "./components/ServiceAvailabilityTable";

import { fetchSubmissions } from "../../utils/fetchProcessSubmission";
import { getKpoServiceAvailabilityStats } from "../../utils/fetchKpoDetails";

// ------------------------------
// Helper Functions
// ------------------------------

// Check if table data has any meaningful numbers
const hasMeaningfulServiceData = (data: any[]) =>
  data.some((row) => row.sought > 0 || row.received > 0);

// Normalize user-facing KPO name (like "CPA" or "Pride Bhutan") into internal key
// Example: "CPA" → "chithuen_phendhey"
const normalizeKpoKey = (label: string) => {
  const key = label.trim().toLowerCase().replace(/\s+/g, "_");

  const map: Record<string, string> = {
    lhak_sam: "lhak_sam",
    chithuen_phendhey: "chithuen_phendhey",
    pride_bhutan: "pride_bhutan",
    red_purse_network: "red_purse_network",
    others: "others",
    // "lhak-sam": "lhak_sam",
    cpa: "chithuen_phendhey",
    overall: "all_kpos",
    // "pride bhutan": "pride_bhutan",
    // "red purse network": "red_purse_network",
  };

  return map[key] || key;
};

// ------------------------------
// Main Component
// ------------------------------
const ServiceAvailabilityPage = () => {
  const { profile, loading: profileLoading } = useAuthStore(); // Current logged-in user profile
  const { isDarkMode } = useThemeStore(); // Dark/light mode toggle

  const currentUserRole = profile?.role || "";
  const initialKpoFromProfile = profile?.kpo_name
    ? normalizeKpoKey(profile.kpo_name)
    : "";

  // If user is admin → default to "lhak_sam", else use their own KPO

  const [selectedKpo, setSelectedKpo] = useState(
    ""
  );

  useEffect(()=>{
    if(profile?.role==="admin"){
      setSelectedKpo("admin")
        
    }
    if (profile?.kpo_name) {
      setSelectedKpo(
        normalizeKpoKey(profile.kpo_name)
      );
    }
  },[profileLoading,profile])

  // State to hold processed data
  const [tableData, setTableData] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallKpoScore, setOverallKpoScore] = useState<number>(0);

  // Map internal keys → display names
  const kpoDisplayNamesMap = useMemo(
    () => ({
      lhak_sam: "Lhak-sam",
      chithuen_phendhey: "CPA",
      pride_bhutan: "Pride Bhutan",
      red_purse_network: "Red Purse Network",
      others: "Others",
      admin: "All KPOs",
    }),
    []
  );

  // List of all KPO keys (used for admin dropdown)
  const allKpos = useMemo(
    () => Object.keys(kpoDisplayNamesMap),
    [kpoDisplayNamesMap]
  );

  // ------------------------------
  // Fetch & process submissions
  // ------------------------------
  useEffect(() => {
    async function fetchAndProcess() {
      if (!profile) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch raw form submissions
        const submissions = await fetchSubmissions();

        // Use normalized key for selected KPO
        const kpoKey = selectedKpo;

        // Process data for this KPO
        const stats = getKpoServiceAvailabilityStats(submissions, kpoKey);

        // Update table
        setTableData(stats.table);

        // Transform table data → graph data
        setGraphData(
          stats.table.map((row) => ({
            label: row?.label || "Unknown",
            soughtCount: row?.sought ?? 0,
            receivedCount: row?.received ?? 0,
          })) ?? []
        );

        // Calculate overall availability score (percentage received vs sought)
        const totalSought = stats.table.reduce(
          (sum, row) => sum + (row.sought ?? 0),
          0
        );
        const totalReceived = stats.table.reduce(
          (sum, row) => sum + (row.received ?? 0),
          0
        );
        setOverallKpoScore(
          totalSought > 0 ? (totalReceived / totalSought) * 100 : 0
        );
      } catch (err) {
        console.error("Error fetching submissions:", err);
        // Reset state in case of error
        setTableData([]);
        setGraphData([]);
        setOverallKpoScore(0);
      } finally {
        setLoading(false);
      }
    }

    fetchAndProcess();
  }, [profile, selectedKpo]); // Refetch whenever KPO selection changes

  // ------------------------------
  // Loading state UI
  // ------------------------------
  if (loading || !profile) {
    return (
      <div
        className={clsx(
          "flex justify-center items-center h-full min-h-[400px]",
          isDarkMode
            ? "bg-gradient-to-br from-[#2a1a4f] to-[#1a0f2c]"
            : "bg-gradient-to-br from-gray-100 to-gray-200"
        )}
      >
        <div className="flex flex-col items-center">
          <div
            className={clsx(
              "animate-spin rounded-full h-12 w-12 border-b-2",
              isDarkMode ? "border-orange-500" : "border-blue-500"
            )}
          ></div>
          <p
            className={clsx(
              "ml-4 mt-4",
              isDarkMode ? "text-gray-300" : "text-gray-800"
            )}
          >
            {profile === null
              ? "Please log in to view data."
              : "Loading service availability data..."}
          </p>
        </div>
      </div>
    );
  }

  // ------------------------------
  // No data state UI
  // ------------------------------
  // if (!tableData.length || !hasMeaningfulServiceData(tableData)) {
  //   return (
  //     <div
  //       className={clsx(
  //         "p-8 min-h-screen",
  //         isDarkMode
  //           ? "bg-gradient-to-br from-[#2a1a4f] to-[#1a0f2c]"
  //           : "bg-gradient-to-br from-gray-100 to-gray-200"
  //       )}
  //     >
  //       <h2
  //         className={clsx(
  //           "text-3xl font-bold mb-4",
  //           isDarkMode ? "text-white" : "text-gray-900"
  //         )}
  //       >
  //         Service Availability -{" "}
  //         {kpoDisplayNamesMap[selectedKpo as keyof typeof kpoDisplayNamesMap] || selectedKpo}        </h2>
  //       <p
  //         className={clsx(
  //           "text-lg mb-8",
  //           isDarkMode ? "text-gray-300" : "text-gray-800"
  //         )}
  //       >
  //         No service availability data available.
  //       </p>
  //     </div>
  //   );
  // }

  // ------------------------------
  // Main render (with data)
  // ------------------------------
  return (
    <div>
      <h2
        className={clsx(
          "text-3xl font-bold mb-4",
          isDarkMode ? "text-white" : "text-gray-900"
        )}
      >
        Service Availability
      </h2>

      {/* Admins can switch KPOs */}
      {currentUserRole === "admin" && (
        <div className="mb-6">
          <label
            className={clsx(
              "mr-2 font-semibold",
              isDarkMode ? "text-gray-200" : "text-gray-800"
            )}
          >
            Select KPO:
          </label>
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
            {allKpos.map((kpoKey) => (
              <option key={kpoKey} value={kpoKey}>
                {kpoDisplayNamesMap[kpoKey as keyof typeof kpoDisplayNamesMap]}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Service Availability Table */}
      <ServiceAvailabilityTable
        data={tableData}
        title={`Service Availability - ${kpoDisplayNamesMap[selectedKpo as keyof typeof kpoDisplayNamesMap] || selectedKpo}`}
        loading={loading}
        overallScore={overallKpoScore}
        selectedKpo={selectedKpo}
      />

      {/* Service Availability Chart */}
      <div
        className={clsx(
          "mt-8 p-4 rounded-lg shadow-md h-96",
          isDarkMode
            ? "bg-gray-700 border border-gray-600"
            : "bg-white border border-gray-300"
        )}
      >
        {graphData.length > 0 && hasMeaningfulServiceData(tableData) ? (
          <ServiceAvailabilityChart
            rawData={graphData}
            loading={loading}
            chartTitle={`Health Services Comparison - ${kpoDisplayNamesMap[selectedKpo as keyof typeof kpoDisplayNamesMap] || selectedKpo}`}
          />
        ) : (
          <p
            className={clsx(
              "text-center mt-6",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}
          >
            No chart data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default ServiceAvailabilityPage;
