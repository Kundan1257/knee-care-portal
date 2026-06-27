import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl.trim(), supabaseAnonKey.trim());

interface KneeLogData {
  user_id: string;
  pain_score: number;
  stiffness: boolean;
}

export const saveKneeLog = async (logData: KneeLogData): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('knee_logs')
      .insert([
        {
          user_id: logData.user_id,
          pain_score: logData.pain_score,
          stiffness: logData.stiffness,
          created_at: new Date().toISOString()
        }
      ]);
    if (error) return false;
    return true;
  } catch (err) {
    return false;
  }
};
