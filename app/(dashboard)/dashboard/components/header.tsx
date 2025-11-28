// app/kpo-dashboard/components/header.tsx
// (Or app/components/header.tsx)

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useThemeStore } from "../../../store/themeStore";
import useAuthStore from "../../../store/authStore";
import { User, LogOut, ChevronDown, Sun, Moon, Menu } from "lucide-react"; // Import Menu icon
import clsx from "clsx";

export default function Header({
  setIsSidebarOpen, // Accept prop to open the sidebar
}: {
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const { logout, profile } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const handleLogout = async (): Promise<void> => {
    setIsDropdownOpen(false);
    await logout();
    router.refresh();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-30 flex h-24 items-center px-6 rounded-md mt-5 mx-8 transition-colors",
        isDarkMode
          ? "bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 border-b border-indigo-700"
          : "bg-gradient-to-r from-orange-50 via-amber-100 to-pink-100 border-b border-orange-200"
      )}
    >
      {/* Hamburger icon for small screens */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className={clsx(
          "p-2 rounded-full lg:hidden transition-colors",
          isDarkMode
            ? "hover:bg-indigo-800/60 text-white"
            : "hover:bg-orange-200/50 text-gray-700"
        )}
        aria-label="Open sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="ml-auto flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className={clsx(
            "p-2 rounded-full transition-colors",
            isDarkMode ? "hover:bg-indigo-800/60" : "hover:bg-orange-200/50"
          )}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-orange-900" />
          )}
        </button>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={clsx(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isDarkMode
                ? "text-cyan-100 hover:bg-indigo-800/60"
                : "text-orange-900 hover:bg-orange-200/50"
            )}
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
            type="button"
          >
            <User className="h-5 w-5" />
            <span className="hidden sm:inline">
              {profile?.name || "Account"}
            </span>
            <ChevronDown
              className={clsx(
                "h-4 w-4 transition-transform duration-200",
                isDropdownOpen
                  ? isDarkMode
                    ? "text-cyan-300 rotate-180"
                    : "text-orange-700 rotate-180"
                  : isDarkMode
                    ? "text-cyan-300"
                    : "text-orange-700"
              )}
            />
          </button>

          {isDropdownOpen && (
            <div
              className={clsx(
                "absolute right-0 mt-2 w-56 origin-top-right rounded-md shadow-xl ring-1 focus:outline-none z-40 transition-colors",
                isDarkMode
                  ? "bg-gray-900/95 ring-indigo-700"
                  : "bg-white/95 ring-orange-200"
              )}
              role="menu"
              aria-orientation="vertical"
            >
              <div className="py-1">
                {profile && (
                  <div className={clsx(
                    "px-4 py-2 border-b mb-1",
                    isDarkMode ? "border-indigo-700" : "border-orange-200"
                  )}>
                    <p className={clsx(
                      "text-sm font-semibold",
                      isDarkMode ? "text-cyan-100" : "text-orange-900"
                    )}>
                      {profile.name}
                    </p>
                    <p className={clsx(
                      "text-xs truncate",
                      isDarkMode ? "text-cyan-300" : "text-orange-700"
                    )}>
                      {profile.email}
                    </p>
                  </div>
                )}
                <div className="p-1">
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className={clsx(
                      "w-full text-left flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                      isDarkMode
                        ? "text-cyan-100 hover:bg-indigo-800/40"
                        : "text-orange-900 hover:bg-orange-100"
                    )}
                    role="menuitem"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                </div>
                <div className={clsx(
                  "p-1 border-t",
                  isDarkMode ? "border-indigo-700" : "border-orange-200"
                )}>
                  <button
                    onClick={handleLogout}
                    className={clsx(
                      "w-full text-left flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                      isDarkMode
                        ? "text-red-400 hover:bg-red-900/30"
                        : "text-red-600 hover:bg-red-100"
                    )}
                    role="menuitem"
                    type="button"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
