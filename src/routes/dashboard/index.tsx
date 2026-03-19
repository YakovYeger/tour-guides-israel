import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, Users, Star, TrendingUp, MessageSquare, Calendar } from 'lucide-react'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardOverview,
})

function DashboardOverview() {
  const { t } = useTranslation('common')
  const { user, guide } = useAuth()

  const stats = [
    { label: 'Profile Views', value: '1,234', change: '+12%', icon: Eye, color: 'text-primary' },
    { label: 'Contact Clicks', value: '89', change: '+5%', icon: Users, color: 'text-secondary' },
    { label: 'Average Rating', value: '4.8', change: '+0.2', icon: Star, color: 'text-accent' },
    { label: 'Total Reviews', value: '24', change: '+3', icon: TrendingUp, color: 'text-green-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {guide?.full_name || user?.user_metadata?.full_name || 'Guide'}!
        </h1>
        <p className="text-gray-500">
          Here's what's happening with your profile today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} this month</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">Client Name {i}</p>
                    <p className="text-sm text-gray-500 truncate">Looking forward to our tour next week...</p>
                  </div>
                  <span className="text-xs text-gray-400">2h ago</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-secondary" />
              Upcoming Tours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Jerusalem Old City Tour', date: 'Tomorrow, 9:00 AM', guests: 4 },
                { title: 'Tel Aviv Food Tour', date: 'Mar 22, 11:00 AM', guests: 6 },
                { title: 'Dead Sea Adventure', date: 'Mar 25, 8:00 AM', guests: 8 },
              ].map((tour, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{tour.title}</p>
                    <p className="text-sm text-gray-500">{tour.date}</p>
                  </div>
                  <span className="text-sm text-gray-500">{tour.guests} guests</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

