"use client";

import React from "react";
import clsx from "clsx";
import { useThemeStore } from "../../../store/themeStore";

interface TableProps {
  data: any[];
  accessibilityKeys: string[];
  rowLabelKey?: string; // default 'name', can be 'gender' for gender table
}

const ServiceAccessibilityTable: React.FC<TableProps> = ({
  data,
  accessibilityKeys,
  rowLabelKey = "name", // fallback
}) => {
  const { isDarkMode } = useThemeStore();

  console.log("===============");
  
  console.log(rowLabelKey);
  

  if (!data || data.length === 0) {
    return (
      <p
        className={clsx(
          "text-center py-4",
          isDarkMode ? "text-gray-400" : "text-gray-600"
        )}
      >
        No data available.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-300">
      <table
        className={clsx(
          "w-full text-left border-collapse",
          isDarkMode ? "text-white border-gray-700" : "text-gray-900"
        )}
      >
        <thead className={clsx(isDarkMode ? "bg-gray-700" : "bg-gray-100")}>
          <tr>
            <th className="px-4 py-2 border-b">
              {rowLabelKey === "gender" ? "Gender" : "Facility"}
            </th>
            {accessibilityKeys.map((key) => (
              <th key={key} className="px-4 py-2 border-b text-center">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.id || index}
              className={clsx(
                isDarkMode ? "border-gray-700" : "border-gray-200"
              )}
            >
              <td className="px-4 py-2 border-b">{row[rowLabelKey]}</td>
              {accessibilityKeys.map((key) => (
                <td key={key} className="px-4 py-2 border-b text-center">
                  {row[key]?.yes ?? 0} / {row[key]?.no ?? 0}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceAccessibilityTable;
