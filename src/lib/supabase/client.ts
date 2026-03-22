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

// Function to get current auth state - always returns fresh promise
export async function getAuthState(): Promise<AuthState> {
  if (!supabase) {
    return { user: null, isInitialized: true }
  }

  // If already initialized, return current state
  if (authState.isInitialized) {
    return authState
  }

  // Otherwise fetch session
  const { data: { session } } = await supabase.auth.getSession()
  authState.user = session?.user ?? null
  authState.isInitialized = true
  return authState
}

// Initialize auth listener (call once at app startup)
let initialized = false
export function initAuth() {
  if (!supabase || initialized) return
  initialized = true

  // Get initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    authState.user = session?.user ?? null
    authState.isInitialized = true
  })

  // Listen for changes
  supabase.auth.onAuthStateChange((event, session) => {
    authState.user = session?.user ?? null
    authState.isInitialized = true

    if (event === 'SIGNED_OUT') {
      window.location.href = '/'
    }
  })
}

// For backwards compatibility
export const getSupabaseClient = () => supabase
export const createClient = () => supabase

