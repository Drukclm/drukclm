// components/clm-participation/widgets/clmGrid.tsx
import React from "react";

interface CLMGridProps {
  children: React.ReactNode; // This defines that the component accepts children
}

export default function CLMGrid({ children }: CLMGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  );
}
