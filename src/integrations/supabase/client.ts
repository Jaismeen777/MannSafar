import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://harcnkiwrxmajvxvyznv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhcmNua2l3cnhtYWp2eHZ5em52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzI0NDgsImV4cCI6MjA3MjMwODQ0OH0.EkAWRTGl8xZOHIGfu5GhYPm4MaeN6JVjr5cA1OY2r0g";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});