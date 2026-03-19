import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { getSupabaseClient } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import type { Guide } from '@/types/database'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [guide, setGuide] = useState<Guide | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const fetchGuideProfile = useCallback(async (email: string) => {
    const supabase = getSupabaseClient()
    const { data } = await supabase
      .from('guides')
      .select('*')
      .eq('email', email)
      .single()
    setGuide(data as Guide | null)
  }, [])

  useEffect(() => {
    const supabase = getSupabaseClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user?.email) {
        fetchGuideProfile(session.user.email)
      }
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user?.email) {
          await fetchGuideProfile(session.user.email)
        } else {
          setGuide(null)
        }

        setIsLoading(false)

        if (event === 'SIGNED_OUT') {
          navigate({ to: '/' })
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate, fetchGuideProfile])

  const signOut = async () => {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    setGuide(null)
  }

  return {
    user,
    session,
    guide,
    isLoading,
    isAuthenticated: !!user,
    isGuide: !!guide,
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

