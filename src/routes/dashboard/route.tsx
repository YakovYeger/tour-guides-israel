import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // If not authenticated, show login prompt (don't redirect to avoid loops)
  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Please log in to access your dashboard</p>
        <a href="/login" className="text-primary hover:underline">Go to Login</a>
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

