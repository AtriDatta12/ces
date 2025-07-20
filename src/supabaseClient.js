import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://pekxxocigmfuogifxgnj.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBla3h4b2NpZ21mdW9naWZ4Z25qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mjk0MDAsImV4cCI6MjA2ODUwNTQwMH0.hkbPfDOzqHL3WO17g1ZemxJIjByCvBs3sBAtvKBEV2U"

export const supabase = createClient(supabaseUrl, supabaseKey)
