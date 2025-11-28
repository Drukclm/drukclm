"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { supabase } from "../../../../lib/supabaseClinent";
import { useThemeStore } from "../../../store/themeStore";
import { beneficiaryForm } from "../../../utils/BeneficiaryFormQuestion";

type SupportRequest = {
  id: number;
  status: string;
  created_at: string;
  questions: { question_key: string; question_text: string; answer: any }[];
  kpo_name: string;
};

// Expandable answer cell
const AnswerCell = ({
  rowId,
  colId,
  answer,
  expandedCells,
  setExpandedCells,
}: {
  rowId: number;
  colId: string;
  answer: string;
  expandedCells: Record<string, boolean>;
  setExpandedCells: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}) => {
  const cellKey = `${rowId}_${colId}`;
  const isExpanded = expandedCells[cellKey];
  const displayAnswer =
    isExpanded || answer.length <= 50 ? answer : answer.slice(0, 50) + "...";

  return (
    <td
      className="px-4 py-2 border text-sm max-w-xs break-words"
      title={answer}
    >
      <div>
        {displayAnswer}
        {answer.length > 50 && (
          <button
            onClick={() =>
              setExpandedCells((prev) => ({
                ...prev,
                [cellKey]: !prev[cellKey],
              }))
            }
            className="ml-1 text-indigo-600 text-xs font-medium hover:underline"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </td>
  );
};

export default function SubmittedSupportRequests() {
  const { isDarkMode } = useThemeStore();
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKPO, setSelectedKPO] = useState("");
  const [expandedCells, setExpandedCells] = useState<Record<string, boolean>>(
    {}
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch requests
  const fetchSupportRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("support_request")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Fetch error:", error);
      setLoading(false);
      return;
    }

    const formattedRequests: SupportRequest[] = data.map((r: any) => {
      // r.kpo_name is dynamic (from DB). TypeScript complains when indexing with `any`.
      // Cast beneficiaryForm to `any` for this dynamic runtime lookup.
      const kpoQuestions = Object.values(
        ((beneficiaryForm as any)[r.kpo_name]?.sections) ?? []
      ).flatMap((s: any) => s.questions || []);

      const questions = kpoQuestions.map((q: any) => ({
        question_key: q.question_number,
        question_text: q.question,
        answer: r.answers[q.question_number] ?? "-",
      }));

      return { ...r, questions };
    });

    setRequests(formattedRequests);
    setLoading(false);
  };

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  // Update status
  const handleUpdateStatus = async (reqId: number, newStatus: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: newStatus } : r))
    );

    try {
      const { error } = await supabase
        .from("support_request")
        .update({ status: newStatus })
        .eq("id", reqId);
      if (error) throw error;
    } catch (err: any) {
      console.error("Failed to update status:", err);
      alert("Failed to update status: " + err.message);
    }
  };

  // Filtered & pagination
  const filteredRequests = requests.filter(
    (r) => !selectedKPO || r.kpo_name === selectedKPO
  );
  const totalEntries = filteredRequests.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalEntries);

  useEffect(() => setCurrentPage(1), [selectedKPO, rowsPerPage]);
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages]);

  // Get all unique question headers for the filtered requests
  const allQuestions = Array.from(
    new Map(
      filteredRequests
        .flatMap((req) => req.questions)
        .map((q) => [q.question_key, q])
    ).values()
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1
          className={clsx(
            "text-2xl font-bold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}
        >
          Submitted Support Requests
        </h1>
        <div className="flex items-center gap-3">
          <label
            className={clsx(
              "text-sm font-medium",
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}
          >
            Filter by KPO:
          </label>
          <select
            value={selectedKPO}
            onChange={(e) => setSelectedKPO(e.target.value)}
            className={clsx(
              "border rounded-lg px-3 py-2 text-sm focus:outline-none transition-all",
              isDarkMode
                ? "bg-gray-800 text-white border-gray-600 focus:ring-2 focus:ring-indigo-500"
                : "bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-indigo-500"
            )}
          >
            <option value="">All KPOs</option>
            <option value="lhak_sam">Lhak-Sam</option>
            <option value="pride_bhutan">Pride Bhutan</option>
            <option value="chithuen_phendhey">
              Chithuen Phendhey Association
            </option>
            <option value="red_purse_network">Red Purse Network</option>
            <option value="others">Others</option>
          </select>

          {/* <label
            className={clsx(
              "text-sm font-medium",
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}
          >
            Rows:
          </label>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className={clsx(
              "border rounded-lg px-3 py-2 text-sm focus:outline-none transition-all",
              isDarkMode
                ? "bg-gray-800 text-white border-gray-600 focus:ring-2 focus:ring-indigo-500"
                : "bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-indigo-500"
            )}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select> */}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div
          className={clsx(
            "flex justify-center items-center h-40 text-sm italic",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}
        >
          Loading support requests...
        </div>
      ) : totalEntries === 0 ? (
        <div
          className={clsx(
            "flex justify-center items-center h-40 text-sm",
            isDarkMode ? "text-gray-400" : "text-gray-700"
          )}
        >
          No support requests found.
        </div>
      ) : (
        <div className="overflow-auto rounded-xl shadow border w-full max-h-[600px] scrollbar-thin">
          <table className="min-w-max w-full border-collapse">
            {/* Table Header */}
            <thead
              className={clsx(
                "sticky top-0 z-10 text-sm",
                isDarkMode
                  ? "bg-gray-900 text-gray-100"
                  : "bg-gray-100 text-gray-900"
              )}
            >
              <tr>
                <th className="px-4 py-3 text-left border">ID</th>
                <th className="px-4 py-3 text-left border">Status</th>
                <th className="px-4 py-3 text-left border">Created At</th>
                <th className="px-4 py-3 text-left border">KPO</th>
                {allQuestions.map((q) => (
                  <th
                    key={q.question_key}
                    className="px-4 py-3 text-left border max-w-xs break-words"
                  >
                    {q.question_text}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filteredRequests
                .slice(startIndex, endIndex)
                .map((req, rowIndex) => (
                  <tr
                    key={req.id}
                    className={clsx(
                      "transition-all duration-100",
                      isDarkMode
                        ? rowIndex % 2 === 0
                          ? "bg-gray-800 hover:bg-gray-700"
                          : "bg-gray-850 hover:bg-gray-700"
                        : rowIndex % 2 === 0
                        ? "bg-white hover:bg-gray-50"
                        : "bg-gray-50 hover:bg-gray-100"
                    )}
                  >
                    <td className="px-4 py-2 border">{req.id}</td>
                    <td className="px-4 py-2 border">
                      <select
                        value={req.status}
                        onChange={(e) =>
                          handleUpdateStatus(req.id, e.target.value)
                        }
                        className={clsx(
                          "border px-2 py-1 rounded-md text-sm focus:outline-none",
                          isDarkMode
                            ? "bg-gray-900 text-gray-100 border-gray-700"
                            : "bg-white border-gray-300"
                        )}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 border text-sm whitespace-nowrap">
                      {new Date(req.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border text-sm whitespace-nowrap">
                      {req.kpo_name || "-"}
                    </td>

                    {allQuestions.map((q) => {
                      const ans =
                        req.questions.find(
                          (a) => a.question_key === q.question_key
                        )?.answer ?? "-";
                      return (
                        <AnswerCell
                          key={`${req.id}_${q.question_key}`}
                          rowId={req.id}
                          colId={q.question_key}
                          answer={Array.isArray(ans) ? ans.join(", ") : ans}
                          expandedCells={expandedCells}
                          setExpandedCells={setExpandedCells}
                        />
                      );
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Info */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
        <p className="text-sm text-current opacity-70">
          Showing {totalEntries > 0 ? startIndex + 1 : 0} to {endIndex} of{" "}
          {totalEntries} entries
        </p>
      </div>
    </div>
  );
}
