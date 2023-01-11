import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://eiegziqzsjsmfkcybyke.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpZWd6aXF6c2pzbWZrY3lieWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzMzOTYzNTAsImV4cCI6MTk4ODk3MjM1MH0.lCDcvF4_8vr_gretUnwkSeWTNKEdezvZDo5E45OBg8c"

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase