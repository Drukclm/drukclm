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
  region: Region | null;
}

interface ServiceFacility {
  id: number;
  name: string;
}

interface Hospital {
  id: number;
  name: string;
  facility_location_id: number;
  dzongkhag: Dzongkhag | null;
  service_facility: ServiceFacility | null;
}

export default function HospitalTable() {
  const { isDarkMode } = useThemeStore();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [dzongkhags, setDzongkhags] = useState<Dzongkhag[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [serviceFacilities, setServiceFacilities] = useState<ServiceFacility[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [currentHospital, setCurrentHospital] = useState<{
    id?: number;
    name: string;
    facility_location_id?: number;
    service_facility?: number;
  }>({ name: '' });

  // Fetch hospitals, dzongkhags, regions, and service facilities from Supabase
  useEffect(() => {
    fetchHospitals();
    fetchDzongkhags();
    fetchRegions();
    fetchServiceFacilities();
  }, []);

  async function fetchHospitals() {
    const { data, error } = await supabase
      .from('facility_name')
      .select('id, name, facility_location_id, service_facility, service_facility_obj:service_facility(id, name), dzongkhag:facility_location(id, name, region_id, region:Region(id, name))')
      .order('id');

    if (!error && data) {
      setHospitals(
        data.map((hospital: any) => ({
          ...hospital,
          service_facility: hospital.service_facility_obj
            ? (Array.isArray(hospital.service_facility_obj) ? hospital.service_facility_obj[0] : hospital.service_facility_obj)
            : null,
          dzongkhag: hospital.dzongkhag
            ? {
                ...hospital.dzongkhag,
                region: Array.isArray(hospital.dzongkhag.region)
                  ? hospital.dzongkhag.region[0] || null
                  : hospital.dzongkhag.region || null,
              }
            : null,
        }))
      );
    }
  }

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

  async function fetchServiceFacilities() {
    const { data, error } = await supabase.from('service_facility').select('id, name').order('id');
    if (!error && data) setServiceFacilities(data);
  }

  // Create or Edit Hospital
  async function handleSave() {
    if (!currentHospital.name.trim() || !currentHospital.facility_location_id || !currentHospital.service_facility) return;
    if (modalType === 'create') {
      const { error } = await supabase.from('facility_name').insert([
        {
          name: currentHospital.name,
          facility_location_id: currentHospital.facility_location_id,
          service_facility: currentHospital.service_facility,
        }
      ]);
      if (!error) {
        fetchHospitals();
        setIsModalOpen(false);
        setCurrentHospital({ name: '' });
      }
    } else if (modalType === 'edit' && currentHospital.id) {
      const { error } = await supabase.from('facility_name')
        .update({
          name: currentHospital.name,
          facility_location_id: currentHospital.facility_location_id,
          service_facility: currentHospital.service_facility,
        })
        .eq('id', currentHospital.id);
      if (!error) {
        fetchHospitals();
        setIsModalOpen(false);
        setCurrentHospital({ name: '' });
      }
    }
  }

  // Delete Hospital
  async function handleDelete(id: number) {
    await supabase.from('facility_name').delete().eq('id', id);
    fetchHospitals();
  }

  // Open modal for create or edit
  function openModal(type: 'create' | 'edit', hospital?: Hospital) {
    setModalType(type);
    setCurrentHospital(
      hospital
        ? {
            id: hospital.id,
            name: hospital.name,
            facility_location_id: hospital.facility_location_id,
            service_facility: hospital.service_facility?.id,
          }
        : {
            name: '',
            facility_location_id: dzongkhags[0]?.id,
            service_facility: serviceFacilities[0]?.id,
          }
    );
    setIsModalOpen(true);
  }

  return (
    <>
      <div className="space-y-6">
        <h1 className={clsx("text-2xl font-bold", isDarkMode ? "text-white" : "text-orange-900")}>
          Hospital
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">DZONGKHAG</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">REGION</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">SERVICE FACILITY</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10">
                {hospitals.map((hospital, idx) => (
                  <tr key={hospital.id} className="hover:bg-black/10 dark:hover:bg-white/5">
                    <td className="px-6 py-4">{idx + 1}</td>
                    <td className="px-6 py-4">{hospital.name}</td>
                    <td className="px-6 py-4">{hospital.dzongkhag?.name || ''}</td>
                    <td className="px-6 py-4">{hospital.dzongkhag?.region?.name || ''}</td>
                    <td className="px-6 py-4">{hospital.service_facility?.name || ''}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          className="w-8 h-8 rounded bg-indigo-500 text-white flex items-center justify-center"
                          title="Edit"
                          onClick={() => openModal('edit', hospital)}
                        >
                          <Edit size={16} />
                        </button>
                        {/* <button
                          className="w-8 h-8 rounded bg-red-500 text-white flex items-center justify-center"
                          title="Delete"
                          onClick={() => handleDelete(hospital.id)}
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
          <div className={clsx(
            "rounded-lg p-6 w-full max-w-sm shadow-lg",isDarkMode?"bg-gray-900":"bg-white"
          )}>
            <h2 className="text-lg font-semibold mb-4">{modalType === 'create' ? 'Create Hospital' : 'Edit Hospital'}</h2>
            <input
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="Hospital Name"
              value={currentHospital.name}
              onChange={e => setCurrentHospital(r => ({ ...r, name: e.target.value }))}
            />
            <select
              className="w-full border px-3 py-2 rounded mb-4"
              value={currentHospital.facility_location_id}
              onChange={e => setCurrentHospital(r => ({ ...r, facility_location_id: Number(e.target.value) }))}
            >
              {dzongkhags.map(dzongkhag => (
                <option key={dzongkhag.id} value={dzongkhag.id}>
                  {dzongkhag.name} ({dzongkhag.region?.name || ''})
                </option>
              ))}
            </select>
            <select
              className="w-full border px-3 py-2 rounded mb-4"
              value={currentHospital.service_facility || ''}
              onChange={e => setCurrentHospital(r => ({ ...r, service_facility: Number(e.target.value) }))}
            >
              <option value="">Select Service Facility</option>
              {serviceFacilities.map(sf => (
                <option key={sf.id} value={sf.id}>{sf.name}</option>
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
                disabled={!currentHospital.name.trim() || !currentHospital.facility_location_id || !currentHospital.service_facility}
              >Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}