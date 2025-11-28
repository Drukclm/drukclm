// app/components/dashboard/DashboardCard.tsx
"use client";

import React from "react";
import clsx from "clsx";
import { useThemeStore } from "../../../store/themeStore";

type DashboardCardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
};

export default function DashboardCard({
  title,
  children,
  className = "",
  isActive = false,
}: DashboardCardProps) {
  const { isDarkMode } = useThemeStore();

  return (
    <div
      className={clsx(
        "p-6 rounded-xl shadow-md flex flex-col h-full transition-all duration-300 ease-in-out", // Changed to transition-all

        isActive
          ? {
              "bg-gradient-to-r from-amber-500 to-orange-500 transform -translate-y-1":
                !isDarkMode, // Added transform for active state
              "bg-gradient-to-r from-blue-500 to-cyan-500 transform -translate-y-1":
                isDarkMode, // Added transform for active state
            }
          : {
              "bg-orange-50 border border-orange-200/60": !isDarkMode,
              "bg-slate-800 border border-slate-700": isDarkMode,
            },
        className
      )}
    >
      {title && (
        <h2
          className={clsx(
            "text-lg font-semibold mb-4",
            isDarkMode ? "text-white" : "text-black"
          )}
        >
          {title}
        </h2>
      )}
      <div
        className={clsx(
          "flex-grow flex flex-col justify-center",
          isDarkMode ? "text-white" : "text-black"
        )}
      >
        {children}
      </div>
    </div>
  );
}
