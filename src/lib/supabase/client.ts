import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Singleton instance for client-side usage
let browserClient: SupabaseClient<Database> | null = null

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!browserClient) {
    browserClient = createSupabaseClient<Database>(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      }
    )
  }
  return browserClient
}

// Alias for backwards compatibility
export const createClient = getSupabaseClient

