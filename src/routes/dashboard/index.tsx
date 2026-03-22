import { createFileRoute, Link } from '@tanstack/react-router'
import { Calendar, MessageSquare, Star, TrendingUp, Eye, DollarSign, Users, Clock, Zap, ArrowRight, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback, getInitials } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'
import { useBookings, useDashboardStats } from '@/hooks/use-dashboard-data'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardOverview,
})

const recentMessages = [
  { id: '1', name: 'John Smith', photo: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100', message: 'Looking forward to our tour tomorrow!', time: '2h ago', unread: true },
  { id: '2', name: 'Maria Garcia', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100', message: "Thank you for confirming!", time: '5h ago', unread: false },
]

function DashboardOverview() {
  const { guide } = useAuth()
  const { data: bookings, isLoading: bookingsLoading } = useBookings()
  const { data: stats, isLoading: statsLoading } = useDashboardStats()

  const upcomingBookings = bookings?.filter(b =>
    b.status !== 'cancelled' && b.status !== 'completed' && new Date(b.tour_date) >= new Date()
  ).slice(0, 3) || []

  const statCards = [
    { label: 'This Month', value: `$${stats?.thisMonthRevenue || 0}`, change: 'Revenue', icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Total Bookings', value: stats?.totalBookings || 0, change: `${stats?.pendingBookings || 0} pending`, icon: Calendar, color: 'text-primary', bgColor: 'bg-primary/10' },
    { label: 'Profile Views', value: '1,234', change: '+18%', icon: Eye, color: 'text-secondary', bgColor: 'bg-secondary/10' },
    { label: 'Rating', value: stats?.avgRating || '0.0', change: `${stats?.totalReviews || 0} reviews`, icon: Star, color: 'text-accent', bgColor: 'bg-accent/10' },
  ]

  return (
    <div className="space-y-6 lg:space-y-8 overflow-x-hidden">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
            Welcome back, {guide?.full_name?.split(' ')[0] || 'Guide'}!
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Here's what's happening with your tours today.</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button variant="outline" size="sm" asChild><Link to="/dashboard/profile">Edit Profile</Link></Button>
          {guide && <Button size="sm" asChild><Link to={`/guides/${guide.id}`}>View Public <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statsLoading ? (
          <div className="col-span-2 lg:col-span-4 flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-3 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1 truncate">{stat.value}</p>
                  <p className={`text-xs sm:text-sm ${stat.color} mt-1 truncate`}>{stat.change}</p>
                </div>
                <div className={`p-2 sm:p-3 rounded-xl ${stat.bgColor} ${stat.color} flex-shrink-0`}><stat.icon className="h-5 w-5 sm:h-6 sm:w-6" /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>Upcoming Tours</CardTitle><p className="text-sm text-gray-500 mt-1">{upcomingBookings.length} scheduled</p></div>
            <Link to="/dashboard/bookings" className="text-primary text-sm font-medium hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : upcomingBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No upcoming tours scheduled</p>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-xl gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" /></div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{new Date(booking.tour_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{booking.traveler_name} • {booking.group_size} people</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 pl-13 sm:pl-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">${booking.total_price}</p>
                      <Badge variant={booking.status === 'confirmed' ? 'success' : 'warning'} size="sm">{booking.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>Recent Messages</CardTitle><p className="text-sm text-gray-500 mt-1">Stay connected</p></div>
            <Link to="/dashboard/messages" className="text-primary text-sm font-medium hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <Link key={msg.id} to="/dashboard/messages" className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <Avatar size="md"><AvatarImage src={msg.photo} alt={msg.name} /><AvatarFallback>{getInitials(msg.name)}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between"><p className="font-medium text-gray-900">{msg.name}</p><span className="text-xs text-gray-400">{msg.time}</span></div>
                    <p className="text-sm text-gray-500 truncate">{msg.message}</p>
                  </div>
                  {msg.unread && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader><CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <Link to="/dashboard/profile" className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0"><Users className="h-4 w-4 sm:h-5 sm:w-5" /></div>
              <div className="min-w-0"><p className="font-medium text-gray-900 text-sm sm:text-base truncate">Profile</p><p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Edit your info</p></div>
            </Link>
            <Link to="/dashboard/availability" className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors">
              <div className="p-1.5 sm:p-2 rounded-lg bg-secondary/10 text-secondary flex-shrink-0"><Clock className="h-4 w-4 sm:h-5 sm:w-5" /></div>
              <div className="min-w-0"><p className="font-medium text-gray-900 text-sm sm:text-base truncate">Availability</p><p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Update calendar</p></div>
            </Link>
            <Link to="/dashboard/analytics" className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors">
              <div className="p-1.5 sm:p-2 rounded-lg bg-green-100 text-green-600 flex-shrink-0"><TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" /></div>
              <div className="min-w-0"><p className="font-medium text-gray-900 text-sm sm:text-base truncate">Analytics</p><p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Track performance</p></div>
            </Link>
            <Link to="/dashboard/bookings" className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors">
              <div className="p-1.5 sm:p-2 rounded-lg bg-accent/10 text-accent flex-shrink-0"><Zap className="h-4 w-4 sm:h-5 sm:w-5" /></div>
              <div className="min-w-0"><p className="font-medium text-gray-900 text-sm sm:text-base truncate">Bookings</p><p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Manage tours</p></div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

