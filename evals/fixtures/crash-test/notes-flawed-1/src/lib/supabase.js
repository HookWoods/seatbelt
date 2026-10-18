import { createClient } from '@supabase/supabase-js'

const url = 'https://abcdexample.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RleGFtcGxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSJ9.EXAMPLESIGNATURE'

export const supabase = createClient(url, key)
