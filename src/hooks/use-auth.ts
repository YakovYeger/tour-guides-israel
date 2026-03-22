import { useState, useEffect, useCallback } from 'react'
import { supabase, authState } from '@/lib/supabase/client'
import type { Guide } from '@/types/database'

export function useAuth() {
  const [user, setUser] = useState(authState.user)
  const [isLoading, setIsLoading] = useState(!authState.isInitialized)
  const [guide, setGuide] = useState<Guide | null>(null)

  // Fetch guide profile by user_id (matches RLS policy)
  const fetchGuideProfile = useCallback(async (userId: string) => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle() // Use maybeSingle() to handle no results without error

      if (error) {
        console.error('Error fetching guide profile:', error.message)
        setGuide(null)
        return
      }
      setGuide(data as Guide | null)
    } catch (err) {
      console.error('Failed to fetch guide profile:', err)
      setGuide(null)
    }
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
    if (user?.id) {
      fetchGuideProfile(user.id)
    } else {
      setGuide(null)
    }
  }, [user?.id, fetchGuideProfile])

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

