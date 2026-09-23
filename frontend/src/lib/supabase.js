import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

const missingVariables = [
  !supabaseUrl && 'VITE_SUPABASE_URL',
  !supabasePublishableKey && 'VITE_SUPABASE_PUBLISHABLE_KEY',
].filter(Boolean)

if (missingVariables.length) {
  throw new Error(
    `Missing Supabase configuration: ${missingVariables.join(', ')}. Add it to frontend/.env.local.`,
  )
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey)
