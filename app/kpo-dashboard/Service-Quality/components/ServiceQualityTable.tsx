// service-quality/components/ServiceQualityTable.tsx
"use client";

import React from "react";
import clsx from "clsx";

type Props = {
  data: any[];
  metrics: string[];
  isDarkMode: boolean;
};

const ServiceQualityTable = ({ data, metrics, isDarkMode }: Props) => {
  return (
    <div className="overflow-x-auto">
      <table
        className={clsx(
          "min-w-full border rounded",
          isDarkMode ? "border-gray-600" : "border-gray-300"
        )}
      >
        <thead
          className={clsx(
            isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
          )}
        >
          <tr>
            <th className="border p-2 text-left">Facility / Gender</th>
            {metrics.map((metric) => (
              <th key={metric} className="border p-2 text-left">
                {metric}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className={clsx(
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              )}
            >
              <td className="border p-2 font-medium">
                {row.name || row.gender}
              </td>
              {metrics.map((metric) => {
                const val = row[metric] || {
                  yes: 0,
                  no: 0,
                  yesPercent: 0,
                  noPercent: 0,
                };
                return (
                  <td key={metric} className="border p-2">
                    <span className="text-green-600 dark:text-green-400">
                      YES: {val.yes} ({val.yesPercent}%)
                    </span>
                    <br />
                    <span className="text-red-600 dark:text-red-400">
                      NO: {val.no} ({val.noPercent}%)
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceQualityTable;
