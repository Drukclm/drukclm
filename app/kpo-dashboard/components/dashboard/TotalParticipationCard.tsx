// app/components/dashboard/TotalParticipationCard.tsx
"use client";

import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import { Users } from "lucide-react";
import {
  fetchSubmissions,
  calculateTotalSubmission,
} from "../../../utils/fetchProcessSubmission";

interface Props {
  kpo?: string; // optional: undefined means show overall total
}

export default function TotalParticipationCard({ kpo }: Props) {
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  console.log(kpo);





  useEffect(() => {
    const fetchTotal = async () => {
      setLoading(true);


      try {
        // Fetch submissions: if `kpo` is undefined → all KPOs (Overall)

        let submissions;
        if (kpo === "all_kpos") {
          submissions = await fetchSubmissions();
        }
        else {
          submissions = await fetchSubmissions({
            kpo: kpo ? [kpo] : undefined,
          });
        }
        // console.log(submissions);


        // Ensure we always have a flat array for Overall
        const allSubmissions = Array.isArray(submissions) ? submissions : [];

        // Calculate total number of submissions
        const totalCount = calculateTotalSubmission(allSubmissions);

        setTotal(totalCount);
      } catch (error) {
        console.error("Error fetching total submissions:", error);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTotal();
  }, [kpo]);

  return (
    <DashboardCard>
      <div className="flex justify-between items-center h-full">
        {/* Left: Text info */}
        <div>
          <h3 className="text-gray-400 dark:text-slate-400">
            Total Participation
          </h3>
          <p className="text-7xl font-bold mt-1 text-gray-300 dark:text-slate-500">
            {loading ? "..." : total}
          </p>
          <p className="text-sm mt-2 text-gray-400 dark:text-slate-400">
            Total submissions so far
          </p>
        </div>

        {/* Right: Icon */}
        <div className="bg-slate-800 dark:bg-slate-700 p-3 rounded-full">
          <Users className="h-6 w-6 text-white" />
        </div>
      </div>
    </DashboardCard>
  );
}
