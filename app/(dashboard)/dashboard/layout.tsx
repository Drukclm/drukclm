"use client";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
import { useThemeStore } from "../../store/themeStore";
import clsx from "clsx";
import { useState } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isDarkMode } = useThemeStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  return (
    <div className={clsx(
      "min-h-screen w-full fixed inset-0",
      isDarkMode
        ? "bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900"
        : "bg-gradient-to-br from-amber-100 via-orange-100 to-pink-100"
    )}>
      <div className="flex h-full w-full">
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col lg:ml-64 h-full min-w-0">
          <Header setIsSidebarOpen={setIsSidebarOpen}/>
          <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
