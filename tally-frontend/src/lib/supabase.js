import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qkcwfahseykjcynqhcgh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrY3dmYWhzZXlramN5bnFoY2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMjQ4NjksImV4cCI6MjA3ODgwMDg2OX0.SFJGWGAJpXOa_I9UtNSjF1fvtOibqcd2PG_RXOMN1is'

export const supabase = createClient(supabaseUrl, supabaseKey)