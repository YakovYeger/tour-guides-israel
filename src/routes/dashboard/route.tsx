import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Only redirect on client-side after auth is initialized
    if (!isLoading && !user) {
      navigate({ to: '/login' })
    }
  }, [isLoading, user, navigate])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Don't render dashboard if not authenticated
  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-6 min-h-[calc(100vh-4rem)] bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}

