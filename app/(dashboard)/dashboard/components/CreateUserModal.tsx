'use client';

import { useState, FC, ChangeEvent, ReactNode } from 'react';
import { useThemeStore } from '../../../store/themeStore';
import clsx from 'clsx';


type NewUserData = {
  name: string;
  email: string;
  password: string;
  countryCode: string;
  phoneNumber: string;
  role: string;
  kpo_name?: string;
};

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (userData: NewUserData) => void;
}


const FormInput: FC<any> = ({ label, type = 'text', placeholder, value, onChange }) => {
  const { isDarkMode } = useThemeStore();
  return (
    <div className="space-y-2">
      <label className={clsx("block text-sm font-semibold", isDarkMode ? 'text-gray-300' : 'text-orange-900/80')}>{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} className={clsx("block w-full rounded-lg border px-4 py-3", isDarkMode ? "bg-gray-700/50 border-gray-600 text-gray-200" : "bg-white/50 border-orange-200/50 text-gray-900")} />
    </div>
  );
};
const FormSelect: FC<any> = ({ label, value, onChange, children }) => {
  const { isDarkMode } = useThemeStore();
  return (
    <div className="space-y-2">
      <label className={clsx("block text-sm font-semibold", isDarkMode ? 'text-gray-300' : 'text-orange-900/80')}>{label}</label>
      <div className="relative">
        <select value={value} onChange={onChange} className={clsx("block w-full appearance-none rounded-lg border px-4 py-3 pr-10", isDarkMode ? "bg-gray-700/50 border-gray-600 text-gray-200" : "bg-white/50 border-orange-200/50 text-gray-900")}>
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"><svg className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg></div>
      </div>
    </div>
  );
};


const CreateUserModal: FC<CreateUserModalProps> = ({ isOpen, onClose, onCreate }) => {
  const { isDarkMode } = useThemeStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+975');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');

 const handleSave = () => {
  const KPO_VALUES = ['pride_bhutan', 'lhak_sam', 'chithuen_phendhey', 'red_purse_network', 'druk_clm', 'others'];
  const isKpoRole = KPO_VALUES.includes(role);

  const userData: NewUserData = {
    name: name.trim(),
    email: email.trim(),
    password: password,
    countryCode: countryCode.trim(),
    phoneNumber: phoneNumber.trim(),
    role: isKpoRole ? 'kpo' : role.trim(),
    kpo_name: isKpoRole ? role.trim() : undefined,
  };

  // Full validation
  if (!userData.name || !userData.email || !userData.password || !userData.role) {
    alert('Please fill in all required fields.');
    return;
  }
  if (userData.password.length < 6) {
    alert('Password must be at least 6 characters.');
    return;
  }
  if (userData.password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  onCreate(userData);
}

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className={clsx("rounded-xl shadow-2xl w-full max-w-lg mx-4 border", isDarkMode ? "bg-gray-800/60 border-white/10" : "bg-amber-50/60 border-black/10")}>
        <div className="flex items-center justify-between p-5 border-b border-gray-500/20">
          <h3 className={clsx("text-xl font-bold", isDarkMode ? 'text-gray-100' : 'text-orange-900')}>Create User</h3>
          <button onClick={onClose} className="text-gray-400 text-3xl font-light hover:text-gray-900 dark:hover:text-gray-200">&times;</button>
        </div>

        
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <FormInput label="Name" placeholder="Enter name" value={name} onChange={(e: any) => setName(e.target.value)} />
          <FormInput label="Email" type="email" placeholder="Enter email address" value={email} onChange={(e: any) => setEmail(e.target.value)} />
          <FormInput label="Password" type="password" placeholder="Enter password" value={password} onChange={(e: any) => setPassword(e.target.value)} />
          <FormInput label="Confirm Password" type="password" placeholder="Enter confirm password" value={confirmPassword} onChange={(e: any) => setConfirmPassword(e.target.value)} />

          <FormSelect label="Country Code" value={countryCode} onChange={(e: any) => setCountryCode(e.target.value)}>
            <option value="+975">🇧🇹 +975 Bhutan</option>
            <option value="+91">🇮🇳 +91 India</option>
          </FormSelect>

          <FormInput label="Phone Number" placeholder="Enter phone Number" value={phoneNumber} onChange={(e: any) => setPhoneNumber(e.target.value)} />

          <FormSelect label="Role" value={role} onChange={(e: any) => setRole(e.target.value)}>
            <option value="" disabled>Select role</option>
            <option value="admin">Admin</option>
            {/* <option value="user">User</option> */}
            <optgroup label="KPO">
              <option value="pride_bhutan">Pride Bhutan</option>
              <option value="lhak_sam">Lhak-Sam</option>
              <option value="chithuen_phendhey">Chithuen Phendhey</option>
              <option value="red_purse_network">Red Purse Network</option>
              <option value="others">Others</option>
            </optgroup>
          </FormSelect>

        </div>

        <div className="flex items-center justify-end p-4 space-x-3 bg-black/10 dark:bg-black/20 rounded-b-xl">
          <button onClick={onClose} className={clsx("px-6 py-2.5 rounded-lg font-semibold", isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800")}>Cancel</button>
          <button onClick={handleSave} className={clsx("text-white px-6 py-2.5 rounded-lg font-semibold", isDarkMode ? "bg-gradient-to-r from-cyan-500 to-blue-500" : "bg-gradient-to-r from-amber-500 to-orange-500")}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;