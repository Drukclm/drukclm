"use client";

import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import {
  fetchSubmissions,
  calculateServiceAcceptability,
} from "../../../utils/fetchProcessSubmission";

interface Props {
  kpo?: string; // optional KPO filter
}

export default function ServiceAcceptabilityCard({ kpo }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let submissions;
        if (kpo === "all_kpos") {
          submissions = await fetchSubmissions();
        }
        else {
          submissions = await fetchSubmissions({
            kpo: kpo ? [kpo] : undefined,
          });
        }
        const result = calculateServiceAcceptability(submissions);
        setData(result);
      } catch (err) {
        console.error("Error fetching acceptability data:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [kpo]);

  if (loading)
    return (
      <DashboardCard title="Service Acceptability">
        <p className="text-gray-400">Loading...</p>
      </DashboardCard>
    );

  if (!data)
    return (
      <DashboardCard title="Service Acceptability">
        <p className="text-gray-400">No data available</p>
      </DashboardCard>
    );

  const { acceptability } = data;

  return (
    <DashboardCard title="Service Acceptability">
      <div className="grid grid-cols-2 gap-4">
        {acceptability.aspects.map((label: string, idx: number) => (
          <div key={idx}>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-2xl font-semibold text-gray-300">
              {acceptability.yesPercent[idx]}%
            </p>
          </div>
        ))}
      </div>
      <p className="text-center text-xs mt-2 text-gray-500">
        Based on total participation
      </p>
    </DashboardCard>
  );
}
