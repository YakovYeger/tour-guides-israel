import { createFileRoute, Outlet } from '@tanstack/react-router'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: '/login' })
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sunset" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-6 min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </div>
  )
}

