import { Link, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  User,
  Calendar,
  BarChart3,
  MessageSquare,
  Star,
  FileText,
  CalendarDays,
  Settings,
  CreditCard,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview', exact: true },
  { href: '/dashboard/profile', icon: User, label: 'Profile' },
  { href: '/dashboard/availability', icon: Calendar, label: 'Availability' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/dashboard/reviews', icon: Star, label: 'Reviews' },
  { href: '/dashboard/blog', icon: FileText, label: 'Blog' },
  { href: '/dashboard/events', icon: CalendarDays, label: 'Events' },
  { href: '/dashboard/membership', icon: CreditCard, label: 'Membership' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export function DashboardSidebar() {
  const { t } = useTranslation('common')
  const location = useLocation()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.href
            : location.pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

