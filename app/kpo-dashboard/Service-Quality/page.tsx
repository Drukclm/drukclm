"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";

import useAuthStore from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";

import { fetchSubmissions } from "../../utils/fetchProcessSubmission";
import { getServiceQualityStats } from "../../utils/fetchKpoDetails";

import QualityCard from "./components/QualityCard";
import ServiceQualityChart from "./components/ServiceQualityChart";
import ServiceQualityTable from "./components/ServiceQualityTable";

const metrics = [
  "Items Received",
  "Received All Information",
  "Questions Answered",
];

// ---------- KPO Mappings ----------
const kpoDisplayNamesMap: Record<string, string> = {
  overall: "Overall",
  lhak_sam: "Lhak-sam",
  chithuen_phendhey: "CPA",
  pride_bhutan: "Pride Bhutan",
  red_purse_network: "Red Purse Network",
  others: "Others",
};
const allKpos = Object.keys(kpoDisplayNamesMap);

const normalizeKpoKey = (label: string) => {
  const key = label.trim().toLowerCase().replace(/\s+/g, "_");
  const map: Record<string, string> = {
    lhak_sam: "lhak_sam",
    "lhak-sam": "lhak_sam",
    chithuen_phendhey: "chithuen_phendhey",
    cpa: "chithuen_phendhey",
    pride_bhutan: "pride_bhutan",
    "pride bhutan": "pride_bhutan",
    red_purse_network: "red_purse_network",
    "red purse network": "red_purse_network",
    others: "others",
  };
  return map[key] || key;
};

const ServiceQualityPage = () => {
  const { profile, loading: authLoading } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  const currentUserRole = profile?.role || "";
  const initialKpo = profile?.kpo_name
    ? normalizeKpoKey(profile.kpo_name)
    : "overall";

  const [selectedKpo, setSelectedKpo] = useState(
    currentUserRole === "admin" ? "overall" : initialKpo
  );

  const [loading, setLoading] = useState(true);
  const [tableByFacility, setTableByFacility] = useState<any[]>([]);
  const [tableByGender, setTableByGender] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(()=>{
    if(profile?.role==="admin"){
      setSelectedKpo("overall")
        
    }
    if (profile?.kpo_name) {
      setSelectedKpo(
        normalizeKpoKey(profile.kpo_name)
      );
    }
  },[profile,authLoading])

  // ---------- Fetch + Process ----------
  useEffect(() => {
    const fetchAndProcess = async () => {
      setLoading(true);
      try {
        const submissions = await fetchSubmissions({
          kpo: selectedKpo === "overall" ? undefined : [selectedKpo],
        });

        const stats = await getServiceQualityStats(submissions);

        setTableByFacility(stats.tableByFacility);
        setTableByGender(stats.tableByGender);
        setChartData(stats.chart);
      } catch (err) {
        console.error(
          "Error fetching or processing service quality data:",
          err
        );
        setTableByFacility([]);
        setTableByGender([]);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcess();
  }, [selectedKpo, profile]);

  // ---------- Loading ----------
  if (loading) {
    return (
      <div
        className={clsx(
          "flex justify-center items-center min-h-[400px]",
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        )}
      >
        Loading service quality data...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1
        className={clsx(
          "text-3xl font-bold mb-4",
          isDarkMode ? "text-white" : "text-gray-900"
        )}
      >
        Service Quality Dashboard
      </h1>

      {/* ---------- Admin KPO Selector ---------- */}
      {currentUserRole === "admin" && (
        <div className="mb-6">
          <label
            className={clsx(
              "mr-2 font-semibold",
              isDarkMode ? "text-gray-200" : "text-gray-900"
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
            {allKpos.map((kpo) => (
              <option key={kpo} value={kpo}>
                {kpoDisplayNamesMap[kpo]}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ---------- Cards ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {chartData.map((card: any) => (
          <QualityCard
            key={card.key}
            title={card.label}
            yesCount={card.yes}
            noCount={card.no}
          />
        ))}
      </div>

      {/* ---------- Chart ---------- */}
      <div className="mb-8">
        <ServiceQualityChart data={chartData} />
      </div>

      {/* ---------- Table by Facility ---------- */}
      <div className="mb-8">
        <h2
          className={clsx(
            "text-xl font-semibold mb-2",
            isDarkMode ? "text-gray-200" : "text-gray-900"
          )}
        >
          Table by Facility
        </h2>
        <ServiceQualityTable data={tableByFacility} metrics={metrics} isDarkMode={isDarkMode}/>
      </div>

      {/* ---------- Table by Gender ---------- */}
      <div className="mb-8">
        <h2
          className={clsx(
            "text-xl font-semibold mb-2",
            isDarkMode ? "text-gray-200" : "text-gray-900"
          )}
        >
          Table by Gender
        </h2>
        <ServiceQualityTable data={tableByGender} metrics={metrics} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default ServiceQualityPage;
