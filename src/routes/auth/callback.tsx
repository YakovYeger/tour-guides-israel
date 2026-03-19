import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
})

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = getSupabaseClient()
      
      // The supabase client will automatically handle the OAuth callback
      // and set the session from the URL hash
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Auth callback error:', error)
        navigate({ to: '/login' })
        return
      }

      if (session) {
        // Check if user has a guide profile
        const { data: guide } = await supabase
          .from('guides')
          .select('id')
          .eq('user_id', session.user.id)
          .single()

        if (guide) {
          navigate({ to: '/dashboard' })
        } else {
          // New user - redirect to guide registration or home
          navigate({ to: '/' })
        }
      } else {
        navigate({ to: '/login' })
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-sunset mb-4" />
      <p className="text-desert-ink-soft">Completing sign in...</p>
    </div>
  )
}

