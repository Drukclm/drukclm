"use client";

import React, { useEffect, useState } from "react";
import useAuthStore from "@/app/store/authStore";
import { fetchSubmissions } from "@/app/utils/fetchProcessSubmission";
import { getFollowupConsentSubmissions } from "@/app/utils/fetchKpoDetails";
import { fetchDzongkhags, fetchRegions } from "@/app/utils/fetchKpoDetails";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClinent";
import { useThemeStore } from "../../store/themeStore";
import clsx from "clsx";

const KPO_KEY_MAP: Record<string, string> = {
  lhak_sam: "lhak_sam",
  LhakSam: "lhak_sam",
  cpa: "chithuen_phendhey",
  CPA: "chithuen_phendhey",
  pridebhutan: "pride_Bhutan",
  pride_bhutan: "pride_Bhutan",
  PrideBhutan: "pride_Bhutan",
  rpn: "red_purse_network",
  RPN: "red_purse_network",
  others: "others",
  Others: "others",
};


// Fetch all follow_ups for a list of submission ids
async function fetchFollowUpsBySubmissionIds(submissionIds: number[]) {

  const { data, error } = await supabase
    .from("Follow_up")
    .select("id, submission_id, follow_up_submission")
    .in("submission_id", submissionIds);

  if (error) throw error;
  return data || [];
}

export default function FollowUpPage() {
  const { profile } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [followups, setFollowups] = useState<any[]>([]);
  const [dzongkhags, setDzongkhags] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const router = useRouter();
  const [followupStatusMap, setFollowupStatusMap] = useState<Record<number, string>>({});
  const {isDarkMode} = useThemeStore();


  useEffect(() => {
    async function loadData() {
      setLoading(true);
      let filters = {};
      if (profile?.role !== "admin" && profile?.kpo_name) {
        const kpoKey = KPO_KEY_MAP[profile.kpo_name] || profile.kpo_name;
        filters = { kpo: [kpoKey] };
      }
      const [allSubs, dzs, regs] = await Promise.all([
        fetchSubmissions(filters),
        fetchDzongkhags(),
        fetchRegions(),
      ]);
      setDzongkhags(dzs);
      setRegions(regs);
      setFollowups(getFollowupConsentSubmissions(allSubs));

      // Fetch follow_up status for all submissions
      const submissionIds = allSubs.map((s: any) => s.id);
      const followUps = await fetchFollowUpsBySubmissionIds(submissionIds);

      // Map: submission_id -> status ("Closed" or "Ongoing")
      const statusMap: Record<number, string> = {};
      followUps.forEach((fu: any) => {
        const status = fu.follow_up_submission?.["15a"];
        statusMap[fu.submission_id] = status || "Ongoing";
      });
      setFollowupStatusMap(statusMap);

      setLoading(false);
    }
    if (profile) loadData();
  }, [profile]);

  // Helper to get region/dzongkhag name from id or value
  const getDzongkhagName = (idOrName: string) => {
    if (!idOrName) return "";
    const found = dzongkhags.find((d: any) => d.id == idOrName || d.name === idOrName);
    return found ? found.name : idOrName;
  };
  const getRegionName = (idOrName: string) => {
    if (!idOrName) return "";
    const found = regions.find((r: any) => r.id == idOrName || r.name === idOrName);
    return found ? found.name : idOrName;
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-xl">Loading...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Candidates for Follow Up</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className={isDarkMode?"text-black":""}>
              <th className="px-3 py-2 border">ID</th>
              <th className="px-3 py-2 border">Date</th>
              <th className="px-3 py-2 border">Region</th>
              <th className="px-3 py-2 border">Dzongkhag</th>
              <th className="px-3 py-2 border">Age</th>
              <th className="px-3 py-2 border">Gender</th>
              <th className="px-3 py-2 border">Contact</th>
              <th className="px-3 py-2 border">Consent</th>
              <th className="px-3 py-2 border">Status</th> 
              <th className="px-3 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {followups.map((s) => (
              <tr key={s.id} className={clsx(isDarkMode?"text-black":"")}>
                <td className="px-3 py-2 border">{s.id}</td>
                <td className="px-3 py-2 border">{s.answers?.["1"] || s.created_at?.slice(0, 10)}</td>
                <td className="px-3 py-2 border">{getRegionName(s.answers?.["4"])}</td>
                <td className="px-3 py-2 border">{getDzongkhagName(s.answers?.["3"])}</td>
                <td className="px-3 py-2 border">{s.answers?.["23"]}</td>
                <td className="px-3 py-2 border">
                  {Array.isArray(s.answers?.["24"])
                    ? s.answers["24"].join(", ")
                    : s.answers?.["24"]}
                </td>
                <td className="px-3 py-2 border">{s.answers?.["21"] || "-"}</td>
                <td className="px-3 py-2 border">{s.answers?.["20"]}</td>
                <td className="px-3 py-2 border">
                  {followupStatusMap[s.id] || "Ongoing"}
                </td>
                <td className="px-3 py-2 border text-center">
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded"
                    onClick={() => router.push(`/kpo-dashboard/FollowUp/${s.id}/form`)}
                  >
                    {followupStatusMap[s.id]=="Closed"?"View":"Continue Follow Up"}
                  </button>
                </td>
              </tr>
            ))}
            {followups.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center py-4 text-gray-500">
                  No candidates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}