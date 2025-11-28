"use client";

import React from "react";
import clsx from "clsx";

type Props = {
  data: Array<any>;
  isDarkMode: boolean;
};

const FacilityTable = ({ data, isDarkMode }: Props) => {
  if (!data || data.length === 0) return <p>No facility data available.</p>;

  return (
    <div className={clsx("overflow-x-auto")}>
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
            <th className="px-4 py-2 text-left">Facility</th>
            <th className="px-4 py-2 text-right">Respect Yes</th>
            <th className="px-4 py-2 text-right">Respect No</th>
            <th className="px-4 py-2 text-right">Consent Yes</th>
            <th className="px-4 py-2 text-right">Consent No</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: any) => (
            <tr
              key={item.id}
              className={clsx(
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              )}
            >
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2 text-right">
                {item.respectYes} ({item.respectYesPercent.toFixed(1)}%)
              </td>
              <td className="px-4 py-2 text-right">
                {item.respectNo} ({item.respectNoPercent.toFixed(1)}%)
              </td>
              <td className="px-4 py-2 text-right">
                {item.consentYes} ({item.consentYesPercent.toFixed(1)}%)
              </td>
              <td className="px-4 py-2 text-right">
                {item.consentNo} ({item.consentNoPercent.toFixed(1)}%)
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FacilityTable;
