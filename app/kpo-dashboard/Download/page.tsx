"use client";

import React, { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import { supabase } from "../../../lib/supabaseClinent";
import { useThemeStore } from "../../store/themeStore"; // Add this import


// Utility to convert array of objects to CSV string
function toCSV(rows: any[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: any) =>
    typeof v === "string"
      ? `"${v.replace(/"/g, '""')}"`
      : Array.isArray(v)
        ? `"${v.join("; ").replace(/"/g, '""')}"`
        : v ?? "";
  const csv =
    headers.join(",") +
    "\n" +
    rows
      .map((row) => headers.map((h) => escape(row[h])).join(","))
      .join("\n");
  return csv;
}

// Add this mapping
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

export default function DownloadPage() {
  const { profile, loading } = useAuthStore();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const { isDarkMode } = useThemeStore(); // Add this line


  useEffect(() => {
    async function fetchData() {
      setFetching(true);
      if (!profile) return;
      let query = supabase.from("Submission").select("*");
      if (profile.role !== "admin" && profile.kpo_name) {
        // Map to canonical key for submission data
        const kpoKey = KPO_KEY_MAP[profile.kpo_name] || profile.kpo_name;
        query = query.eq("network", kpoKey);
      }
      const { data, error } = await query;
      if (!error) setSubmissions(data || []);
      setFetching(false);
    }
    if (profile) fetchData();
  }, [profile]);

  const handleDownload = () => {
    // Flatten answers into columns for CSV
    const rows = submissions.map((s) => ({
      id: s.id,
      created_at: s.created_at,
      network: s.network,
      ...s.answers,
    }));
    const csv = toCSV(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clm_submissions.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading || fetching) {
    return (
      <div className={isDarkMode
        ? "flex justify-center items-center h-64 bg-gray-900 text-cyan-100 rounded-xl"
        : "flex justify-center items-center h-64 bg-white text-orange-900 rounded-xl"
      }>
        <span className="text-xl">Loading...</span>
      </div>
    );
  }

  return (
    <div className={
      isDarkMode
        ? "flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 border border-indigo-700 rounded-xl p-8 mt-4"
        : "flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-br from-orange-50 via-amber-100 to-pink-100 border border-orange-200 rounded-xl p-8 mt-4"
    }>
      <h2 className={
        isDarkMode
          ? "text-4xl font-semibold mb-6 text-cyan-100"
          : "text-4xl font-semibold mb-6 text-orange-900"
      }>
        Downloadable Data: {submissions.length} entries
      </h2>
      <button
        className={
          isDarkMode
            ? "bg-cyan-600 hover:bg-cyan-700 text-white text-2xl px-8 py-3 rounded-lg transition"
            : "bg-green-600 hover:bg-green-700 text-white text-2xl px-8 py-3 rounded-lg transition"
        }
        onClick={handleDownload}
        disabled={!submissions.length}
      >
        Download CSV
      </button>
    </div>
  );
}