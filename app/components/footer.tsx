'use client';

import { useThemeStore } from '../store/themeStore';

export default function Footer() {
  const { isDarkMode } = useThemeStore();

  return (
    <footer className={`backdrop-blur-md border-t py-8 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-900/90 border-gray-800' 
        : 'bg-orange-100/90 border-orange-200'
    }`}>
      <div className="container mx-auto px-4 text-center">
        <p className={`transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-orange-800/80'
        }`}>
          &copy; {new Date().getFullYear()} Lhak-Sam on behalf of the Key Population Organizations | All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}