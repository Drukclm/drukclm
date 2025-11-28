'use client';

import { useState, useEffect } from 'react';
import { useThemeStore } from '../../../store/themeStore';
import useAuthStore from '../../../store/authStore';
import clsx from 'clsx';
import {
  Plus, Eye, Edit, Trash2
} from 'lucide-react';

import CreateUserModal from '../components/CreateUserModal';
import UpdateUserModel from '../components/UpdateUserModel';
import { supabase } from '../../../../lib/supabaseClinent';

// Types updated with kpo_name
type User = {
  id: number;
  auth_id: string;
  name: string;
  email: string;
  phone: string;
  country_code: string;
  role: string;
  kpo_name?: string;
};
type UserDataPayload = {
  name: string;
  email: string;
  password?: string;
  countryCode: string;
  phoneNumber: string;
  role: string;
  kpo_name?: string;
  auth_id?: string;
};



const RoleBadge = ({ role }: { role: string }) => (
  <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">{role}</span>
);
const ActionButton = ({ icon: Icon, colorClass, tooltip, onClick }: { icon: any, colorClass: string, tooltip: string, onClick?: () => void }) => (
  <button onClick={onClick} title={tooltip} className={clsx('w-8 h-8 rounded flex items-center justify-center text-white transition-transform hover:scale-110 shadow-md', colorClass)}>
    <Icon size={16} />
  </button>
);

export default function UserManagementTable() {
  const { isDarkMode } = useThemeStore();
  const { profile } = useAuthStore();

  // Use separate states for each modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const isCreatorAdmin = profile?.role?.toLowerCase() === 'admin';

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('Profile').select('*, kpo_name').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleOpenEditModal = (user: User) => {
    setUserToEdit(user);
    setIsUpdateModalOpen(true);
  };
  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsUpdateModalOpen(false);
    setUserToEdit(null);
  };

  const handleCreateUser = async (newUser: UserDataPayload) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-user', { body: newUser });
      if (error) throw new Error(error.message);
      alert(data.message);
      fetchAllUsers();
      handleCloseModals();
    } catch (err: any) {
      alert(`Failed to create user: ${err.message}`);
    }
  };
  const handleUpdateUser = async (updatedUser: UserDataPayload) => {
    try {
      const { data, error } = await supabase.functions.invoke('update-user', { body: updatedUser });
      if (error) throw new Error(error.message);
      alert(data.message || 'User updated successfully.');
      fetchAllUsers();
      handleCloseModals();
    } catch (err: any) {
      alert(`Failed to update user: ${err.message}`);
    }
  };
  const handleDeleteUser = async (auth_id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const { error } = await supabase.functions.invoke('delete-user', { body: { auth_id } });
      if (error) throw new Error(error.message);
      alert('User deleted.');
      fetchAllUsers();
    } catch (err: any) {
      alert(`Failed to delete user: ${err.message}`);
    }
  };

  return (
    <>
      <div className='space-y-6'>
        <h1 className={clsx("text-2xl font-bold", isDarkMode ? "text-white" : "text-orange-900")}>User Management</h1>
        <div className={clsx("rounded-xl p-6 sm:p-8 border backdrop-blur-md", isDarkMode ? "bg-black/20 border-white/10" : "bg-white/30 border-black/10")}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={handleOpenCreateModal} className={clsx('flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-md transform hover:scale-105 text-white', isDarkMode ? "bg-gradient-to-r from-cyan-500 to-blue-500" : "bg-gradient-to-r from-amber-500 to-orange-500")}>
                <Plus size={16} />
                <span>Create User</span>
              </button>
            </div>
          </div>
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
                  {['NAME', 'EMAIL', 'ROLE', 'KPO NAME', 'PHONE', 'ACTION'].map(header => (
                    <th key={header} className={clsx(
                      "px-6 py-3 text-left text-xs font-bold uppercase tracking-wider",
                      isDarkMode ? "text-cyan-200" : "text-orange-700"
                    )}>{header}</th>
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
                      "text-center p-4",
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    )}>Loading...</td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr
                      key={user.id}
                      className={clsx(
                        "transition-all",
                        isDarkMode
                          ? "hover:bg-indigo-900/30"
                          : "hover:bg-orange-100/60"
                      )}
                    >
                      <td className={clsx("px-6 py-4 font-medium", isDarkMode ? "text-white" : "text-gray-900")}>{user.name}</td>
                      <td className={clsx("px-6 py-4", isDarkMode ? "text-cyan-200" : "text-gray-600")}>{user.email}</td>
                      <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                      <td className={clsx("px-6 py-4 capitalize", isDarkMode ? "text-cyan-200" : "text-gray-600")}>
                        {user.role === 'kpo' ? user.kpo_name?.replace(/_/g, ' ') || 'N/A' : '—'}
                      </td>
                      <td className={clsx("px-6 py-4", isDarkMode ? "text-cyan-200" : "text-gray-600")}>{user.phone}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* <ActionButton icon={Eye} colorClass="bg-cyan-500" tooltip="View" /> */}
                          {isCreatorAdmin && (
                            <>
                              <ActionButton icon={Edit} colorClass="bg-indigo-500" tooltip="Edit" onClick={() => handleOpenEditModal(user)} />
                              <ActionButton icon={Trash2} colorClass="bg-red-500" tooltip="Delete" onClick={() => handleDeleteUser(user.auth_id)} />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModals}
        onCreate={handleCreateUser}
      />
      <UpdateUserModel
        isOpen={isUpdateModalOpen}
        onClose={handleCloseModals}
        onUpdate={handleUpdateUser}
        onCreate={handleCreateUser}
        userToEdit={userToEdit}
      />
    </>
  );
}