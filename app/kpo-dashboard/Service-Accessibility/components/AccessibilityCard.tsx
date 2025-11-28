"use client";

import React from "react";
import clsx from "clsx";
import { useThemeStore } from "../../../store/themeStore";

// Props: title of the category, counts of Yes/No
interface AccessibilityCardProps {
  title: string;
  yesCount: number;
  noCount: number;
}

const AccessibilityCard: React.FC<AccessibilityCardProps> = ({
  title,
  yesCount,
  noCount,
}) => {
  const { isDarkMode } = useThemeStore(); // Get dark/light mode

  const total = yesCount + noCount; // total responses
  const yesPercent = total > 0 ? (yesCount / total) * 100 : 0; // percentage Yes
  const noPercent = total > 0 ? (noCount / total) * 100 : 0; // percentage No

  // Colors for doughnut
  const yesColor = "rgb(34, 197, 94)"; // green
  const noColor = "rgb(239, 68, 68)"; // red

  return (
    <div
      className={clsx(
        "p-4 rounded-lg shadow-md flex flex-col items-center justify-between min-h-[200px]",
        "border",
        isDarkMode
          ? "bg-gray-800 text-white border-gray-700"
          : "bg-white text-gray-900 border-gray-200"
      )}
    >
      {/* ---------- TITLE ---------- */}
      <h3 className="text-base font-semibold mb-2 text-center">{title}</h3>

      {/* ---------- DOUGHNUT / NO DATA ---------- */}
      <div className="flex items-center justify-center flex-grow relative group">
        {total > 0 ? (
          // Doughnut using CSS conic-gradient
          <div
            className="relative w-28 h-28 rounded-full cursor-pointer"
            style={{
              background: `conic-gradient(${yesColor} 0% ${yesPercent}%, ${noColor} ${yesPercent}% 100%)`,
            }}
            title={`Yes: ${yesCount} (${yesPercent.toFixed(
              1
            )}%) | No: ${noCount} (${noPercent.toFixed(1)}%)`}
          >
            {/* Center number of responses */}
            <div
              className={clsx(
                "absolute inset-1/4 rounded-full flex items-center justify-center text-xs font-medium",
                isDarkMode
                  ? "bg-gray-800 text-gray-300"
                  : "bg-white text-gray-600"
              )}
            >
              {total}
            </div>
          </div>
        ) : (
          // Show this if no responses
          <div
            className={clsx(
              "w-28 h-28 rounded-full flex items-center justify-center text-sm font-medium border",
              isDarkMode
                ? "bg-gray-700 text-gray-300 border-gray-600"
                : "bg-gray-100 text-gray-600 border-gray-300"
            )}
          >
            No Responses
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibilityCard;
