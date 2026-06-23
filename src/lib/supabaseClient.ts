import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("LOG: [Supabase] Cloud tracking credentials missing from .env environment configuration.");
}

// Export a single connection client to use anywhere in your user interface components
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
