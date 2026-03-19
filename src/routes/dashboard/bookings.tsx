import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Calendar, List, Search, Check, X, MessageSquare, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/modal'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/bookings')({
  component: BookingsPage,
})

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

interface Booking {
  id: string
  date: string
  groupSize: number
  duration: 'half' | 'full'
  status: BookingStatus
  totalPrice: number
  downPayment: number
  travelerName: string
  specialRequests?: string
}

const mockBookings: Booking[] = [
  { id: '1', date: '2025-03-22', groupSize: 4, duration: 'full', status: 'pending', totalPrice: 600, downPayment: 100, travelerName: 'John Smith', specialRequests: 'Vegetarian lunch please' },
  { id: '2', date: '2025-03-25', groupSize: 2, duration: 'half', status: 'confirmed', totalPrice: 350, downPayment: 100, travelerName: 'Sarah Johnson' },
  { id: '3', date: '2025-03-28', groupSize: 6, duration: 'full', status: 'confirmed', totalPrice: 800, downPayment: 100, travelerName: 'Mike Williams' },
  { id: '4', date: '2025-03-15', groupSize: 3, duration: 'full', status: 'completed', totalPrice: 600, downPayment: 100, travelerName: 'Emily Brown' },
  { id: '5', date: '2025-03-10', groupSize: 2, duration: 'half', status: 'cancelled', totalPrice: 350, downPayment: 100, travelerName: 'Chris Davis' },
]

const statusVariants: Record<BookingStatus, 'warning' | 'success' | 'primary' | 'error'> = {
  pending: 'warning', confirmed: 'success', completed: 'primary', cancelled: 'error',
}

function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

  const filteredBookings = mockBookings.filter((b) => 
    !searchQuery || b.travelerName.toLowerCase().includes(searchQuery.toLowerCase()) || b.date.includes(searchQuery)
  )

  const pendingCount = filteredBookings.filter(b => b.status === 'pending').length
  const confirmedCount = filteredBookings.filter(b => b.status === 'confirmed').length

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <div onClick={() => setSelectedBooking(booking)} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-primary cursor-pointer transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
          <Calendar className="h-7 w-7 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          <p className="text-sm text-gray-500">{booking.groupSize} {booking.groupSize === 1 ? 'person' : 'people'} • {booking.duration === 'half' ? 'Half Day' : 'Full Day'}</p>
          <p className="text-sm text-gray-500">{booking.travelerName}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-gray-900">${booking.totalPrice}</p>
          <p className="text-xs text-gray-500">${booking.downPayment} paid</p>
        </div>
        <Badge variant={statusVariants[booking.status]} size="lg">{booking.status}</Badge>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500">Manage your tour bookings</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('list')} className={cn('p-2 transition-colors', viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:text-primary')}>
              <List className="h-5 w-5" />
            </button>
            <button onClick={() => setViewMode('calendar')} className={cn('p-2 transition-colors', viewMode === 'calendar' ? 'bg-primary text-white' : 'text-gray-400 hover:text-primary')}>
              <Calendar className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input placeholder="Search bookings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} leftIcon={<Search className="h-5 w-5" />} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({filteredBookings.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({confirmedCount})</TabsTrigger>
        </TabsList>
        <TabsContent value="all"><div className="space-y-3 mt-4">{filteredBookings.map(b => <BookingCard key={b.id} booking={b} />)}</div></TabsContent>
        <TabsContent value="pending"><div className="space-y-3 mt-4">{filteredBookings.filter(b => b.status === 'pending').map(b => <BookingCard key={b.id} booking={b} />)}</div></TabsContent>
        <TabsContent value="confirmed"><div className="space-y-3 mt-4">{filteredBookings.filter(b => b.status === 'confirmed').map(b => <BookingCard key={b.id} booking={b} />)}</div></TabsContent>
      </Tabs>

      {/* Booking Detail Modal */}
      <Modal open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <ModalContent>
          <ModalHeader><ModalTitle>Booking Details</ModalTitle></ModalHeader>
          <ModalBody>
            {selectedBooking && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-500">Tour Date</p>
                    <p className="text-xl font-semibold text-gray-900">{new Date(selectedBooking.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <Badge variant={statusVariants[selectedBooking.status]} size="lg">{selectedBooking.status}</Badge>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-500">Traveler</p><p className="font-medium text-gray-900">{selectedBooking.travelerName}</p></div>
                  <div><p className="text-sm text-gray-500">Group Size</p><p className="font-medium text-gray-900">{selectedBooking.groupSize} people</p></div>
                  <div><p className="text-sm text-gray-500">Duration</p><p className="font-medium text-gray-900">{selectedBooking.duration === 'half' ? 'Half Day' : 'Full Day'}</p></div>
                  <div><p className="text-sm text-gray-500">Total Price</p><p className="font-medium text-gray-900">${selectedBooking.totalPrice}</p></div>
                </div>
                {selectedBooking.specialRequests && (
                  <div><p className="text-sm text-gray-500 mb-1">Special Requests</p><p className="p-3 bg-gray-50 rounded-lg text-gray-700">{selectedBooking.specialRequests}</p></div>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            {selectedBooking?.status === 'pending' && (
              <>
                <Button variant="outline" onClick={() => setSelectedBooking(null)} leftIcon={<X className="h-4 w-4" />}>Decline</Button>
                <Button variant="default" onClick={() => setSelectedBooking(null)} leftIcon={<Check className="h-4 w-4" />}>Confirm</Button>
              </>
            )}
            {selectedBooking?.status === 'confirmed' && (
              <Button variant="outline" onClick={() => setSelectedBooking(null)} leftIcon={<MessageSquare className="h-4 w-4" />}>Message Traveler</Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

