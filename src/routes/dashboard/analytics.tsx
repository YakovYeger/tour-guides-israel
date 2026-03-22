import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, Users, MousePointer, TrendingUp } from 'lucide-react'

export const Route = createFileRoute('/dashboard/analytics')({
  component: DashboardAnalytics,
})

function DashboardAnalytics() {
  const stats = [
    { label: 'Profile Views', value: '1,234', change: '+12%', icon: Eye },
    { label: 'Contact Clicks', value: '89', change: '+5%', icon: MousePointer },
    { label: 'Search Appearances', value: '3,456', change: '+18%', icon: TrendingUp },
    { label: 'Unique Visitors', value: '876', change: '+8%', icon: Users },
  ]

  const monthlyData = [
    { month: 'Jan', views: 450 },
    { month: 'Feb', views: 580 },
    { month: 'Mar', views: 720 },
    { month: 'Apr', views: 890 },
    { month: 'May', views: 1100 },
    { month: 'Jun', views: 1234 },
  ]

  const maxViews = Math.max(...monthlyData.map(d => d.views))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500">Track your profile performance</p>
        <p className="text-sm text-amber-600 mt-1">📊 Demo data shown - analytics tracking coming soon</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-desert-ink-soft">{stat.label}</p>
                  <p className="text-2xl font-bold text-desert-ink mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} vs last month</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-sunset">
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Views Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end gap-4">
            {monthlyData.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-sunset/20 hover:bg-sunset/40 transition-colors rounded-t-lg"
                  style={{ height: `${(data.views / maxViews) * 200}px` }}
                >
                  <div
                    className="w-full bg-sunset rounded-t-lg transition-all"
                    style={{ height: `${(data.views / maxViews) * 200}px` }}
                  />
                </div>
                <span className="text-sm text-desert-ink-soft">{data.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Traffic Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Top Traffic Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { source: 'Tour Guides Israel Search', visits: 645, percent: 52 },
              { source: 'Google', visits: 312, percent: 25 },
              { source: 'Direct Link', visits: 189, percent: 15 },
              { source: 'Social Media', visits: 88, percent: 8 },
            ].map((item) => (
              <div key={item.source} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-desert-ink">{item.source}</span>
                  <span className="text-desert-ink-soft">{item.visits} visits ({item.percent}%)</span>
                </div>
                <div className="h-2 bg-earth-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sunset rounded-full transition-all"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

