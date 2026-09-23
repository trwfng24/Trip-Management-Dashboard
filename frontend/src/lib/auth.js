import { supabase } from './supabase'
import { createAuthStore } from '../composables/useAuth'

export const auth = createAuthStore(supabase)
