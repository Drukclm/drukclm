'use client';

import { useState, useEffect } from 'react';
import { useThemeStore } from '../../../store/themeStore';
import clsx from 'clsx';
import { Save, User, Lock, Trash2 } from 'lucide-react';
import useAuthStore from '@/app/store/authStore';
import { supabase } from '@/lib/supabaseClinent'; // adjust path as needed


const sidebarLinks = [
  { href: '#profile-header', label: 'Profile' },
  { href: '#basic-info', label: 'Basic Info' },
  { href: '#login-details', label: 'Login Details' },
  { href: '#delete-account', label: 'Delete Account' },
];

export default function ProfilePage() {
  const { isDarkMode } = useThemeStore();
  const [activeSection, setActiveSection] = useState('#profile-header');
  const { loading, profile, logout, setSessionAndProfile } = useAuthStore();

  // Controlled form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [basicInfoLoading, setBasicInfoLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


  const [configEmail, setConfigEmail] = useState('');
  const [configEmailPass, setConfigEmailPass] = useState('');


  const handelSaveConfigEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBasicInfoLoading(true);
    setMessage('');
    setError('');
    try {
      const { error } = await supabase
        .from('config')
        .upsert([
          { meta_key: 'config_email', meta_value: configEmail },
          { meta_key: 'config_email_pass', meta_value: configEmailPass }
        ], { onConflict: 'meta_key' });
      if (error) throw new Error(error.message);
      setMessage('Config email and password saved successfully.');
    } catch (err: any) {
      setError(err.message || 'Network error.');
    }
    setBasicInfoLoading(false);
  };

  useEffect(() => {
    async function fetchConfig() {
      const { data, error } = await supabase
        .from('config')
        .select('meta_key, meta_value')
        .in('meta_key', ['config_email', 'config_email_pass']);
      if (data && Array.isArray(data)) {
        const emailRow = data.find(row => row.meta_key === 'config_email');
        const passRow = data.find(row => row.meta_key === 'config_email_pass');
        if (emailRow) setConfigEmail(emailRow.meta_value);
        if (passRow) setConfigEmailPass(passRow.meta_value);
      }
    }
    fetchConfig();
  }, []);

  // Sync form state with profile
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setEmail(profile.email || '');
      setCountryCode(profile.country_code || '+975');
    }
  }, [profile]);





  // Save Basic Info
  const handleSaveBasicInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setBasicInfoLoading(true);
    setMessage('');
    setError('');

    // Strip country code from phone number before saving
    let localPhone = phone;
    if (localPhone.startsWith(countryCode)) {
      localPhone = localPhone.slice(countryCode.length);
    }
    localPhone = localPhone.replace(/^\+/, ''); // Remove any leading '+'

    try {
      const { data, error } = await supabase.functions.invoke('update-user', {
        body: {
          auth_id: profile?.auth_id,
          name,
          email,
          countryCode,
          phoneNumber: localPhone, // <-- only local number!
          role: profile?.role,
          kpo_name: profile?.kpo_name,
        }
      });
      if (error) throw new Error(error.message);
      setMessage(data?.message || 'Profile updated successfully.');
      // Optionally, refresh profile from Supabase here
    } catch (err: any) {
      setError(err.message || 'Network error.');
    }
    setBasicInfoLoading(false);
  };
  // Update Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setMessage('');
    setError('');
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      setPasswordLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setPasswordLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.functions.invoke('update-user', {
        body: {
          auth_id: profile?.auth_id,
          password,
        }
      });
      if (error) throw new Error(error.message);
      setMessage(data?.message || 'Password updated successfully.');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Network error.');
    }
    setPasswordLoading(false);
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    setDeleteLoading(true);
    setMessage('');
    setError('');
    try {
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { auth_id: profile?.auth_id }
      });
      if (error) throw new Error(error.message);
      setMessage(data?.message || 'Account deleted. Logging out...');
      setTimeout(() => {
        logout();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Network error.');
    }
    setDeleteLoading(false);
  };

  // UI classes (unchanged)
  const inputClasses = clsx(
    "mt-1 block w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2",
    isDarkMode
      ? "bg-gray-700/50 border-gray-600 text-white focus:ring-cyan-500/50 focus:border-cyan-500"
      : "bg-white/50 border-orange-200/50 text-gray-900 focus:ring-orange-500/50 focus:border-orange-500"
  );
  const primaryButtonClasses = clsx(
    "flex items-center gap-2 text-white font-semibold px-6 py-2 rounded-lg transition-all shadow-md transform hover:scale-105",
    isDarkMode
      ? "bg-gradient-to-r from-cyan-500 to-blue-500"
      : "bg-gradient-to-r from-amber-500 to-orange-500"
  );
  const cardClasses = clsx(
    "rounded-xl border backdrop-blur-md",
    isDarkMode
      ? "bg-black/20 border-white/10"
      : "bg-white/30 border-black/10"
  );
  const cardHeaderClasses = clsx(
    "p-6 border-b",
    isDarkMode ? "border-white/10" : "border-black/10"
  );
  const cardTitleClasses = clsx("text-xl font-semibold flex items-center gap-2", isDarkMode ? "text-gray-100" : "text-orange-950");
  const cardSubtitleClasses = clsx("text-sm mt-1", isDarkMode ? "text-gray-400" : "text-gray-600");
  const formLabelClasses = clsx("block text-sm font-medium", isDarkMode ? "text-gray-300" : "text-orange-900/80");

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="w-full lg:w-1/4">
        <div className="sticky top-24">
          <div className={clsx("rounded-lg p-2", cardClasses)}>
            <nav className="flex flex-col space-y-1">
              {sidebarLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setActiveSection(link.href)}
                  className={clsx(
                    "px-4 py-2 rounded-md text-sm font-medium transition-all",
                    activeSection === link.href
                      ? isDarkMode
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                        : "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                      : isDarkMode
                        ? "text-gray-300 hover:bg-gray-700/50"
                        : "text-gray-600 hover:bg-orange-100/70"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      <main className="w-full lg:w-3/4 space-y-8">
        <section id="profile-header" className={clsx(
          "rounded-xl p-6 text-white shadow-lg",
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900"
            : "bg-gradient-to-br from-amber-600 via-orange-600 to-red-600"
        )}>
          <div className="flex items-center gap-6">
            <div>
              <h3 className="text-2xl font-bold">{profile?.name}</h3>
              <p className="text-md">{profile?.email}</p>
              <p className="text-sm opacity-80 mt-1">{profile?.role}</p>
            </div>
          </div>
        </section>

        <section id="basic-info" className={cardClasses}>
          <div className={cardHeaderClasses}>
            <h3 className={cardTitleClasses}><User size={20} /> Basic Info</h3>
            <p className={cardSubtitleClasses}>Update your personal details.</p>
          </div>
          <form className="p-6 space-y-6" onSubmit={handleSaveBasicInfo}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullname" className={formLabelClasses}>Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="phone" className={formLabelClasses}>Phone</label>
                <input
                  type="text"
                  id="phone"
                  placeholder="Enter phone"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-black/10 dark:border-white/10">
              <button type="submit" className={primaryButtonClasses} disabled={basicInfoLoading}>
                <Save size={18} /> {basicInfoLoading ? "Saving..." : "Save Basic Info"}
              </button>
            </div>
            {message && <div className="text-green-600 mt-2">{message}</div>}
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </form>
        </section>
        {profile?.role === "admin" && (
          <section id="email-config" className={cardClasses}>
            <div className={cardHeaderClasses}>
              <h3 className={cardTitleClasses}><User size={20} /> Email Config</h3>
            </div>
            <form className="p-6 space-y-6" onSubmit={handelSaveConfigEmail}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="ConfigaretionEmail" className={formLabelClasses}>Configaretion Email</label>
                  <input
                    type="text"
                    id="ConfigaretionEmail"
                    value={configEmail}
                    onChange={e => setConfigEmail(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="ConfigaretionEmailpassword" className={formLabelClasses}>Configaretion Email Password</label>
                  <input
                    type="password"
                    id="ConfigaretionEmailpassword"
                    value={configEmailPass}
                    onChange={e => setConfigEmailPass(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-black/10 dark:border-white/10">
                <button type="submit" className={primaryButtonClasses} disabled={basicInfoLoading}>
                  <Save size={18} /> {basicInfoLoading ? "Saving..." : "Save Configaretion Email"}
                </button>
              </div>
              {message && <div className="text-green-600 mt-2">{message}</div>}
              {error && <div className="text-red-600 mt-2">{error}</div>}
            </form>
          </section>
        )}

        <section id="login-details" className={cardClasses}>
          <div className={cardHeaderClasses}>
            <h3 className={cardTitleClasses}><Lock size={20} /> Login Details</h3>
            <p className={cardSubtitleClasses}>Change your password.</p>
          </div>
          <form className="p-6 space-y-6" onSubmit={handleChangePassword}>
            <div>
              <label htmlFor="email" className={formLabelClasses}>Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={inputClasses}
                disabled
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className={formLabelClasses}>New Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="password_confirmation" className={formLabelClasses}>Confirm New Password</label>
                <input
                  type="password"
                  id="password_confirmation"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-black/10 dark:border-white/10">
              <button type="submit" className={primaryButtonClasses} disabled={passwordLoading}>
                <Save size={18} /> {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
            {message && <div className="text-green-600 mt-2">{message}</div>}
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </form>
        </section>

        <section id="delete-account" className={clsx("rounded-xl border-2 backdrop-blur-md", isDarkMode ? "bg-black/20 border-red-500/30" : "bg-white/30 border-red-300")}>
          <div className="p-6 border-b border-red-500/30">
            <h3 className="text-xl font-semibold flex items-center gap-2 text-red-500 dark:text-red-400"><Trash2 size={20} /> Delete Account</h3>
            <p className={cardSubtitleClasses}>Once you delete your account, there is no going back.</p>
          </div>
          <div className="p-6 flex justify-end">
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete My Account"}
            </button>
            {message && <div className="text-green-600 mt-2">{message}</div>}
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </div>
        </section>
      </main>
    </div>
  );
}