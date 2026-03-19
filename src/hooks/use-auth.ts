import { useState, useEffect, useCallback } from 'react'
import { supabase, authState } from '@/lib/supabase/client'
import type { Guide } from '@/types/database'

export function useAuth() {
  const [user, setUser] = useState(authState.user)
  const [isLoading, setIsLoading] = useState(!authState.isInitialized)
  const [guide, setGuide] = useState<Guide | null>(null)

  const fetchGuideProfile = useCallback(async (email: string) => {
    if (!supabase) return
    const { data } = await supabase
      .from('guides')
      .select('*')
      .eq('email', email)
      .single()
    setGuide(data as Guide | null)
  }, [])

  useEffect(() => {
    if (!supabase) return

    // Sync with current state
    setUser(authState.user)
    setIsLoading(!authState.isInitialized)

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user?.email) {
      fetchGuideProfile(user.email)
    } else {
      setGuide(null)
    }
  }, [user?.email, fetchGuideProfile])

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setGuide(null)
  }

  return {
    user,
    guide,
    isLoading,
    isAuthenticated: !!user,
    isGuide: !!guide,
    signOut,
  }
}

