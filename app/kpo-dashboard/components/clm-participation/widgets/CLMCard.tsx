// components/clm-participation/widgets/clmChard.tsx
"use client";

import React from "react";
import clsx from "clsx";

import { useThemeStore } from "../../../../store/themeStore";

type CLMCardProps = {
  title?: string;
  children: React.ReactNode; // This is CRUCIAL for rendering the charts
  className?: string;
  isActive?: boolean;
  actionIcon?: React.ReactNode;
};

// ... (rest of the imports and CLMCardProps)

export default function CLMCard({
  title,
  children,
  className = "",
  isActive = false,
  actionIcon,
}: CLMCardProps) {
  const { isDarkMode } = useThemeStore();

  return (
    <div
      className={clsx(
        "p-6 rounded-xl shadow-md flex flex-col h-full transition-all duration-300 ease-in-out",
        isActive
          ? {
              "bg-gradient-to-r from-amber-500 to-orange-500 transform -translate-y-1":
                !isDarkMode,
              "bg-gradient-to-r from-blue-500 to-cyan-500 transform -translate-y-1":
                isDarkMode,
            }
          : {
              "bg-orange-50 border border-orange-200/60": !isDarkMode,
              "bg-slate-800 border border-slate-700": isDarkMode,
            },
        className
      )}
    >
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h2
            className={clsx(
              "text-lg font-semibold",
              isDarkMode ? "text-white" : "text-black"
            )}
          >
            {title}
          </h2>
          {actionIcon && (
            <div className="text-gray-500 dark:text-gray-400 cursor-pointer">
              {actionIcon}
            </div>
          )}
        </div>
      )}

      {/* Increased min-h from [250px] to [350px] for more vertical space */}
      <div
        className={clsx(
          "flex-grow flex flex-col justify-center overflow-hidden min-h-[350px]", // Increased min-height
          isDarkMode ? "text-white" : "text-black"
        )}
      >
        {children}
      </div>
    </div>
  );
}
