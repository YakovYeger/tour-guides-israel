import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { getCookie, setCookie, deleteCookie } from '@tanstack/react-start/server'
import type { Database } from '@/types/database'

export function createSupabaseServerClient() {
  return createServerClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return getCookie(name)
        },
        set(name: string, value: string, options: CookieOptions) {
          setCookie(name, value, options)
        },
        remove(name: string, options: CookieOptions) {
          deleteCookie(name, options)
        },
      },
    }
  )
}

// Service role client for admin operations
export function createSupabaseServiceClient() {
  return createServerClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get() { return undefined },
        set() {},
        remove() {},
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

