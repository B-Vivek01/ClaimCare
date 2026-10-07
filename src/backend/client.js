import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
export const configured = Boolean(url && key);
export const supabase = configured ? createClient(url, key) : null;
export function requireBackend() {
  if (!supabase) throw new Error('Supabase is not configured. Add the project URL and publishable key to .env.local, then restart the app.');
  return supabase;
}
