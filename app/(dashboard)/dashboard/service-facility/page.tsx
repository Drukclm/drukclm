'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '../../../store/themeStore';
import clsx from 'clsx';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../../../../lib/supabaseClinent';

export default function ServiceFacilityTable() {
  const { isDarkMode } = useThemeStore();
  const [facilities, setFacilities] = useState<{ id: number; name: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [currentFacility, setCurrentFacility] = useState<{ id?: number; name: string }>({ name: '' });

  // Fetch facilities from Supabase
  useEffect(() => {
    fetchFacilities();
  }, []);

  async function fetchFacilities() {
    const { data, error } = await supabase.from('service_facility').select('id, name').order('id');
    if (!error && data) setFacilities(data);
  }

  // Create or Edit Facility

  // Just to run a build 
  async function handleSave() {
    if (modalType === 'create') {
      const { error } = await supabase.from('service_facility').insert([{ name: currentFacility.name }]);
      if (!error) {
        fetchFacilities();
        setIsModalOpen(false);
        setCurrentFacility({ name: '' });
      }
    } else if (modalType === 'edit' && currentFacility.id) {
      const { error } = await supabase.from('service_facility').update({ name: currentFacility.name }).eq('id', currentFacility.id);
      if (!error) {
        fetchFacilities();
        setIsModalOpen(false);
        setCurrentFacility({ name: '' });
      }
    }
  }

  // Delete Facility
  async function handleDelete(id: number) {
    await supabase.from('service_facility').delete().eq('id', id);
    fetchFacilities();
  }

  // Open modal for create or edit
  function openModal(type: 'create' | 'edit', facility?: { id: number; name: string }) {
    setModalType(type);
    setCurrentFacility(facility ? { ...facility } : { name: '' });
    setIsModalOpen(true);
  }

  return (
    <>
      <div className="space-y-6">
        <h1 className={clsx("text-2xl font-bold", isDarkMode ? "text-white" : "text-orange-900")}>
          Service Facility
        </h1>
        <div className={clsx(
          "rounded-xl p-6 sm:p-8 border backdrop-blur-md",
          isDarkMode ? "bg-black/20 border-white/10" : "bg-white/30 border-black/10"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => openModal('create')}
              className={clsx(
                'flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg shadow-md',
                isDarkMode
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
              )}
            >
              <Plus size={16} /> Create
            </button>
          </div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-black/10 dark:bg-black/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">NO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">NAME</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10">
                {facilities.map((facility, idx) => (
                  <tr key={facility.id} className="hover:bg-black/10 dark:hover:bg-white/5">
                    <td className="px-6 py-4">{idx + 1}</td>
                    <td className="px-6 py-4">{facility.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          className="w-8 h-8 rounded bg-indigo-500 text-white flex items-center justify-center"
                          title="Edit"
                          onClick={() => openModal('edit', facility)}
                        >
                          <Edit size={16} />
                        </button>
                        {/* <button
                          className="w-8 h-8 rounded bg-red-500 text-white flex items-center justify-center"
                          title="Delete"
                          onClick={() => handleDelete(facility.id)}
                        >
                          <Trash2 size={16} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Modal for create/edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className={clsx(
            "rounded-lg p-6 w-full max-w-sm shadow-lg",isDarkMode?"bg-gray-900":"bg-white"
          )}>
            <h2 className="text-lg font-semibold mb-4">{modalType === 'create' ? 'Create Service Facility' : 'Edit Service Facility'}</h2>
            <input
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="Facility Name"
              value={currentFacility.name}
              onChange={e => setCurrentFacility(f => ({ ...f, name: e.target.value }))}
            />
            <div className="flex justify-end gap-2">
              <button
                className={clsx("px-4 py-2 rounded", isDarkMode?"bg-gray-700":"bg-gray-200")}
                onClick={() => setIsModalOpen(false)}
              >Cancel</button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={handleSave}
                disabled={!currentFacility.name.trim()}
              >Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}