'use client';

import { useEffect, useState, useMemo } from 'react';
import { useThemeStore } from '../../../store/themeStore';
import clsx from 'clsx';
import { Download, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../../../lib/supabaseClinent';
import { questions as allQuestions } from '@/app/utils/questions';

type Submission = {
  id: number;
  created_at: string;
  network: string;
  answers: Record<string, any>;
};
type FacilityName = {
  id: number;
  name: string;
};

function getAllQuestions(questionsObj: any) {
  const result: { question_number: string; question: string }[] = [];
  Object.values(questionsObj).forEach((sections: any) => {
    Object.values(sections).forEach((section: any) => {
      section.questions.forEach((q: any) => {
        if (q.question_number && q.question) {
          if (!result.some(r => r.question_number === q.question_number)) {
            result.push({ question_number: q.question_number, question: q.question });
          }
        }
        if (q.yesquestion) {
          q.yesquestion.forEach((yesq: any) => {
            if (yesq.question_number && yesq.question) {
              if (!result.some(r => r.question_number === yesq.question_number)) {
                result.push({ question_number: yesq.question_number, question: yesq.question });
              }
            }
          });
        }
      });
    });
  });
  return result;
}

export default function SubmittedFormsPage() {
  const { isDarkMode } = useThemeStore();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [facilityNames, setFacilityNames] = useState<FacilityName[]>([]);


  // Fetch submissions from Supabase
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from('Submission')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error("Error fetching submissions:", error);
        setSubmissions([]);
      } else {
        setSubmissions(
          data.map((row: any) => ({
            ...row,
            answers: typeof row.answers === 'string' ? JSON.parse(row.answers) : row.answers,
          }))
        );
      }
      setLoading(false);
    }
    fetchData();
  }, []);
  useEffect(() => {
    async function fetchFacilityNames() {
      const { data, error } = await supabase
        .from('facility_name')
        .select('id, name');
      if (!error && data) setFacilityNames(data);
    }
    fetchFacilityNames();
  }, []);

  // ...inside SubmittedFormsPage component...
  const getFacilityName = (id: any) => {
    if (!id) return "-";
    const found = facilityNames.find(f => String(f.id) === String(id));
    return found ? found.name : String(id);
  };

  const allQuestionList = useMemo(() => getAllQuestions(allQuestions), []);

  const totalEntries = submissions.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubmissions = useMemo(
    () => submissions.slice(startIndex, endIndex),
    [submissions, startIndex, endIndex]
  );

  function exportToCSV() {
    const headers = ['ID', 'Created At', 'Network', ...allQuestionList.map(q => `"${q.question.replace(/"/g, '""')}"`)];
    const rows = submissions.map(sub =>
      [
        sub.id,
        sub.created_at,
        sub.network,
        ...allQuestionList.map(q => {
          const ans = sub.answers?.[q.question_number];
          let value = ans ?? '';
          if (Array.isArray(ans)) value = ans.join(', ');
          return `"${String(value).replace(/"/g, '""')}"`;
        }),
      ].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'submissions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  const inputClasses = clsx(
    "px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 backdrop-blur-sm",
    isDarkMode
      ? "bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:ring-cyan-500/50"
      : "bg-white/30 border-white/40 text-gray-900 placeholder:text-gray-700/60 focus:ring-orange-500/50"
  );

  const primaryButtonClasses = clsx(
    "flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg text-white transition-all shadow-md transform hover:scale-105",
    isDarkMode
      ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
      : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400"
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className={clsx("text-2xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
          Submitted Forms
        </h1>
      </div>

      <div className="text-center">
        <h2 className={clsx("text-3xl font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
          All Submissions
        </h2>
        <div className={clsx(
          "mt-2 h-1 w-16 mx-auto rounded-full",
          isDarkMode ? "bg-gradient-to-r from-cyan-500 to-blue-500" : "bg-gradient-to-r from-amber-500 to-orange-500"
        )}></div>
      </div>

      <div className={clsx(
        "flex-1 rounded-xl p-6 sm:p-8 backdrop-blur-lg flex flex-col min-h-0 border",
        isDarkMode
          ? "bg-black/20 border-white/10 shadow-2xl"
          : "bg-white/30 border-white/40 shadow-xl"
      )}>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={exportToCSV} className={primaryButtonClasses}>
              <Download size={16} />
              <span>Export</span>
            </button>
            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className={clsx(inputClasses, 'appearance-none pr-8 cursor-pointer')}
              >
                <option value="5" className={clsx(isDarkMode?"text-black":"")}>Show 5</option>
                <option value="10" className={clsx(isDarkMode?"text-black":"")}>Show 10</option>
                <option value="20" className={clsx(isDarkMode?"text-black":"")}>Show 20</option>
              </select>
              <ChevronsUpDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-current opacity-60 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="text-xs text-current opacity-60 mb-2 flex items-center gap-2">
            <span>💡 Tip: Use horizontal scroll to view all columns</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>
          {/*  horizontal and vertical scrollbars */}
          <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
            <table className="min-w-full">
              <thead className={clsx(
                "sticky top-0 z-30 shadow-md",
                isDarkMode ? "bg-black/80" : "bg-white"
              )}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap min-w-[80px]">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap min-w-[120px]">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap min-w-[100px]">
                    Network
                  </th>
                  {/* Add columns for 18 and 18a */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap min-w-[120px]">
                    Serious Incident (Q18)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap min-w-[200px]">
                    Incident Types (Q18a)
                  </th>
                  {allQuestionList.map(q => (
                    (q.question_number !== "18" && q.question_number !== "18a") && (
                      <th key={q.question_number} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap min-w-[200px] max-w-[300px]">
                        <div className="truncate" title={q.question}>
                          {q.question}
                        </div>
                      </th>
                    )
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loading ? (
                  <tr>
                    <td colSpan={allQuestionList.length + 5} className="text-center py-10 text-gray-500 dark:text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : currentSubmissions.length > 0 ? (
                  currentSubmissions.map(submission => (
                    <tr key={submission.id} className={clsx(
                      "transition-colors",
                      isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5"
                    )}>
                      <td className="px-6 py-4 text-sm font-medium text-current min-w-[80px]">
                        <div className="truncate">
                          {submission.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-current min-w-[120px]">
                        <div className="truncate" title={new Date(submission.created_at).toLocaleString()}>
                          {new Date(submission.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-current min-w-[100px]">
                        <div className="truncate" title={submission.network}>
                          {submission.network}
                        </div>
                      </td>
                      {/* Show Q18 */}
                      <td className="px-6 py-4 text-sm text-current min-w-[120px]">
                        <div className="truncate" title={submission.answers?.["18"] ?? '-'}>
                          {submission.answers?.["18"] ?? '-'}
                        </div>
                      </td>
                      {/* Show Q18a */}
                      <td className="px-6 py-4 text-sm text-current min-w-[200px]">
                        <div className="truncate" title={
                          Array.isArray(submission.answers?.["18a"])
                            ? submission.answers["18a"].join(', ')
                            : (submission.answers?.["18a"] ?? '-')
                        }>
                          {Array.isArray(submission.answers?.["18a"])
                            ? submission.answers["18a"].join(', ')
                            : (submission.answers?.["18a"] ?? '-')}
                        </div>
                      </td>
                      {/* Render all other questions except 18 and 18a */}
                      {allQuestionList.map(q => {
                        if (q.question_number === "18" || q.question_number === "18a") return null;
                        const ans = submission.answers?.[q.question_number];
                        let displayValue = '';
                        if (q.question_number === "5") {
                          displayValue = getFacilityName(ans);
                        } else if (Array.isArray(ans)) {
                          displayValue = ans.join(', ');
                        } else {
                          displayValue = ans ?? '-';
                        }
                        return (
                          <td key={q.question_number} className="px-6 py-4 text-sm text-current min-w-[200px] max-w-[300px]">
                            <div className="truncate" title={displayValue}>
                              {displayValue}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={allQuestionList.length + 5} className="text-center py-10 text-gray-500 dark:text-gray-400">
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10 flex-shrink-0">
          <p className="text-sm text-current opacity-70">
            Showing {totalEntries > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, totalEntries)} of {totalEntries} entries
          </p>
          <div className="flex items-center rounded-lg shadow-sm border border-white/20 overflow-hidden backdrop-blur-sm bg-white/10">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || totalEntries === 0}
              className="px-3 py-2 border-r border-white/20 disabled:opacity-50 transition-colors hover:bg-white/10"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalEntries === 0}
              className="px-3 py-2 disabled:opacity-50 transition-colors hover:bg-white/10"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}