'use client';
import { useEffect } from 'react';
import { supabase } from '../../lib/supabaseClinent';
import useAuthStore from '../store/authStore';

export default function AuthListener({ children }: { children: React.ReactNode }) {
  const { setSessionAndProfile } = useAuthStore();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed, calling setSessionAndProfile...");
      setSessionAndProfile(session);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setSessionAndProfile]);

  return <>{children}</>;
}
