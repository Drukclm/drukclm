"use client";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../../lib/supabaseClinent";
import { useThemeStore } from "../../store/themeStore";
import Head from "next/head";

interface KPOFile {
  id: number;
  file_name: string;
  kpo_name: string;   
  file_type: string;  
  created_at: string;
  file_size: number;  
  download_url: string; 
}

export default function ReportPage() {
  const { isDarkMode } = useThemeStore();
  const [files, setFiles] = useState<KPOFile[]>([]);
  const [search, setSearch] = useState("");
  const [selectedKPO, setSelectedKPO] = useState("");
  const [isGridView, setIsGridView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  useEffect(() => {
    async function fetchFiles() {
      try {
        const { data, error } = await supabase.from("kpo_files").select("*");

        if (error) throw error;

        if (!data || data.length === 0) {
          alert("No files found in the database.");
          setFiles([]);
        } else {
          setFiles(data);
        }
      } catch (e) {
        console.error("Error fetching files:", e);
      }
    }

    fetchFiles();
  }, []); 

  const filteredFiles = useMemo(() => {
    let filtered = files;
    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(
        (file) =>
          file.file_name.toLowerCase().includes(lower) ||
          file.kpo_name.toLowerCase().includes(lower)
      );
    }
    if (selectedKPO && selectedKPO !== "All") {
      filtered = filtered.filter((file) => file.kpo_name === selectedKPO);
    }
    return filtered;
  }, [files, search, selectedKPO]);

  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniqueKPOs = useMemo(() => {
    return [...new Set(files.map((f) => f.kpo_name))];
  }, [files]);

  const getFileIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
      pdf: "fa-file-pdf",
      xlsx: "fa-file-excel",
      xls: "fa-file-excel",
      docx: "fa-file-word",
      doc: "fa-file-word",
      zip: "fa-file-archive",
    };
    return `fas ${icons[type.toLowerCase()] || "fa-file"}`;
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${units[i]}`;
  };

  return (
    <>
      <Head>
        <title>Reports | Druk CLM</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="font-poppins min-h-screen transition-all duration-500">
        {/* Hero Section */}
        <section className={`wave-container pt-24 pb-20 relative overflow-hidden transition-all duration-500 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white"
            : "bg-gradient-to-br from-amber-100 via-orange-100 to-pink-100 text-gray-800"
        }`}>
          <div className="absolute inset-0 opacity-5 mix-blend-overlay"></div>
          <div className="container mx-auto px-4 max-w-6xl text-center relative z-10 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                <span className={`bg-clip-text text-transparent sun-pulse ${
                  isDarkMode
                    ? "bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 neon-glow"
                    : "bg-gradient-to-r from-amber-600 via-orange-600 to-red-600"
                }`}>
                  Reports & Documents
                </span>
              </h1>
              <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Access all reports, documents, and resources shared by our partner organizations.
              </p>
            </div>
          </div>
          <div className="wave"></div>
        </section>

        {/* Main Content */}
        <main className={`flex-grow container mx-auto px-4 py-12 transition-all duration-500 ${
          isDarkMode ? "bg-gray-900" : "bg-orange-50"
        }`}>
          <div className={`rounded-xl shadow-lg p-6 transition-all duration-500 ${
            isDarkMode ? "bg-gray-800/80 backdrop-blur-sm border-gray-700" : "bg-white/80 backdrop-blur-sm border-orange-200"
          }`}>
            <h2 className={`text-2xl font-bold mb-8 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>KPO Files List</h2>
            
            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4">
              <div className="relative flex-grow">
                <input 
                  type="text" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  placeholder="Search files..." 
                  className={`w-full p-3 border rounded-lg pl-10 focus:outline-none focus:ring-2 transition-all duration-500 ${
                    isDarkMode 
                      ? "bg-gray-700 border-gray-600 focus:ring-cyan-500 text-white" 
                      : "bg-white border-gray-300 focus:ring-orange-500 text-gray-800"
                  }`}
                />
                <i className={`fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}></i>
              </div>
              
              <select 
                value={selectedKPO} 
                onChange={(e) => setSelectedKPO(e.target.value)} 
                className={`p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-500 ${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 focus:ring-cyan-500 text-white" 
                    : "bg-white border-gray-300 focus:ring-orange-500 text-gray-800"
                }`}
              >
                <option value="" disabled>Select KPO</option>
                <option value="All">All KPOs</option>
                {uniqueKPOs.map((kpo) => (
                  <option key={kpo} value={kpo}>{kpo}</option>
                ))}
              </select>
              
              <button 
                onClick={() => setIsGridView(!isGridView)} 
                className={`p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center ${
                  isDarkMode 
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-cyan-500/30" 
                    : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-orange-500/30"
                }`}
              >
                <i className={`fas mr-2 ${isGridView ? "fa-list" : "fa-th-large"}`}></i>
                <span>{isGridView ? "List View" : "Grid View"}</span>
              </button>
            </div>
            
            {/* Files Grid/List */}
            <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {paginatedFiles.map((file) => (
                <div 
                  key={file.id} 
                  className={`p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 ${
                    isGridView ? "" : "flex items-center space-x-4"
                  } ${
                    isDarkMode ? "bg-gray-700/80 hover:bg-gray-600/80" : "bg-white hover:bg-orange-50/80"
                  }`}
                >
                  <div className={isGridView ? "mb-4 text-center" : "flex-shrink-0"}>
                    <i className={`${getFileIcon(file.file_type)} text-5xl ${
                      isDarkMode ? "text-cyan-400" : "text-orange-500"
                    }`}></i>
                  </div>
                  <div className={isGridView ? "" : "flex-grow"}>
                    <h3 className={`font-semibold text-lg ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}>{file.file_name}</h3>
                    <p className={`text-sm font-medium ${
                      isDarkMode ? "text-cyan-400" : "text-orange-600"
                    }`}>{file.kpo_name}</p>
                    <p className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}>{formatDate(file.created_at)}</p>
                    <p className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}>{formatFileSize(file.file_size)}</p>
                  </div>
                  <a 
                    href={file.download_url} 
                    download 
                    className={`mt-4 inline-block px-4 py-2 rounded-lg transition-all duration-300 shadow hover:shadow-md ${
                      isDarkMode 
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-cyan-500/30" 
                        : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-orange-500/30"
                    }`}
                  >
                    <i className="fas fa-download mr-2"></i> Download
                  </a>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-8 flex justify-between items-center">
              <button 
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} 
                disabled={currentPage === 1} 
                className={`px-4 py-2 rounded-lg transition-all duration-300 shadow hover:shadow-md disabled:opacity-50 ${
                  isDarkMode 
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-cyan-500/30" 
                    : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-orange-500/30"
                }`}
              >
                <i className="fas fa-chevron-left mr-2"></i> Previous
              </button>
              <span className={`${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} 
                disabled={currentPage === totalPages} 
                className={`px-4 py-2 rounded-lg transition-all duration-300 shadow hover:shadow-md disabled:opacity-50 ${
                  isDarkMode 
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-cyan-500/30" 
                    : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-orange-500/30"
                }`}
              >
                Next <i className="fas fa-chevron-right ml-2"></i>
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}