// service-quality/components/QualityCard.tsx
"use client";

import React from "react";
import clsx from "clsx";

type Props = {
  title: string;
  yesCount: number;
  noCount: number;
};

const QualityCard = ({ title, yesCount, noCount }: Props) => {
  const total = yesCount + noCount;
  const yesPercent = total ? Math.round((yesCount / total) * 100) : 0;
  const noPercent = total ? Math.round((noCount / total) * 100) : 0;

  return (
    <div className="p-4 rounded shadow bg-white dark:bg-gray-800 border">
      <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
        {title}
      </h3>
      <p className="text-green-600 dark:text-green-400">
        YES: {yesCount} ({yesPercent}%)
      </p>
      <p className="text-red-600 dark:text-red-400">
        NO: {noCount} ({noPercent}%)
      </p>
    </div>
  );
};

export default QualityCard;
