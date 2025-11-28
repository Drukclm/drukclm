"use client";

import React, { useState, useEffect } from "react";
import clsx from "clsx";

import useAuthStore from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";

import { fetchSubmissions } from "../../utils/fetchProcessSubmission";
import { getServiceAccessibilityStats } from "../../utils/fetchKpoDetails";

import AccessibilityCard from "./components/AccessibilityCard";
import ServiceAccessibilityTable from "./components/ServiceAccessibilityTable";

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

// ---------- Table Columns ----------
const accessibilityKeys = [
  "Safe Location",
  "Convenient Location",
  "Suitable Opening Hrs",
  "Service Affordability",
];

const ServiceAccessibilityPage = () => {
  const { profile, loading: authLoading } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  const currentUserRole = profile?.role || "";
  const initialKpo = profile?.kpo_name
    ? normalizeKpoKey(profile.kpo_name)
    : "overall";

  const [selectedKpo, setSelectedKpo] = useState("");

  useEffect(()=>{
    if(profile?.role==="admin"){
      setSelectedKpo("overall")
        
    }
    if (profile?.kpo_name) {
      setSelectedKpo(
        normalizeKpoKey(profile.kpo_name)
      );
    }
  },[authLoading,profile])
  const [cardsData, setCardsData] = useState<any[]>([]);
  const [tableByFacility, setTableByFacility] = useState<any[]>([]);
  const [tableByGender, setTableByGender] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------- Fetch + Process ----------
  useEffect(() => {
    const fetchAndProcess = async () => {
      setLoading(true);
      try {
        const submissions = await fetchSubmissions({
          kpo: selectedKpo === "overall" ? undefined : [selectedKpo],
        });

        const stats = await getServiceAccessibilityStats(submissions);

        setTableByFacility(stats.tableByFacility || []);
        setTableByGender(stats.tableByGender || []);
        setCardsData(stats.chart || []);
      } catch (err) {
        console.error("Error fetching service accessibility data:", err);
        setTableByFacility([]);
        setTableByGender([]);
        setCardsData([]);
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
          "flex justify-center items-center h-full min-h-[400px]",
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        )}
      >
        Loading service accessibility data...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Heading */}
      <h1
        className={clsx(
          "text-3xl font-bold mb-2",
          isDarkMode ? "text-white" : "text-gray-900"
        )}
      >
        Service Accessibility Dashboard
      </h1>
      <h2
        className={clsx(
          "text-xl font-semibold mb-6",
          isDarkMode ? "text-gray-300" : "text-gray-700"
        )}
      >
        {kpoDisplayNamesMap[selectedKpo]} KPO
      </h2>

      {/* Admin KPO Selector */}
      {currentUserRole === "admin" && (
        <div className="mb-6">
          <label className={clsx("mr-2 font-semibold")}>Select KPO:</label>
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

      {/* No Data */}
      {tableByFacility.length === 0 ||
        cardsData.every((card) => card.yes === 0 && card.no === 0) ? (
        <p
          className={clsx(
            "text-center mt-8",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}
        >
         Loading...
        </p>
      ) : (
        <>
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {cardsData.map((card: any) => (
              <AccessibilityCard
                key={card.key}
                title={card.label}
                yesCount={card.yes}
                noCount={card.no}
              />
            ))}
          </div>

          {/* Table by Facility */}
          <div className="mb-8">
            <h2
              className={clsx(
                "text-xl font-semibold mb-2",
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}
            >
              Table by Facility
            </h2>
            <ServiceAccessibilityTable
              data={tableByFacility}
              accessibilityKeys={accessibilityKeys}
            />
          </div>

          {/* Table by Gender */}
          <div className="mb-8">
            <h2
              className={clsx(
                "text-xl font-semibold mb-2",
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}
            >
              Table by Gender
            </h2>
            <ServiceAccessibilityTable
              data={tableByGender}
              accessibilityKeys={accessibilityKeys}
              rowLabelKey={"gender"}

            />
          </div>
        </>
      )}
    </div>
  );
};

export default ServiceAccessibilityPage;
