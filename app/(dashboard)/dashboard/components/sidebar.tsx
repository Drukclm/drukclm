"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import clsx from "clsx";

// State Management
import { useThemeStore } from "../../../store/themeStore";
import useAuthStore from "../../../store/authStore";

// --- ICONS ---
import {
  LayoutDashboard,
  Users,
  FileUp,
  ListTodo,
  ChevronDown,
  Database,
  X, // Import X icon for closing sidebar on mobile
   FileText,
} from "lucide-react";
import {
  Home,
  Users2,
  Calendar,
  CheckSquare,
  Star,
  Info,
  LineChart, // Icon for KPO Dashboard
  Smartphone,
  TriangleAlert,
  ClipboardList,
  Download,

} from "lucide-react";

// --- LINK DEFINITIONS (MODIFIED: KPO Dashboard link removed from adminNavLinks) ---
const adminNavLinks = [
  { name: "Dashboard", href: "/dashboard/card", icon: LayoutDashboard },
  // KPO Dashboard link is removed from here because a dedicated switch button will be added for admins.
  {
    name: "Masters",
    href: "#",
    icon: Database,
    subLinks: [
      { name: "Region", href: "/dashboard/region" },
      { name: "Dzongkhag", href: "/dashboard/dzongkhag" },
      { name: "Hospital", href: "/dashboard/hospital" },
      { name: "Service Facility ", href: "/dashboard/service-facility" },
    ],
  },
  {
    name: "User Management",
    href: "#",
    icon: Users,
    subLinks: [{ name: "User", href: "/dashboard/user-management" }],
  },
  { name: "Upload Reports", href: "/dashboard/Upload-Reports", icon: FileUp },
  {
    name: "Forms",
    href: "#",
    icon: ListTodo,
    subLinks: [
      { name: "Submitted Forms", href: "/dashboard/submitted-forms" },
      {
        name: "Submitted Requests",
        href: "/dashboard/submitted-requests",
      },
    ],
  },
];

const kpoSections = [
  {
    title: "HOME",
    links: [{ name: "Dashboard", href: "/kpo-dashboard", icon: Home }],
  },
  {
    title: "REPORT COMPONENTS",
    links: [
      {
        name: "CLM-Participation",
        href: "/kpo-dashboard/CLM-Participation",
        icon: Users2,
      },
      {
        name: "Service-Availability",
        href: "/kpo-dashboard/Service-Availability",
        icon: Calendar,
      },
      {
        name: "Service-Accessibility",
        href: "/kpo-dashboard/Service-Accessibility",
        icon: CheckSquare,
      },
      {
        name: "Service-Acceptability",
        href: "/kpo-dashboard/Service-Acceptability",
        icon: Star,
      },
      {
        name: "Service-Quality",
        href: "/kpo-dashboard/Service-Quality",
        icon: Info,
      },
      {
        name: "Waiting-Time",
        href: "/kpo-dashboard/Waiting-Time",
        icon: Smartphone,
      },
      {
        name: "Serious-Incidents",
        href: "/kpo-dashboard/Serious-Incidents",
        icon: TriangleAlert,
      },
      {
        name: "Submitted Requests",
        href: "/kpo-dashboard/submitted-requests",
        icon: FileText,
      },
    ],
  },
  {
    title: "FOLLOW UP",
    links: [
      {
        name: "Follow-Up Dashboard",
        href: "/kpo-dashboard/FollowUp",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "DOWNLOADS",
    links: [
      {
        name: "Reports Download",
        href: "/kpo-dashboard/Download",
        icon: Download,
      },
    ],
  },
];

// --- THE DYNAMIC SIDEBAR COMPONENT ---
export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const pathname = usePathname();
  const { isDarkMode } = useThemeStore();
  const { profile } = useAuthStore();
  const [openDropdown, setOpenDropdown] = useState("");

  const role = profile?.role || "admin"; // Default to 'admin' if role is not set
  const isKPOUser = role === "kpo"; // True if the logged-in user's role is specifically 'kpo'
  const isKPOContext = pathname.startsWith("/kpo-dashboard"); // True if the current path is within the KPO dashboard

  useEffect(() => {
    // Only apply dropdown logic if we are in the admin context and not in KPO context
    if (role === "admin" && !isKPOContext) {
      const activeParent = adminNavLinks.find((link) =>
        link.subLinks?.some((sub: any) => pathname.startsWith(sub.href))
      );
      setOpenDropdown(activeParent ? activeParent.name : "");
    } else {
      setOpenDropdown(""); // Close any dropdowns when switching to KPO view or for KPO users
    }
  }, [pathname, role, isKPOContext]);

  const handleDropdownToggle = (name: string): void => {
    setOpenDropdown(openDropdown === name ? "" : name);
  };

  // Function to close sidebar on small screens when a link is clicked
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <aside
      className={clsx(
        "fixed top-0 left-0 z-50 h-screen p-4 flex flex-col transition-transform duration-300 ease-in-out",
        "w-64", // Fixed width for the sidebar
        isDarkMode
          ? "bg-gray-800/95 border-r border-gray-700"
          : "bg-white/50 backdrop-blur-lg border-r border-black/10",
        // Responsive classes:
        "lg:translate-x-0", // On large screens, always visible
        !isSidebarOpen && "-translate-x-full" // On small/medium screens, hide it by moving it off-screen if not open
      )}
    >
      <div className="mb-8 flex flex-col items-center pt-4">
        {/* Close button for mobile sidebar */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className={clsx(
            "absolute top-4 right-4 p-2 rounded-full lg:hidden", // Only show on small/medium screens
            isDarkMode
              ? "hover:bg-gray-700 text-white"
              : "hover:bg-orange-100 text-gray-700"
          )}
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>

        <Link href="/" className="mb-3">
          <Image
            src="/assets/logo.png" // Ensure this path is correct
            alt="Druk-CLM Logo"
            width={70}
            height={70}
            priority
          />
        </Link>
        <h1
          className={clsx(
            "text-xl font-bold",
            isDarkMode ? "text-white" : "text-orange-900"
          )}
        >
          Druk-CLM {(isKPOUser || (role === "admin" && isKPOContext)) && "KPO"}{" "}
          {/* Dynamically adds "KPO" to title if a KPO user or an admin in KPO context */}
        </h1>
        <p
          className={clsx(
            "text-xs mt-1 text-center",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}
        >
          Strength in Diversity, a Joy for Humanity
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {/* --- Dynamic Switch Button for Admin Users --- */}
        {role === "admin" && ( // Only show this button if the user is an admin
          <div className="mb-4">
            {isKPOContext ? (
              // Admin is currently in the KPO context, show button to go to Admin Dashboard
              <Link
                href="/dashboard/card" // Link to your main admin dashboard
                onClick={handleLinkClick}
                className={clsx(
                  "flex items-center gap-3 p-3 rounded-lg font-medium transition-colors justify-center",
                  isDarkMode
                    ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg hover:from-green-600 hover:to-teal-600"
                    : "bg-gradient-to-r from-lime-500 to-green-500 text-white shadow-lg hover:from-lime-600 hover:to-green-600"
                )}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              // Admin is currently NOT in the KPO context, show button to go to KPO Dashboard
              <Link
                href="/kpo-dashboard" // Link to your KPO dashboard entry point
                onClick={handleLinkClick}
                className={clsx(
                  "flex items-center gap-3 p-3 rounded-lg font-medium transition-colors justify-center",
                  isDarkMode
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:from-blue-600 hover:to-cyan-600"
                    : "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:from-amber-600 hover:to-orange-600"
                )}
              >
                <LineChart className="w-5 h-5" />
                <span>KPO Dashboard</span>
              </Link>
            )}
          </div>
        )}

        {/* --- Main Navigation Links based on Role and Context --- */}
        {isKPOUser || (role === "admin" && isKPOContext) ? (
          // Render KPO-specific navigation links
          <div className="space-y-6">
            {kpoSections.map((section) => (
              <div key={section.title}>
                {section.title !== "HOME" && (
                  <h2
                    className={clsx(
                      "px-3 mb-2 text-xs font-semibold tracking-wider uppercase",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    {section.title}
                  </h2>
                )}

                <ul className="space-y-1">
                  {section.links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          onClick={handleLinkClick}
                          className={clsx(
                            "flex items-center gap-3 p-3 rounded-lg font-medium transition-colors",
                            isActive
                              ? isDarkMode
                                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                                : "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                              : isDarkMode
                              ? "text-gray-300 hover:bg-gray-700/50"
                              : "text-gray-700 hover:bg-orange-100",
                            !link.icon && "pl-11"
                          )}
                        >
                          {link.icon && (
                            <link.icon className="w-5 h-5 flex-shrink-0" />
                          )}
                          <span>{link.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          // Render Admin-specific navigation links (only if admin AND NOT in KPO context)
          <ul className="space-y-2">
            {adminNavLinks.map((link) => {
              const isParentActive = link.subLinks
                ? link.subLinks.some((sub) => pathname.startsWith(sub.href))
                : pathname.startsWith(link.href);
              if (link.subLinks) {
                const isDropdownOpen = openDropdown === link.name;
                return (
                  <li key={link.name}>
                    <button
                      onClick={() => handleDropdownToggle(link.name)}
                      className={clsx(
                        "w-full flex items-center justify-between gap-3 p-3 rounded-lg font-medium text-left transition-colors",
                        isParentActive
                          ? isDarkMode
                            ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                            : "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                          : isDarkMode
                          ? "text-gray-300 hover:bg-gray-700/50"
                          : "text-gray-700 hover:bg-orange-100"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <link.icon className="w-5 h-5 flex-shrink-0" />
                        <span>{link.name}</span>
                      </div>
                      <ChevronDown
                        className={clsx(
                          "w-5 h-5 transition-transform flex-shrink-0",
                          isDropdownOpen && "rotate-180"
                        )}
                      />
                    </button>
                    <div
                      className={clsx(
                        "grid transition-all duration-300 ease-in-out",
                        isDropdownOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      <div className="overflow-hidden">
                        <ul
                          className={clsx(
                            "pl-6 ml-4 mt-2 space-y-2 border-l-2",
                            isDarkMode ? "border-gray-600" : "border-orange-200"
                          )}
                        >
                          {link.subLinks.map((subLink) => {
                            const isSubLinkActive = pathname === subLink.href;
                            return (
                              <li key={subLink.name}>
                                <Link
                                  href={subLink.href}
                                  onClick={handleLinkClick}
                                  className={clsx(
                                    "flex items-center gap-3 p-2 rounded-lg text-sm transition-colors w-full",
                                    isSubLinkActive
                                      ? isDarkMode
                                        ? "font-semibold bg-cyan-500/20 text-cyan-300"
                                        : "font-semibold bg-orange-200/60 text-orange-800"
                                      : isDarkMode
                                      ? "text-gray-400 hover:text-white hover:bg-gray-700/50"
                                      : "text-gray-500 hover:text-gray-900 hover:bg-orange-100"
                                  )}
                                >
                                  {subLink.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              }
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={handleLinkClick}
                    className={clsx(
                      "flex items-center gap-3 p-3 rounded-lg font-medium transition-colors",
                      isParentActive
                        ? isDarkMode
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                          : "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                        : isDarkMode
                        ? "text-gray-300 hover:bg-gray-700/50"
                        : "text-gray-700 hover:bg-orange-100"
                    )}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </aside>
  );
}
