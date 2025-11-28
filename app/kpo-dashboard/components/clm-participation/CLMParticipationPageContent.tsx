"use client";

import React from "react";
import clsx from "clsx";
import CLMGrid from "./widgets/CLMGrid";
import CLMCard from "./widgets/CLMCard";
import GenderChart from "./widgets/GenderChart";
import KpoTypesChart from "./widgets/KpoTypesChart";
import KeyPopulationOrganizationChart from "./widgets/KeyPopulationOrganizationChart";
import HealthFacilityChart from "./widgets/HealthFacilityChart";
import DzongkhagChart from "./widgets/DzongkhagChart";
import AgeGroupDistributionChart from "./widgets/AgeGroupDistributionChart";
import CLMParticipationTable from "./widgets/CLMParticipationTable";
import { useCLMData } from "./CLMDataContext";
import { useThemeStore } from "../../../store/themeStore";

export default function CLMParticipationPageContent() {
  const { isDarkMode } = useThemeStore();
  const {
    report,
    loading,
    currentUserRole,
    kpoDisplayNamesMap,
    allKpoKeysForDropdown,
    currentKpoDisplayName,
    selectedKpo: contextKpo, // for non-admins
  } = useCLMData();

  // Local state for admin KPO selection
  const [selectedKpo, setSelectedKpo] = React.useState('all_kpos');

  // For non-admins, use their own KPO (from context)
  const effectiveKpo = currentUserRole === "admin" ? selectedKpo : contextKpo;

  // ------------------------------
  // Loading State
  // ------------------------------
  if (loading || !report) {
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
            Loading CLM participation data...
          </p>
        </div>
      </div>
    );
  }

  // ------------------------------
  // No Data State
  // ------------------------------
  if (report.totalNumber === 0) {
    return (
      <div
        className={clsx(
          "p-8 min-h-screen",
          isDarkMode
            ? "bg-gradient-to-br from-[#2a1a4f] to-[#1a0f2c]"
            : "bg-gradient-to-br from-gray-100 to-gray-200"
        )}
      >
        <h2
          className={clsx(
            "text-3xl font-bold mb-4",
            isDarkMode ? "text-white" : "text-gray-900"
          )}
        >
          CLM Participation - {kpoDisplayNamesMap[effectiveKpo] || currentKpoDisplayName}
        </h2>
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
              {allKpoKeysForDropdown.map((key) => (
                <option key={key} value={key}>
                  {kpoDisplayNamesMap[key]}
                </option>
              ))}
            </select>
          </div>
        )}
        <p
          className={clsx(
            "text-lg mb-8 text-center mt-10",
            isDarkMode ? "text-gray-300" : "text-gray-800"
          )}
        >
          No CLM participation data available for {kpoDisplayNamesMap[effectiveKpo] || currentKpoDisplayName}.
        </p>
      </div>
    );
  }

  // ------------------------------
  // Main Render
  // ------------------------------
  return (
    <div>
      <h1
        className={clsx(
          "text-3xl font-bold mb-4",
          isDarkMode ? "text-white" : "text-gray-900"
        )}
      >
        CLM Participation - {kpoDisplayNamesMap[effectiveKpo] || currentKpoDisplayName}
      </h1>

      {/* Admin KPO Dropdown */}
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
            {allKpoKeysForDropdown.map((key) => (
              <option key={key} value={key}>
                {kpoDisplayNamesMap[key]}
              </option>
            ))}
          </select>
        </div>
      )}

      <CLMGrid>
        {/* Gender Chart */}
        {report.calculateKPOGenderDistribution && (
          <CLMCard title="Gender Distribution">
            <GenderChart selectedKpo={effectiveKpo} />
          </CLMCard>
        )}

        {/* KPO Types Chart */}
        {/* {report.calculateClmParticipationByKPO && */}
        {/* ( */}
        <CLMCard title="Key Population Distribution">
          <KpoTypesChart
            selectedKpo={effectiveKpo} />
        </CLMCard>
        {/* )} */}

        {/* Key Population Organization Chart */}
        {report.calculateKpoKeyPopulationDistribution && (
          <CLMCard title="CLM Participation by KPO">
            <KeyPopulationOrganizationChart
              selectedKpo={effectiveKpo}
            />
          </CLMCard>
        )}

        {/* Health Facility Chart */}
        {report.calculateServiceFacilityStats && (
          <CLMCard title="Service Facility Stats">
            <HealthFacilityChart
              selectedKpo={effectiveKpo}
            />
          </CLMCard>
        )}

        {/* Dzongkhag Chart */}
        {report.calculateDzongkhagDistribution && (
          <CLMCard title="Dzongkhag Distribution">
            <DzongkhagChart
              selectedKpo={effectiveKpo}
            />
          </CLMCard>
        )}

        {/* Region Chart */}
        {/* {report.calculateRegionDistribution && (
          <CLMCard title="Region Distribution">
            <HealthFacilityChart 
            selectedKpo={effectiveKpo} 
            />
          </CLMCard>
        )} */}

        {/* Age Group Distribution Chart */}
        {report.calculateAgeDistribution && (
          <CLMCard title="Age Group Distribution">
            <AgeGroupDistributionChart
              selectedKpo={effectiveKpo}
            />
          </CLMCard>
        )}

        {/* CLM Participation Table */}
        <CLMCard
          className="md:col-span-2 lg:col-span-3"
          title="Detailed Participation Table"
        >
          {report.calculateKPOGenderDistribution &&
            report.calculateKpoKeyPopulationDistribution && (
              <CLMParticipationTable
                selectedKpo={effectiveKpo}

                reportTitle="CLM Participation Report" />
            )}
        </CLMCard>
      </CLMGrid>
    </div>
  );
}