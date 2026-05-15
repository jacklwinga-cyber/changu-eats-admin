import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True when production deploy has set Vite env vars (matches mobile `EXPO_PUBLIC_*` project). */
export const isSupabaseConfigured = Boolean(
  url &&
    key &&
    url.includes('supabase.co') &&
    key.length > 80 &&
    !key.includes('YOUR_ANON') &&
    !key.includes('placeholder')
);

const supabaseUrl = url ?? 'https://invalid.supabase.local';
const supabaseAnonKey = key ?? 'invalid-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function testSupabaseRead(): Promise<{ ok: boolean; detail: string }> {
  if (!isSupabaseConfigured) {
    return { ok: false, detail: 'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY on the host (same project as the ChanguEats app).' };
  }
  const { error, count } = await supabase.from('restaurants').select('*', { count: 'exact', head: true });
  if (error) return { ok: false, detail: error.message };
  return { ok: true, detail: `Connected. restaurants row count ~${count ?? 0}.` };
}
