'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '../../../store/themeStore';
import clsx from 'clsx';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../../../../lib/supabaseClinent';

interface Region {
  id: number;
  name: string;
}

interface Dzongkhag {
  id: number;
  name: string;
  region_id: number;
  region: Region; // Update this line
}

export default function DzongkhagTable() {
  const { isDarkMode } = useThemeStore();
  const [dzongkhags, setDzongkhags] = useState<Dzongkhag[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [currentDzongkhag, setCurrentDzongkhag] = useState<{ id?: number; name: string; region_id?: number }>({ name: '' });

  // Fetch dzongkhags and regions from Supabase
  useEffect(() => {
    fetchDzongkhags();
    fetchRegions();
  }, []);

  // async function fetchDzongkhags() {
  //   const { data, error } = await supabase
  //     .from('facility_location')
  //     .select('id, name, region_id, region:Region(id, name)')
  //     .order('id');

  //     console.log(data);
      
  //   if (!error && data) setDzongkhags(data);
  // }

async function fetchDzongkhags() {
  const { data, error } = await supabase
    .from('facility_location')
    .select('id, name, region_id, region:Region(id, name)')
    .order('id');

  if (!error && data) {
    setDzongkhags(
      data.map((dzongkhag: any) => ({
        ...dzongkhag,
        region: Array.isArray(dzongkhag.region)
          ? dzongkhag.region[0] || null
          : dzongkhag.region || null,
      }))
    );
  }
}

  async function fetchRegions() {
    const { data, error } = await supabase.from('Region').select('id, name').order('id');
    if (!error && data) setRegions(data);
  }

  // Create or Edit Dzongkhag
  async function handleSave() {
    if (!currentDzongkhag.name.trim() || !currentDzongkhag.region_id) return;
    if (modalType === 'create') {
      const { error } = await supabase.from('facility_location').insert([
        { name: currentDzongkhag.name, region_id: currentDzongkhag.region_id }
      ]);
      if (!error) {
        fetchDzongkhags();
        setIsModalOpen(false);
        setCurrentDzongkhag({ name: '' });
      }
    } else if (modalType === 'edit' && currentDzongkhag.id) {
      const { error } = await supabase.from('facility_location')
        .update({ name: currentDzongkhag.name, region_id: currentDzongkhag.region_id })
        .eq('id', currentDzongkhag.id);
      if (!error) {
        fetchDzongkhags();
        setIsModalOpen(false);
        setCurrentDzongkhag({ name: '' });
      }
    }
  }

  // Delete Dzongkhag
  async function handleDelete(id: number) {
    await supabase.from('facility_location').delete().eq('id', id);
    fetchDzongkhags();
  }

  // Open modal for create or edit
  function openModal(type: 'create' | 'edit', dzongkhag?: Dzongkhag) {
    setModalType(type);
    setCurrentDzongkhag(
      dzongkhag
        ? { id: dzongkhag.id, name: dzongkhag.name, region_id: dzongkhag.region_id }
        : { name: '', region_id: regions[0]?.id }
    );
    setIsModalOpen(true);
  }

  return (
    <>
      <div className="space-y-6">
        <h1 className={clsx("text-2xl font-bold", isDarkMode ? "text-white" : "text-orange-900")}>
          Dzongkhag
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">REGION</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10">
                {dzongkhags.map((dzongkhag, idx) => (
                  <tr key={dzongkhag.id} className="hover:bg-black/10 dark:hover:bg-white/5">
                    <td className="px-6 py-4">{idx + 1}</td>
                    <td className="px-6 py-4">{dzongkhag.name}</td>
                    <td className="px-6 py-4">{dzongkhag.region?.name || ''}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          className="w-8 h-8 rounded bg-indigo-500 text-white flex items-center justify-center"
                          title="Edit"
                          onClick={() => openModal('edit', dzongkhag)}
                        >
                          <Edit size={16} />
                        </button>
                        {/* <button
                          className="w-8 h-8 rounded bg-red-500 text-white flex items-center justify-center"
                          title="Delete"
                          onClick={() => handleDelete(dzongkhag.id)}
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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className={clsx("rounded-lg p-6 w-full max-w-sm shadow-lg", isDarkMode?"bg-gray-900":"bg-white")}>
            <h2 className="text-lg font-semibold mb-4">{modalType === 'create' ? 'Create Dzongkhag' : 'Edit Dzongkhag'}</h2>
            <input
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="Dzongkhag Name"
              value={currentDzongkhag.name}
              onChange={e => setCurrentDzongkhag(r => ({ ...r, name: e.target.value }))}
            />
            <select
              className="w-full border px-3 py-2 rounded mb-4"
              value={currentDzongkhag.region_id}
              onChange={e => setCurrentDzongkhag(r => ({ ...r, region_id: Number(e.target.value) }))}
            >
              {regions.map(region => (
                <option key={region.id} value={region.id}>{region.name}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                className={clsx("px-4 py-2 rounded", isDarkMode?"bg-gray-700":"bg-gray-200")}
                onClick={() => setIsModalOpen(false)}
              >Cancel</button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={handleSave}
                disabled={!currentDzongkhag.name.trim() || !currentDzongkhag.region_id}
              >Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}