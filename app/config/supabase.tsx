import { createClient } from '@supabase/supabase-js';

// Access environment variables using import.meta.env
const supabaseUrl = 'https://hpekybazglnxeoibbjsb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwZWt5YmF6Z2xueGVvaWJianNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMDA5MTgsImV4cCI6MjA1ODU3NjkxOH0.wYpw6d_UBguGZ654iK3rINYjqpSCOBGakrIyatSd7K4';

// Check if the environment variables are loaded correctly
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key is missing');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
