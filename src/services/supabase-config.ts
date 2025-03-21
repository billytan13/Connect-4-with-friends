import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbcmjwdiyywjzjgvpitf.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiY21qd2RpeXl3anpqZ3ZwaXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1Njg1MzksImV4cCI6MjA1ODE0NDUzOX0.5Z1-OJmJOjZB-ufgv1yn4XJwm-ygC0jOiyyFRe059O4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
