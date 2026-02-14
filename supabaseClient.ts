import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgqikbwaxxeullzerhek.supabase.co';
const supabaseAnonKey = 'ここにanon_keyを貼り付けてください';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
