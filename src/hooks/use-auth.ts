import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { getSupabaseClient } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const supabase = getSupabaseClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)

        if (event === 'SIGNED_OUT') {
          navigate({ to: '/' })
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  const signOut = async () => {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
  }

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signOut,
  }
}

// Hook to require authentication
export function useRequireAuth(redirectTo: string = '/login') {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: redirectTo })
    }
  }, [user, isLoading, navigate, redirectTo])

  return { user, isLoading }
}

