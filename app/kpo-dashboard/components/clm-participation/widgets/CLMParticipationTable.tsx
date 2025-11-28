"use client";
import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useThemeStore } from "../../../../store/themeStore";
import { useCLMData } from "../CLMDataContext";
import { calculateAgeDistribution, fetchSubmissions } from "@/app/utils/fetchProcessSubmission";
import { fetchRegions, fetchDzongkhags, calculateServiceFacilityStats, calculateKpoKeyPopulationDistribution, calculateKPOGenderDistribution, calculateRegionDistribution } from "@/app/utils/fetchKpoDetails";

interface ReportRowData {
  variable?: string;
  characteristic: string;
  count: number;
  percentage: string;
}

interface CLMParticipationTableProps {
  reportTitle: string;
  selectedKpo: string;
}


export default function CLMParticipationTable({
  reportTitle,
  selectedKpo,
}: CLMParticipationTableProps) {
  const { isDarkMode } = useThemeStore();
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      let submissions;
      if (selectedKpo && selectedKpo !== "all_kpos") {
        submissions = await fetchSubmissions({ kpo: [selectedKpo] });
      } else {
        submissions = await fetchSubmissions();
      }
      const [regions, dzongkhags, healthFacilityData] = await Promise.all([
        fetchRegions(),
        fetchDzongkhags(),
        calculateServiceFacilityStats(submissions),
      ]);
      setReport({
        totalNumber: submissions.length,
        keyPopulationDistribution: calculateKpoKeyPopulationDistribution(submissions),
        genderDistribution: calculateKPOGenderDistribution(submissions),
        ageDistribution: calculateAgeDistribution(submissions),
        regionDistribution: calculateRegionDistribution(submissions, regions),
        healthFacilityDataFromReport: healthFacilityData,
      });
    }
    loadData();
  }, [selectedKpo]);

  // Safe defaults if report is not loaded yet
  const {
    totalNumber = 0,
    keyPopulationDistribution = {
      categories: [],
      series: [],
      total: 0,
      percentages: [],
    },
    genderDistribution = {
      categories: [],
      series: [],
      total: 0,
      percentages: [],
    },
    ageDistribution = {
      categories: [],
      series: [],
      total: 0,
      percentages: [],
    },
    regionDistribution = {
      categories: [],
      counts: [],
      total: 0,
      details: [],
    },
    healthFacilityDataFromReport = {
      categories: [],
      series: [],
      total: 0,
      details: [],
    },
  } = report || {};

  // Always call hooks!
  const healthFacilityTableData = useMemo(() => {
    if (Array.isArray(healthFacilityDataFromReport.details)) {
      return healthFacilityDataFromReport.details.map((detail: any) => ({
        characteristic: detail.name,
        count: detail.count,
        percentage: `${totalNumber > 0 ? ((detail.count / totalNumber) * 100).toFixed(1) : 0}%`,
      }));
    }
    return [];
  }, [healthFacilityDataFromReport, totalNumber]);

  // ...rest of your code...

  if (!report) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
          Loading table data...
        </p>
      </div>
    );
  }

  const totalParticipantsForTable = totalNumber;
  const allTransformedData: ReportRowData[] = [];

  // Key Population
  keyPopulationDistribution.categories.forEach((charName: any, index: any) => {
    allTransformedData.push({
      variable: index === 0 ? "Key Population Type" : undefined,
      characteristic: charName,
      count: keyPopulationDistribution.series[index],
      percentage: `${keyPopulationDistribution.percentages[index]?.toFixed(1) || 0
        }%`,
    });
  });

  // Gender
  genderDistribution.categories.forEach((charName: any, index: any) => {
    allTransformedData.push({
      variable: index === 0 ? "Gender" : undefined,
      characteristic: charName,
      count: genderDistribution.series[index],
      percentage: `${genderDistribution.percentages[index]?.toFixed(1) || 0}%`,
    });
  });

  // Age
  ageDistribution.categories.forEach((charName: any, index: any) => {
    allTransformedData.push({
      variable: index === 0 ? "Age Group" : undefined,
      characteristic: charName,
      count: ageDistribution.series[index],
      percentage: `${ageDistribution.percentages[index]?.toFixed(1) || 0}%`,
    });
  });

  // Region
  if (Array.isArray(regionDistribution.categories)) {
    regionDistribution.categories.forEach((charName: any, index: any) => {
      allTransformedData.push({
        variable: index === 0 ? "Region" : undefined,
        characteristic: charName,
        count: regionDistribution.counts[index],
        percentage: `${totalParticipantsForTable > 0
          ? (
            (regionDistribution.counts[index] / totalParticipantsForTable) *
            100
          ).toFixed(1)
          : 0
          }%`,
      });
    });
  }

  // Service Facility
  healthFacilityTableData.forEach((row: any, index: any) => {
    allTransformedData.push({
      variable: index === 0 ? "Service Facility" : undefined,
      characteristic: row.characteristic,
      count: row.count,
      percentage: row.percentage,
    });
  });

  const participationTableData = allTransformedData.filter(Boolean);

  // Render "No Data" state
  if (totalParticipantsForTable === 0 && participationTableData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
          No data available for CLM Participation Table.
        </p>
      </div>
    );
  }

  // CSV download
  const handleDownloadCSV = () => {
    const headers = [
      "CLM Participation Variables",
      "Characteristics",
      "n",
      "%",
    ];
    const csvRows = [headers.join(",")];

    let currentVariable = "";
    participationTableData.forEach((row) => {
      const variable =
        row.variable !== undefined ? row.variable : currentVariable;
      if (row.variable !== undefined) currentVariable = row.variable;
      csvRows.push(
        `"${variable}","${row.characteristic}",${row.count},"${row.percentage}"`
      );
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${reportTitle.replace(/[^a-z0-9]/gi, "_")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hoverBgClass = isDarkMode
    ? "group-hover:bg-slate-700"
    : "group-hover:bg-gray-50";
  const hoverTextClass = isDarkMode
    ? "group-hover:text-white"
    : "group-hover:text-gray-900";

  return (
    <div
      className={clsx(
        "p-4 md:p-6 lg:p-8 rounded-xl shadow-md",
        isDarkMode
          ? "bg-slate-800 border border-slate-700 text-white"
          : "bg-white border border-gray-200 text-gray-900"
      )}
    >
      <h1
        className={clsx(
          "text-xl md:text-2xl font-bold mb-6 text-center",
          isDarkMode ? "text-white" : "text-gray-800"
        )}
      >
        {reportTitle}
      </h1>

      <button
        onClick={handleDownloadCSV}
        className={clsx(
          "mb-4 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200",
          isDarkMode
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-purple-600 hover:bg-purple-700 text-white"
        )}
      >
        Download CSV
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={clsx(isDarkMode ? "bg-slate-700" : "bg-gray-50")}>
            <tr>
              <th
                rowSpan={2}
                className={clsx(
                  "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                  isDarkMode ? "text-slate-200" : "text-gray-500"
                )}
              >
                CLM Participation Variables
              </th>
              <th
                colSpan={3}
                className={clsx(
                  "px-6 py-3 text-center text-xs font-medium uppercase tracking-wider",
                  isDarkMode ? "text-slate-200" : "text-gray-500"
                )}
              >
                CLM Participation (n={totalParticipantsForTable})
              </th>
            </tr>
            <tr>
              <th
                className={clsx(
                  "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                  isDarkMode ? "text-slate-200" : "text-gray-500"
                )}
              >
                Characteristics
              </th>
              <th
                className={clsx(
                  "px-6 py-3 text-center text-xs font-medium uppercase tracking-wider",
                  isDarkMode ? "text-slate-200" : "text-gray-500"
                )}
              >
                n
              </th>
              <th
                className={clsx(
                  "px-6 py-3 text-center text-xs font-medium uppercase tracking-wider",
                  isDarkMode ? "text-slate-200" : "text-gray-500"
                )}
              >
                %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {participationTableData.map((row, index) => {
              const isNewVariableGroup = row.variable !== undefined;
              let currentGroupRowSpan = 0;

              if (isNewVariableGroup) {
                currentGroupRowSpan = 1;
                for (
                  let i = index + 1;
                  i < participationTableData.length;
                  i++
                ) {
                  if (participationTableData[i].variable === undefined) {
                    currentGroupRowSpan++;
                  } else break;
                }
              }

              return (
                <tr
                  key={index}
                  className={clsx(
                    "group",
                    isNewVariableGroup
                      ? isDarkMode
                        ? "bg-slate-700"
                        : "bg-gray-100"
                      : ""
                  )}
                >
                  {isNewVariableGroup && (
                    <td
                      rowSpan={currentGroupRowSpan}
                      className={clsx(
                        "px-6 py-4 whitespace-nowrap text-sm font-medium",
                        isDarkMode ? "text-slate-200" : "text-gray-900"
                      )}
                    >
                      {row.variable}
                    </td>
                  )}
                  <td
                    className={clsx(
                      "px-6 py-4 whitespace-nowrap text-sm",
                      isDarkMode ? "text-slate-300" : "text-gray-700",
                      hoverBgClass,
                      hoverTextClass
                    )}
                  >
                    {row.characteristic}
                  </td>
                  <td
                    className={clsx(
                      "px-6 py-4 whitespace-nowrap text-sm text-center",
                      isDarkMode ? "text-slate-300" : "text-gray-700",
                      hoverBgClass,
                      hoverTextClass
                    )}
                  >
                    {row.count}
                  </td>
                  <td
                    className={clsx(
                      "px-6 py-4 whitespace-nowrap text-sm text-center",
                      isDarkMode ? "text-slate-300" : "text-gray-700",
                      hoverBgClass,
                      hoverTextClass
                    )}
                  >
                    {row.percentage}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
