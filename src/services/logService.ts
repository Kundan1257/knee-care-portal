import { supabase } from '../lib/supabaseClient.ts';

export interface KneeLogEntry {
  user_id: string;
  pain_score: number;
  stiffness: boolean;
}

// 🚀 Saves a new daily knee tracker log straight to your cloud database
export const saveKneeLog = async (entry: KneeLogEntry) => {
  try {
    const { data, error } = await supabase
      .from('knee_logs')
      .insert([entry])
      .select();

    if (error) throw error;
    console.log("LOG: [Supabase] Entry saved successfully! 🗄️", data);
    return data;
  } catch (error: any) {
    console.error("LOG: [Supabase] Save error:", error.message);
    return null;
  }
};

// 📈 Fetches the user's history log to populate progress graphs
export const getKneeLogHistory = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('knee_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("LOG: [Supabase] Fetch history error:", error.message);
    return [];
  }
};
