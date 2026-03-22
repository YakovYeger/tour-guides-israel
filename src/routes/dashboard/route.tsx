import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'

export const Route = createFileRoute('/dashboard')({
  // Wait for auth and redirect if not authenticated
  beforeLoad: async ({ context }) => {
    const auth = await context.getAuth()
    if (!auth.user) {
      throw redirect({ to: '/login' })
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-6 min-h-[calc(100vh-4rem)] bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}

