

import { LucideProps } from 'lucide-react';
import clsx from 'clsx';
import { useThemeStore } from '../../../store/themeStore'; 

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  color: 'blue' | 'green' | 'pink';
}

export default function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  // --- 2. Get the current theme state ---
  const { isDarkMode } = useThemeStore();

  // Define icon gradients. The dark mode uses your original gradients.
  // The light mode now uses warm gradients to match the new theme.
  const iconColorSchemes = {
    blue: {
      light: 'bg-gradient-to-tr from-amber-500 to-orange-500',
      dark: 'bg-gradient-to-tr from-blue-500 to-cyan-400',
    },
    green: {
      light: 'bg-gradient-to-tr from-lime-500 to-green-500',
      dark: 'bg-gradient-to-tr from-green-500 to-emerald-400',
    },
    pink: {
      light: 'bg-gradient-to-tr from-orange-500 to-red-500',
      dark: 'bg-gradient-to-tr from-pink-500 to-red-400',
    },
  };
  
  // --- 3. Select the correct gradient based on the current theme ---
  const selectedIconGradient = isDarkMode 
    ? iconColorSchemes[color].dark 
    : iconColorSchemes[color].light;

  return (
    // --- 4. UPDATED: The card now has a "glass" effect ---
    <div className={clsx(
      "rounded-xl p-6 flex justify-between items-center transition-all duration-300",
      "border backdrop-blur-md", // Base styles for the glass effect
      isDarkMode
        ? "bg-black/20 border-white/10" // Dark mode glass
        : "bg-white/30 border-black/10" // Light mode glass
    )}>
      
      {/* --- 5. UPDATED: Text colors are now theme-aware --- */}
      <div>
        <p className={clsx(
          "text-sm font-medium",
          isDarkMode ? "text-gray-400" : "text-gray-700"
        )}>
          {title}
        </p>
        <h3 className={clsx(
          "text-3xl sm:text-4xl font-bold mt-2",
          isDarkMode ? "text-gray-100" : "text-orange-950"
        )}>
          {value}
        </h3>
      </div>

      {/* --- 6. UPDATED: The icon container uses the dynamic gradient --- */}
      <div
        className={clsx(
          'w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg',
          selectedIconGradient
        )}
      >
        <Icon className="w-7 h-7" />
      </div>
    </div>
  );
}