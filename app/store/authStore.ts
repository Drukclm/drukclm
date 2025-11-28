import { create } from 'zustand';
import { supabase } from '../../lib/supabaseClinent';
import type { Session, User } from '@supabase/supabase-js';

interface Profile {
  id: number;
  auth_id: string;
  name: string;
  email: string;
  phone: string;
  country_code: string;
  role: string;
  kpo_name?: string;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoggedIn: boolean;
  loading: boolean;
  setSessionAndProfile: (session: Session | null) => Promise<void>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  profile: null,
  isLoggedIn: false,
  loading: true,

  setSessionAndProfile: async (session) => {
    if (!session) {
      set({ session: null, user: null, profile: null, isLoggedIn: false, loading: false });
      return;
    }
    try {
      const { data: profileData, error } = await supabase
        .from('Profile')
        .select('*')
        .eq('auth_id', session.user.id)
        .single();
      if (error) throw error;
      set({ session, user: session.user, profile: profileData, isLoggedIn: true, loading: false });
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      set({ session, user: session.user, profile: null, isLoggedIn: true, loading: false });
    }
  },

  // Only clears state, NO router here
  logout: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null, isLoggedIn: false, loading: false });
  },
}));

export default useAuthStore;
