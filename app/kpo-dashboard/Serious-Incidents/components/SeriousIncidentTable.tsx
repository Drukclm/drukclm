// components/SeriousIncidentTable.tsx
import React from "react";
import clsx from "clsx";

interface IncidentBreakdown {
  yes: number;
  no: number;
  yesPercent: number;
  noPercent: number;
}

interface SeriousIncidentRow {
  id?: number; // For facility table
  name?: string; // For facility table
  gender?: string; // For gender table
  [key: string]: IncidentBreakdown | string | number | undefined; // For incident labels
}

interface SeriousIncidentTableProps {
  data: SeriousIncidentRow[];
  totalN: number; // Total number of relevant submissions
  // overallScoresPerIncidentType: string[]; // This prop seems unused or for a different header display
  incidentLabels: { key: string; label: string }[];
  isDarkMode: boolean;
  mainColumnKey: "name" | "gender"; // New prop to specify which key to use for the first column
  mainColumnHeader: string; // New prop for the header of the first column
}

const SeriousIncidentTable: React.FC<SeriousIncidentTableProps> = ({
  data,
  totalN,
  // overallScoresPerIncidentType, // No longer used for row rendering
  incidentLabels,
  isDarkMode,
  mainColumnKey,
  mainColumnHeader,
}) => {
  if (!data || data.length === 0) {
    return (
      <p
        className={clsx(
          "text-center p-4",
          isDarkMode ? "text-gray-400" : "text-gray-600"
        )}
      >
        No data available for this table.
      </p>
    );
  }

  // Calculate overall percentages for the header based on `totalN`
  // This is a more direct calculation to match the "n=X" in the header if desired
  const calculateOverallHeaderPercent = (label: string) => {
    let totalYesForIncident = 0;
    data.forEach((row) => {
      const breakdown = row[label] as IncidentBreakdown;
      if (breakdown) {
        totalYesForIncident += breakdown.yes;
      }
    });
    return totalN > 0 ? ((totalYesForIncident / totalN) * 100).toFixed(1) : "0";
  };

  return (
    <div
      className={clsx(
        "overflow-x-auto rounded-lg shadow-md",
        isDarkMode ? "bg-gray-800" : "bg-white"
      )}
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className={clsx(isDarkMode ? "bg-gray-700" : "bg-gray-50")}>
          <tr>
            <th
              scope="col"
              rowSpan={2} // Covers both 'Category' and 'Type' if you only have one main column
              className={clsx(
                "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                isDarkMode ? "text-gray-200" : "text-gray-500"
              )}
            >
              {mainColumnHeader}
            </th>
            {/* Incident labels and overall Yes percentage */}
            {incidentLabels.map((incident) => (
              <th
                key={incident.key}
                scope="col"
                colSpan={2}
                className={clsx(
                  "px-6 py-3 text-center text-xs font-medium uppercase tracking-wider",
                  isDarkMode ? "text-gray-200" : "text-gray-500"
                )}
              >
                {incident.label}
                <br />
                <span className="font-normal text-gray-400">
                  {calculateOverallHeaderPercent(incident.label)}%
                </span>
              </th>
            ))}
          </tr>
          <tr>
            {/* Yes/No sub-headers */}
            {incidentLabels.map((incident) => (
              <React.Fragment key={`${incident.key}-sub`}>
                <th
                  scope="col"
                  className={clsx(
                    "px-3 py-2 text-center text-xs font-medium uppercase tracking-wider",
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  Yes
                </th>
                <th
                  scope="col"
                  className={clsx(
                    "px-3 py-2 text-center text-xs font-medium uppercase tracking-wider",
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  No
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody
          className={clsx(
            "divide-y divide-gray-200",
            isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
          )}
        >
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {row[mainColumnKey] || "N/A"} {/* Display name/gender */}
              </td>
              {incidentLabels.map((incident) => {
                const breakdown = row[incident.label] as IncidentBreakdown;
                // Handle cases where breakdown might be undefined if no data for that incident type for that row
                const yesCount = breakdown?.yes ?? 0;
                const noCount = breakdown?.no ?? 0;
                const yesPercent = breakdown?.yesPercent ?? 0;
                const noPercent = breakdown?.noPercent ?? 0;

                return (
                  <React.Fragment key={`${rowIndex}-${incident.key}`}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-center">
                      {yesCount} ({yesPercent}%)
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-center">
                      {noCount} ({noPercent}%)
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SeriousIncidentTable;
