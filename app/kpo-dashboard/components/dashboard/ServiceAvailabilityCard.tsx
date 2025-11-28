"use client";

import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import {
  fetchSubmissions,
  calculateServiceAvailability,
} from "../../../utils/fetchProcessSubmission";

interface Props {
  kpo?: string; // optional, filter submissions by KPO
}

export default function ServiceAvailabilityCard({ kpo }: Props) {
  const [summary, setSummary] = useState<any>(null);
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

        const availability = calculateServiceAvailability(submissions);

        const mostSoughtIdx = availability.sought.indexOf(
          Math.max(...availability.sought)
        );
        const leastSoughtIdx = availability.sought.indexOf(
          Math.min(...availability.sought)
        );
        const mostReceivedIdx = availability.received.indexOf(
          Math.max(...availability.received)
        );
        const leastReceivedIdx = availability.received.indexOf(
          Math.min(...availability.received)
        );

        setSummary({
          mostSought: {
            label: availability.categories[mostSoughtIdx],
            count: availability.sought[mostSoughtIdx],
          },
          leastSought: {
            label: availability.categories[leastSoughtIdx],
            count: availability.sought[leastSoughtIdx],
          },
          mostReceived: {
            label: availability.categories[mostReceivedIdx],
            count: availability.received[mostReceivedIdx],
          },
          leastReceived: {
            label: availability.categories[leastReceivedIdx],
            count: availability.received[leastReceivedIdx],
          },
        });
      } catch (error) {
        console.error("Error fetching service availability:", error);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kpo]);

  if (loading)
    return (
      <DashboardCard title="Service Availability">
        <p className="text-gray-400 text-sm">Loading Service Availability...</p>
      </DashboardCard>
    );

  if (!summary)
    return (
      <DashboardCard title="Service Availability">
        <p className="text-gray-400 text-sm">No data available</p>
      </DashboardCard>
    );

  return (
    <DashboardCard title="Service Availability">
      <div className="grid grid-cols-2 gap-2">
        {[
          { title: "Most Sought Service", data: summary.mostSought },
          { title: "Least Sought Service", data: summary.leastSought },
          { title: "Most Received Service", data: summary.mostReceived },
          { title: "Least Received Service", data: summary.leastReceived },
        ].map((item, idx) => (
          <div key={idx}>
            <p className="text-xs text-gray-400">{item.title}</p>
            <p className="text-lg font-medium text-gray-300">
              {item.data.label} ({item.data.count})
            </p>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
