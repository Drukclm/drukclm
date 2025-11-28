"use client";

import React, { useEffect, useState, useMemo } from "react";
import clsx from "clsx";

import useAuthStore from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { fetchSubmissions } from "../../utils/fetchProcessSubmission";
import WaitingTimeLineChart from "./components/WaitingTImeLineChart";

const WaitingTimePage = () => {
  const { profile, loading: authLoading } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  const currentUserRole = profile?.role || "";
  const initialKpo =
    profile?.kpo_name?.toLowerCase().replace(/\s+/g, "_") || "overall";

  const [selectedKpo, setSelectedKpo] = useState("");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (profile?.role === "admin") {
      setSelectedKpo("overall")

    }
    if (profile?.kpo_name) {
      setSelectedKpo(
        currentUserRole === "admin" ? "overall" : initialKpo);
    }
  }, [authLoading, profile])

  useEffect(() => {
    const fetchAndProcess = async () => {
      setLoading(true);
      try {
        const data = await fetchSubmissions({
          kpo: selectedKpo === "overall" ? undefined : [selectedKpo],
        });
        setSubmissions(data);
      } catch (err) {
        console.error("Error fetching waiting time data:", err);
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcess();
  }, [selectedKpo, profile]);

  // --- PROCESS SUBMISSIONS FOR CHART DATA ---
  const waitingTimeChartData = useMemo(() => {
    const waitTimes: number[] = [];

    submissions.forEach((s) => {
      const val = parseInt(s.answers?.["16"], 10);
      if (!isNaN(val) && val > 0) waitTimes.push(val);
    });

    const counts: Record<number, number> = {};
    waitTimes.forEach((wt) => (counts[wt] = (counts[wt] || 0) + 1));

    const min = Math.min(...waitTimes, 1);
    const max = Math.max(...waitTimes, 1);

    const chartArray: { x: number; y: number }[] = [];
    for (let minute = min; minute <= max; minute++) {
      chartArray.push({ x: minute, y: counts[minute] || 0 });
    }

    return chartArray;
  }, [submissions]);

  if (loading) {
    return (
      <div
        className={clsx(
          "flex justify-center items-center h-full min-h-[400px]",
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        )}
      >
        Loading waiting time data...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1
        className={clsx(
          "text-3xl font-bold mb-2",
          isDarkMode ? "text-white" : "text-gray-900"
        )}
      >
        Waiting Time Dashboard
      </h1>
      <h2
        className={clsx(
          "text-xl font-semibold mb-6",
          isDarkMode ? "text-gray-300" : "text-gray-700"
        )}
      >
        {selectedKpo.toUpperCase()} KPO
      </h2>

      {/* Admin KPO Selector */}
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
            <option value="overall">Overall</option>
            <option value="lhak_sam">LhakSam</option>
            <option value="chithuen_phendhey">CPA</option>
            <option value="pride_bhutan">PrideBhutan</option>
            <option value="red_purse_network">RPN</option>
            <option value="others">Others</option>
          </select>
        </div>
      )}

      {/* Waiting Time Chart */}
      <div
        className={clsx(
          "mt-8 p-4 rounded-lg shadow-md h-96",
          isDarkMode
            ? "bg-gray-700 border border-gray-600"
            : "bg-white border border-gray-300"
        )}
      >
        {waitingTimeChartData.length > 0 ? (
          <WaitingTimeLineChart
            chartData={waitingTimeChartData} // <-- processed data passed here
            isDarkMode={isDarkMode}
            chartTitle={`Waiting Time Distribution - ${selectedKpo.toUpperCase()}`}
          />
        ) : (
          <p
            className={clsx(
              "text-center mt-6",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}
          >
            No waiting time data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default WaitingTimePage;
