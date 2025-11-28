'use client';

import StatCard from '../components/Card'; 
import { Users, FileCheck } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClinent';

export default function CardPage() {
  const { isDarkMode } = useThemeStore();
  const [userCount, setUserCount] = useState<number | null>(null);
  const [formCount, setFormCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      // Fetch total users
      const { count: userCount } = await supabase
        .from('Profile')
        .select('*', { count: 'exact', head: true });
      setUserCount(userCount ?? 0);

      // Fetch total submitted forms
      const { count: formCount } = await supabase
        .from('Submission')
        .select('*', { count: 'exact', head: true });
      setFormCount(formCount ?? 0);
    }
    fetchCounts();
  }, []);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className={clsx(
          "text-2xl font-bold",
          isDarkMode ? "text-white" : "text-orange-900"
        )}>
          Dashboard
        </h1>
      </div>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total User" 
          value={userCount !== null ? userCount : '...'} 
          icon={Users} 
          color="blue" 
        />
        <StatCard 
          title="Total Submission" 
          value={formCount !== null ? formCount : '...'} 
          icon={FileCheck}
          color="pink"
        />
      </div>
    </div>
  );
}