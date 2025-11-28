// lib/supabaseClient.ts
// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)
// Filename: lib/supabaseClient.ts (Final, Corrected Version)

import { createBrowserClient } from '@supabase/ssr';

// This is the standard and correct way to create a singleton Supabase client
// for use in all of your client-side components ('use client' files).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);