

'use client';

import { useState, ChangeEvent, FC } from 'react';

import { useThemeStore } from '../../../store/themeStore';
import clsx from 'clsx';


interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, kpoName: string) => void;
}

const UploadModal: FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const { isDarkMode } = useThemeStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedKpo, setSelectedKpo] = useState<string>('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile && selectedKpo) {
      onUpload(selectedFile, selectedKpo);
    } else {
      alert('Please select a file and a KPO Name.');
    }
  };

  if (!isOpen) return null;

  const labelClasses = clsx(
    "block text-sm font-semibold mb-1",
    isDarkMode ? 'text-cyan-200' : 'text-orange-900/80'
  );
  const selectClasses = clsx(
    "block w-full appearance-none rounded-lg border px-4 py-3 pr-10 transition-colors duration-200 focus:outline-none focus:ring-2",
    isDarkMode
      ? "bg-gray-900 border-indigo-700 text-cyan-100 focus:ring-cyan-500/50 focus:border-cyan-500"
      : "bg-white border-orange-300 text-gray-900 focus:ring-orange-500/50 focus:border-orange-500"
  );
  const modalClasses = clsx(
    "rounded-xl shadow-2xl w-full max-w-lg mx-4 border",
    isDarkMode
      ? "bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 border-indigo-700"
      : "bg-gradient-to-br from-orange-50 via-amber-100 to-pink-100 border-orange-200"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className={modalClasses}>
        {/* Modal Header */}
        <div className={clsx(
          "flex items-center justify-between p-5 border-b",
          isDarkMode ? "border-indigo-700" : "border-orange-200"
        )}>
          <h3 className={clsx("text-xl font-bold", isDarkMode ? 'text-cyan-100' : 'text-orange-900')}>Upload File</h3>
          <button onClick={onClose} className={clsx(
            "text-3xl font-light transition-colors",
            isDarkMode ? "text-cyan-300 hover:text-cyan-100" : "text-gray-400 hover:text-gray-900"
          )}>&times;</button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div>
            <label className={labelClasses}>File</label>
            <div className="flex items-center space-x-4">
              <label className={clsx(
                "cursor-pointer px-4 py-3 rounded-lg border shadow-sm font-medium transition-colors",
                isDarkMode
                  ? "bg-gray-800 text-cyan-100 border-indigo-700 hover:bg-indigo-900"
                  : "bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200"
              )}>
                Choose File
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
              <span className={clsx(
                "text-sm",
                isDarkMode ? "text-cyan-300" : "text-gray-500"
              )}>
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="kpo-select" className={labelClasses}>KPO Name</label>
            <div className="relative">
              <select
                id="kpo-select"
                value={selectedKpo}
                onChange={(e) => setSelectedKpo(e.target.value)}
                className={selectClasses}
                required
              >
                <option value="" disabled className="text-gray-400">Select KPO</option>
                <option value="All Combined">All Combined</option>
                <option value="Lhak-Sam">Lhak-Sam</option>
                <option value="CPA">CPA</option>
                <option value="RPN">RPN</option>
                <option value="Pride-Bhutan">Pride-Bhutan</option>
              </select>
              <div className={clsx(
                "pointer-events-none absolute inset-y-0 right-0 flex items-center px-3",
                isDarkMode ? "text-cyan-300" : "text-gray-500"
              )}>
                <svg className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className={clsx(
          "flex items-center justify-end p-4 space-x-3 rounded-b-xl",
          isDarkMode ? "bg-indigo-900/30" : "bg-orange-100/40"
        )}>
          <button onClick={onClose} className={clsx(
            "px-6 py-2.5 rounded-lg font-semibold transition-colors",
            isDarkMode
              ? "bg-gray-800 hover:bg-indigo-900 text-cyan-100"
              : "bg-gray-200 hover:bg-orange-200 text-gray-800"
          )}>Cancel</button>
          <button onClick={handleUploadClick} className={clsx(
            "text-white px-6 py-2.5 rounded-lg font-semibold transition-all",
            isDarkMode
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/50"
              : "bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg hover:shadow-orange-500/50"
          )}>Upload</button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;

