// app/kpo-dashboard/layout.tsx
// (Or app/(dashboard)/dashboard/layout.tsx if that's your main dashboard layout wrapper)

"use client";
import Sidebar from "../(dashboard)/dashboard/components/sidebar";
import Header from "../(dashboard)/dashboard/components/header";
import { useThemeStore } from "../store/themeStore";
import clsx from "clsx";
import { useState } from "react"; // Import useState

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isDarkMode } = useThemeStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for sidebar visibility

  return (
    <div
      className={clsx(
        "min-h-screen", // Ensures it takes at least the full viewport height
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900"
          : "bg-gradient-to-br from-amber-100 via-orange-100 to-pink-100"
      )}
    >
      <div className="flex h-screen overflow-hidden">
        {" "}
        {/* Ensures content doesn't scroll past viewport height horizontally */}
        {/* Sidebar Component */}
        {/* Pass the state and setter to the Sidebar */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        {/* Overlay for small screens when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden" // Only visible on small/medium screens
            onClick={() => setIsSidebarOpen(false)} // Close sidebar when overlay is clicked
          ></div>
        )}
        {/* Main Content Area */}
        <div
          className={clsx(
            "flex-1 flex flex-col h-full min-w-0 transition-all duration-300 ease-in-out",
            "lg:ml-64" // On large screens (lg and up), push content to make space for the fixed sidebar
          )}
        >
          {/* Header Component */}
          {/* Pass the setter to the Header so it can open the sidebar */}
          <Header setIsSidebarOpen={setIsSidebarOpen} />

          {/* Main content area, takes remaining vertical space and handles its own scrolling */}
          <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
