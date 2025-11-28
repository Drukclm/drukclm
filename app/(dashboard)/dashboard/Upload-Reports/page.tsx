'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '../../../store/themeStore';
import clsx from 'clsx';
import { Download, Trash2 } from 'lucide-react';
import UploadModal from '../components/UploadModal';
import { supabase } from '../../../../lib/supabaseClinent';

type Report = {
  id: number;
  fileName: string;
  fileSize: string;
  fileType: string;
  kpoName: string;
  uploadDate: string;
  downloadUrl: string;
  storagePath: string;
};

const ActionButton = ({
  icon: Icon,
  colorClass,
  tooltip,
  onClick,
}: {
  icon: React.ElementType;
  colorClass: string;
  tooltip: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    title={tooltip}
    className={clsx(
      'w-9 h-9 rounded-md flex items-center justify-center text-white transition-transform hover:scale-110 shadow-lg',
      colorClass
    )}
  >
    <Icon size={16} />
  </button>
);

export default function UploadReportsTable() {
  const { isDarkMode } = useThemeStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch reports from Supabase
  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('kpo_files')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReports(
        data.map((row: any) => ({
          id: row.id,
          fileName: row.file_name,
          fileSize: row.file_size
            ? `${(row.file_size / 1024).toFixed(2)} KB`
            : '',
          fileType: row.file_type,
          kpoName: row.kpo_name,
          uploadDate: new Date(row.created_at).toLocaleString(),
          downloadUrl: row.download_url,
          storagePath: row.download_url
            ? row.download_url.split('/').slice(-2).join('/')
            : '', // fallback for delete
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Upload handler
  const handleUpload = async (file: File, kpoName: string) => {
    const kpoNameForPath = kpoName.replace(/\s+/g, '-');
    const filePath = `${kpoNameForPath}_${Date.now()}_${file.name}`;

    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('druckclm-reports')
      .upload(filePath, file);

    if (uploadError) {
      alert(`Error uploading file: ${uploadError.message}`);
      return;
    }

    // 2. Get the public URL
    const { data: urlData } = supabase.storage
      .from('druckclm-reports')
      .getPublicUrl(filePath);

    const download_url = urlData?.publicUrl || '';

    // 3. Insert metadata into kpo_files table
    const { error: insertError } = await supabase.from('kpo_files').insert([
      {
        file_name: file.name,
        kpo_name: kpoName,
        file_type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        file_size: file.size,
        download_url,
      },
    ]);
    console.log(insertError);


    if (insertError) {
      alert(`Error saving file metadata: ${insertError.message}`);
      return;
    }

    alert('File uploaded and saved successfully!');
    setIsModalOpen(false);
    fetchReports();
  };

  // Delete handler
  const handleDelete = async (report: Report) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${report.fileName}"? This cannot be undone.`
      )
    )
      return;

    // 1. Remove from storage
    // Extract the storage path from the downloadUrl
    let storagePath = '';
    if (report.downloadUrl) {
      // Example: https://.../object/public/druckclm-reports/SomeFile.pdf
      const parts = report.downloadUrl.split('/druckclm-reports/');
      if (parts.length === 2) {
        storagePath = parts[1];
      }
    }

    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from('druckclm-reports')
        .remove([storagePath]);
      if (storageError) {
        alert(
          `Error deleting file from storage: ${storageError.message}. The database record will still be deleted.`
        );
      }
    }

    // 2. Remove from kpo_files table
    const { error: dbError } = await supabase
      .from('kpo_files')
      .delete()
      .eq('id', report.id);

    if (dbError) {
      alert(`Error deleting file metadata: ${dbError.message}`);
      return;
    }

    setReports((prev) => prev.filter((r) => r.id !== report.id));
  };

  // Download handler
  const handleDownload = (downloadUrl: string) => {
    window.open(downloadUrl, '_blank');
  };

  return (
    <>
      <div
        className={clsx(
          'rounded-xl p-6 sm:p-8 border backdrop-blur-md',
          isDarkMode
            ? 'bg-black/20 border-white/10'
            : 'bg-white/30 border-black/10'
        )}
      >
        <div className="flex flex-col mb-6 gap-4">
          <h2
            className={clsx(
              'text-2xl font-bold',
              isDarkMode ? 'text-gray-100' : 'text-orange-900'
            )}
          >
            Upload Reports
          </h2>

          <button
            onClick={() => setIsModalOpen(true)}
            className={clsx(
              'self-start text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-all',
              isDarkMode
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600'
                : 'bg-gradient-to-r from-amber-500 to-orange-500'
            )}
          >
            Add More
          </button>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className={clsx(
            "min-w-full rounded-xl overflow-hidden",
            isDarkMode ? "bg-gray-800/80 border border-gray-700" : "bg-white/80 border border-orange-200"
          )}>
            <thead className={clsx(
              "sticky top-0 z-20",
              isDarkMode
                ? "bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 text-white"
                : "bg-gradient-to-r from-orange-100 via-amber-100 to-pink-100 text-gray-800"
            )}>
              <tr>
                {[
                  'FILE NAME',
                  'FILE SIZE',
                  'FILE TYPE',
                  'KPO NAME',
                  'UPLOAD DATE',
                  'ACTIONS',
                ].map(header => (
                  <th
                    key={header}
                    className={clsx(
                      "px-6 py-4 text-left text-xs font-bold uppercase tracking-wider",
                      isDarkMode ? "text-cyan-200" : "text-orange-700"
                    )}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={clsx(
              "divide-y",
              isDarkMode ? "divide-gray-700" : "divide-orange-200"
            )}>
              {loading ? (
                <tr>
                  <td colSpan={6} className={clsx(
                    "text-center py-10",
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  )}>Loading...</td>
                </tr>
              ) : reports.length > 0 ? (
                reports.map(report => (
                  <tr
                    key={report.id}
                    className={clsx(
                      "transition-all",
                      isDarkMode
                        ? "hover:bg-indigo-900/30"
                        : "hover:bg-orange-100/60"
                    )}
                  >
                    <td className={clsx("px-6 py-4 font-medium", isDarkMode ? "text-white" : "text-gray-900")}>{report.fileName}</td>
                    <td className={clsx("px-6 py-4", isDarkMode ? "text-cyan-200" : "text-gray-600")}>{report.fileSize}</td>
                    <td className={clsx("px-6 py-4", isDarkMode ? "text-cyan-200" : "text-gray-600")}>{report.fileType}</td>
                    <td className={clsx("px-6 py-4", isDarkMode ? "text-cyan-200" : "text-gray-600")}>{report.kpoName}</td>
                    <td className={clsx("px-6 py-4", isDarkMode ? "text-cyan-200" : "text-gray-600")}>{report.uploadDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ActionButton
                          icon={Download}
                          colorClass={
                            isDarkMode
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                              : 'bg-gradient-to-r from-amber-500 to-orange-500'
                          }
                          tooltip="Download Report"
                          onClick={() => handleDownload(report.downloadUrl)}
                        />
                        <ActionButton
                          icon={Trash2}
                          colorClass="bg-pink-600 hover:bg-pink-700"
                          tooltip="Delete Report"
                          onClick={() => handleDelete(report)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={clsx(
                    "text-center py-10",
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  )}>
                    No reports available. Click &quot;Add More&quot; to upload one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
      />
    </>
  );
}