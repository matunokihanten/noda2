import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgqikbwaxxeullzerhek.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncWlrYndheHhldWxsemVyaGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNDcwNjMsImV4cCI6MjA4NjYyMzA2M30.mJCqTt_O4Q0hLImMQLAZa_I90L2jfE7XUmeWaGkLxK0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
