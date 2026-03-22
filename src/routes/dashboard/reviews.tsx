import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Star, MessageSquare, ThumbsUp, Flag, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, getInitials } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/reviews')({
  component: ReviewsPage,
})

const mockReviews = [
  { id: '1', author: 'John Smith', rating: 5, date: '2025-03-15', text: 'Jacob is an incredible guide! His knowledge of Jerusalem\'s history brought the Old City to life. Highly recommend!', tourType: 'Jerusalem Old City', responded: true },
  { id: '2', author: 'Maria Garcia', rating: 5, date: '2025-03-10', text: 'Amazing food tour! Jacob knows all the best spots and shared fascinating stories about each place.', tourType: 'Tel Aviv Food Tour', responded: false },
  { id: '3', author: 'David Chen', rating: 4, date: '2025-03-05', text: 'Great experience overall. Very knowledgeable about the Dead Sea region. Would book again.', tourType: 'Dead Sea Adventure', responded: true },
  { id: '4', author: 'Sarah Johnson', rating: 5, date: '2025-02-28', text: 'Perfect day exploring the Galilee. Jacob made our family trip unforgettable!', tourType: 'Galilee Tour', responded: false },
]

const stats = {
  average: 4.9,
  total: 89,
  distribution: [78, 8, 2, 1, 0], // 5, 4, 3, 2, 1 stars
}

function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReview, setSelectedReview] = useState<string | null>(null)

  const filteredReviews = mockReviews.filter(r => 
    !searchQuery || r.author.toLowerCase().includes(searchQuery.toLowerCase()) || r.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-500">Manage and respond to traveler reviews</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-1 text-3xl font-bold text-gray-900">
              {stats.average} <Star className="h-7 w-7 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-sm text-gray-500 mt-1">Average Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-sm text-gray-500 mt-1">Total Reviews</p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2">
          <CardContent className="p-6">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars, i) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-8">{stars}★</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(stats.distribution[i] / stats.total) * 100}%` }} />
                  </div>
                  <span className="text-sm text-gray-500 w-8">{stats.distribution[i]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input placeholder="Search reviews..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} leftIcon={<Search className="h-5 w-5" />} />
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map(review => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar size="lg">
                  <AvatarFallback>{getInitials(review.author)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{review.author}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} className={cn('h-4 w-4', i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200')} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                        <Badge variant="secondary" size="sm">{review.tourType}</Badge>
                      </div>
                    </div>
                    {review.responded && <Badge variant="success" size="sm">Responded</Badge>}
                  </div>
                  <p className="mt-3 text-gray-700">{review.text}</p>
                  <div className="flex items-center gap-3 mt-4">
                    <Button variant="outline" size="sm" leftIcon={<MessageSquare className="h-4 w-4" />}>
                      {review.responded ? 'View Response' : 'Respond'}
                    </Button>
                    <Button variant="ghost" size="sm" leftIcon={<ThumbsUp className="h-4 w-4" />}>Thank</Button>
                    <Button variant="ghost" size="sm" leftIcon={<Flag className="h-4 w-4" />} className="text-gray-400">Report</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

