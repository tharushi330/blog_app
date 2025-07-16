import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hxlqgvacixgafzoyqysw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bHFndmFjaXhnYWZ6b3lxeXN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2Mzk1MTcsImV4cCI6MjA2ODIxNTUxN30.rpg7OGUZJDVVTOEldXg-6SlBuKCzCgzsMTR5O3xuobs'

export const supabase = createClient(supabaseUrl, supabaseKey)
