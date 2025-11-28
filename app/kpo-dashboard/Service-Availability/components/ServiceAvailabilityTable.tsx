import { useThemeStore } from "../../../store/themeStore";

interface Props {
  data?: any[];
  loading?: boolean;
  title?: string;
  overallScore?: number;
  selectedKpo?: string; // <-- add this
}

export default function ServiceAvailabilityTable({
  data = [],
  loading = false,
  title = "Service Availability",
  overallScore = 0,
  selectedKpo, // <-- destructure it here
}: Props) {
  const { isDarkMode } = useThemeStore();

  if (loading)
    return (
      <p className="text-center py-4 text-gray-400 dark:text-gray-300">
        Loading table data...
      </p>
    );

  if (!data.length)
    return (
      <p className="text-center py-4 text-gray-400 dark:text-gray-300">
        No data available.
      </p>
    );

  return (
    <div
      className={`rounded shadow p-4 overflow-x-auto transition-colors duration-300 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h3
        className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {title} {selectedKpo && selectedKpo !== "all" ? `- ${selectedKpo}` : ""}
      </h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead
          className={`transition-colors duration-300 ${
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <tr>
            <th
              className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Service
            </th>
            <th
              className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Sought (n / %)
            </th>
            <th
              className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Received (n / %)
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, idx) => (
            <tr key={`${row.label}-${idx}`}>
              <td
                className={`px-4 py-2 text-sm transition-colors duration-300 ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {row.label}
              </td>
              <td
                className={`px-4 py-2 text-sm transition-colors duration-300 ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                {row.sought} ({row.soughtPercentOfTotal}%)
              </td>
              <td
                className={`px-4 py-2 text-sm transition-colors duration-300 ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                {row.received} ({row.receivedPercentOfSought}%)
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot
          className={`font-bold transition-colors duration-300 ${
            isDarkMode
              ? "bg-gray-700 text-gray-100"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          <tr>
            <td className="px-4 py-2 uppercase tracking-wider">
              Overall Service Availability Score
            </td>
            <td colSpan={2} className="px-4 py-2 text-right">
              {Math.round(overallScore)}%
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
