import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import type { User } from '@supabase/supabase-js'

// Create client at module level - only in browser
export const supabase = typeof window !== 'undefined'
  ? createSupabaseClient<Database>(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )
  : null

// Auth state that can be accessed synchronously
export type AuthState = {
  user: User | null
  isInitialized: boolean
}

export const authState: AuthState = {
  user: null,
  isInitialized: false,
}

// Promise that resolves when auth is ready - for use in beforeLoad
let authReadyResolve: ((state: AuthState) => void) | null = null
export const authReady = new Promise<AuthState>((resolve) => {
  authReadyResolve = resolve
})

// Initialize auth listener (call once at app startup)
export function initAuth() {
  if (!supabase) return

  // Get initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    authState.user = session?.user ?? null
    authState.isInitialized = true
    authReadyResolve?.(authState)
  })

  // Listen for changes
  supabase.auth.onAuthStateChange((event, session) => {
    authState.user = session?.user ?? null

    if (event === 'SIGNED_OUT') {
      window.location.href = '/'
    }
  })
}

// For backwards compatibility
export const getSupabaseClient = () => supabase
export const createClient = () => supabase

