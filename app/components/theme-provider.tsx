// app/components/theme-provider.jsx (Corrected Version)

"use client";

import { useEffect } from "react";
import { useThemeStore } from "../store/themeStore";

// Notice we have removed `useAuthStore` and `createClient` because they are not needed here.

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { isDarkMode } = useThemeStore();
  
  // This useEffect is correct. It only handles adding/removing the 'dark' class.
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // The incorrect useEffect that handled authentication has been completely removed.

  return <>{children}</>;
}