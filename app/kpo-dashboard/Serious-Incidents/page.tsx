"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";

import useAuthStore from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";

import { fetchSubmissions } from "../../utils/fetchProcessSubmission";
import { getSeriousIncidentStats } from "../../utils/fetchKpoDetails";

import SeriousIncidentChart from "./components/SeriousIncidentChart";
import SeriousIncidentTable from "./components/SeriousIncidentTable";

const incidentLabels = [
  { key: "Stigma & Discrimination", label: "Stigma & Discrimination" },
  { key: "Violence", label: "Violence" },
  { key: "Harassment", label: "Harassment" },
  { key: "Privacy", label: "Privacy" },
  { key: "Confidentiality", label: "Confidentiality" },
  { key: "Refused Services", label: "Refused Services" },
  { key: "Pain or Distress", label: "Pain or Distress" },
  { key: "Other", label: "Other" },
];

const SeriousIncidentsPage = () => {
  const { profile,loading: authLoading } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  const currentUserRole = profile?.role || "";
  // Ensure initialKpo is normalized for consistency, though 'overall' is a special case
  const initialKpo =
    profile?.kpo_name?.toLowerCase().replace(/\s+/g, "_") || "overall";

  const [selectedKpo, setSelectedKpo] = useState(
    currentUserRole === "admin" ? "overall" : initialKpo
  );

  const [submissions, setSubmissions] = useState<any[]>([]); // All submissions for the selected KPO
  const [tableByFacility, setTableByFacility] = useState<any[]>([]);
  const [tableByGender, setTableByGender] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role === "admin") {
      setSelectedKpo("overall")
    }
    if (profile?.kpo_name) {
      setSelectedKpo(
        currentUserRole === "admin" ? "overall" : initialKpo);
    }
  },[authLoading,profile])

  useEffect(() => {
    const fetchAndProcess = async () => {
      setLoading(true);
      try {
        const data = await fetchSubmissions({
          kpo: selectedKpo === "overall" ? undefined : [selectedKpo],
        });

        const stats = await getSeriousIncidentStats(data);

        setSubmissions(data); // Store the filtered submissions here
        setTableByFacility(stats.tableByFacility);
        setTableByGender(stats.tableByGender);
        setChartData(stats.chart);
      } catch (err) {
        console.error("Error fetching serious incident data:", err);
        setSubmissions([]);
        setTableByFacility([]);
        setTableByGender([]);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAndProcess();
  }, [selectedKpo, profile]); // Add profile to dependencies to react to login/logout

  if (loading) {
    return (
      <div
        className={clsx(
          "flex justify-center items-center h-full min-h-[400px]",
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
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
            Loading serious incident data...
          </p>
        </div>
      </div>
    );
  }

  // --- KPO Display Names Map (for dropdown and headers) ---
  const kpoDisplayNamesMap: Record<string, string> = {
    overall: "Overall", // Added for the "overall" option
    lhak_sam: "Lhak-sam",
    chithuen_phendhey: "CPA",
    pride_bhutan: "Pride Bhutan",
    red_purse_network: "Red Purse Network", // Corrected key for consistency
    others: "Others",
  };

  // Helper to get the display name for the current selectedKpo
  const getSelectedKpoDisplayName = () => {
    return kpoDisplayNamesMap[selectedKpo] || selectedKpo.toUpperCase();
  };

  const hasIncidentData =
    chartData.length > 0 && chartData.some((c) => c.count > 0);
  const hasTableData = tableByFacility.length > 0 || tableByGender.length > 0;

  return (
    <div>
      <h1
        className={clsx(
          "text-3xl font-bold mb-2",
          isDarkMode ? "text-white" : "text-gray-900"
        )}
      >
        Serious Incidents Dashboard
      </h1>

      <h2
        className={clsx(
          "text-xl font-semibold mb-6",
          isDarkMode ? "text-gray-300" : "text-gray-700"
        )}
      >
        {getSelectedKpoDisplayName()}
      </h2>

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
            {Object.entries(kpoDisplayNamesMap).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Conditional rendering for no data */}
      {!hasIncidentData && !hasTableData ? (
        <p
          className={clsx(
            "text-center mt-8 text-lg",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}
        >
          No serious incident data available for {getSelectedKpoDisplayName()}.
          This may be because there are no submissions or no incidents were
          reported.
        </p>
      ) : (
        <>
          {/* Chart */}
          <div
            className={clsx(
              "mt-8 p-4 rounded-lg shadow-md h-96",
              isDarkMode
                ? "bg-gray-700 border border-gray-600"
                : "bg-white border border-gray-300"
            )}
          >
            {chartData.length > 0 ? (
              <SeriousIncidentChart
                data={chartData}
                isDarkMode={isDarkMode}
                chartTitle={`Serious Incidents - ${getSelectedKpoDisplayName()}`}
              />
            ) : (
              <p
                className={clsx(
                  "text-center mt-6",
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                )}
              >
                No serious incident chart data available.
              </p>
            )}
          </div>

          {/* Table: By Facility */}
          <h3
            className={clsx(
              "mt-10 mb-2 text-xl font-semibold",
              isDarkMode ? "text-white" : "text-gray-900"
            )}
          >
            By Facility
          </h3>
          <SeriousIncidentTable
            data={tableByFacility}
            totalN={submissions.length}
            incidentLabels={incidentLabels}
            isDarkMode={isDarkMode}
            mainColumnKey="name" // Pass 'name' to display facility names
            mainColumnHeader="Facility" // Header text for the column
          />

          {/* Table: By Gender */}
          <h3
            className={clsx(
              "mt-10 mb-2 text-xl font-semibold",
              isDarkMode ? "text-white" : "text-gray-900"
            )}
          >
            By Gender
          </h3>
          <SeriousIncidentTable
            data={tableByGender}
            totalN={submissions.length}
            incidentLabels={incidentLabels}
            isDarkMode={isDarkMode}
            mainColumnKey="gender" // Pass 'gender' to display gender types
            mainColumnHeader="Category" // Header text for the column
          />
        </>
      )}
    </div>
  );
};

export default SeriousIncidentsPage;
