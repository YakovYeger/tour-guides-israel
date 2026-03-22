import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Star, MessageSquare, ThumbsUp, Flag, Search, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, getInitials } from '@/components/ui/avatar'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/modal'
import { cn } from '@/lib/utils'
import { useReviews, useRespondToReview, type Review } from '@/hooks/use-dashboard-data'

export const Route = createFileRoute('/dashboard/reviews')({
  component: ReviewsPage,
})

function ReviewsPage() {
  const { data: reviews, isLoading } = useReviews()
  const respondToReview = useRespondToReview()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [responseText, setResponseText] = useState('')

  const filteredReviews = (reviews || []).filter(r =>
    !searchQuery || r.reviewer_name.toLowerCase().includes(searchQuery.toLowerCase()) || r.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const avgRating = reviews?.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'
  const distribution = [5, 4, 3, 2, 1].map(star => reviews?.filter(r => r.rating === star).length || 0)

  const handleRespond = () => {
    if (selectedReview && responseText.trim()) {
      respondToReview.mutate({ id: selectedReview.id, response: responseText })
      setSelectedReview(null)
      setResponseText('')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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
              {avgRating} <Star className="h-7 w-7 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-sm text-gray-500 mt-1">Average Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-900">{reviews?.length || 0}</div>
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
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${reviews?.length ? (distribution[i] / reviews.length) * 100 : 0}%` }} />
                  </div>
                  <span className="text-sm text-gray-500 w-8">{distribution[i]}</span>
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
        {filteredReviews.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No reviews yet</p>
        ) : filteredReviews.map(review => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar size="lg">
                  <AvatarFallback>{getInitials(review.reviewer_name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{review.reviewer_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} className={cn('h-4 w-4', i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200')} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                        {review.tour_type && <Badge variant="secondary" size="sm">{review.tour_type}</Badge>}
                      </div>
                    </div>
                    {review.guide_response && <Badge variant="success" size="sm">Responded</Badge>}
                  </div>
                  <p className="mt-3 text-gray-700">{review.content}</p>
                  {review.guide_response && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Your response:</p>
                      <p className="text-sm text-gray-600 mt-1">{review.guide_response}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-4">
                    <Button variant="outline" size="sm" onClick={() => { setSelectedReview(review); setResponseText(review.guide_response || '') }} leftIcon={<MessageSquare className="h-4 w-4" />}>
                      {review.guide_response ? 'Edit Response' : 'Respond'}
                    </Button>
                    <Button variant="ghost" size="sm" leftIcon={<ThumbsUp className="h-4 w-4" />}>Thank</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Response Modal */}
      <Modal open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Respond to Review</ModalTitle>
          </ModalHeader>
          <ModalBody>
            {selectedReview && (
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">"{selectedReview.content}"</p>
                  <p className="text-xs text-gray-400 mt-2">- {selectedReview.reviewer_name}</p>
                </div>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Write your response..."
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setSelectedReview(null)}>Cancel</Button>
            <Button onClick={handleRespond} disabled={!responseText.trim()}>Submit Response</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

