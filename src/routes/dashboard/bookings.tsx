import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Calendar, List, Search, Check, X, MessageSquare, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/modal'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useBookings, useUpdateBooking, type Booking } from '@/hooks/use-dashboard-data'

export const Route = createFileRoute('/dashboard/bookings')({
  component: BookingsPage,
})

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

const statusVariants: Record<BookingStatus, 'warning' | 'success' | 'primary' | 'error'> = {
  pending: 'warning', confirmed: 'success', completed: 'primary', cancelled: 'error',
}

function BookingsPage() {
  const { data: bookings, isLoading } = useBookings()
  const updateBooking = useUpdateBooking()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

  const filteredBookings = (bookings || []).filter((b) =>
    !searchQuery || b.traveler_name.toLowerCase().includes(searchQuery.toLowerCase()) || b.tour_date.includes(searchQuery)
  )

  const pendingCount = filteredBookings.filter(b => b.status === 'pending').length
  const confirmedCount = filteredBookings.filter(b => b.status === 'confirmed').length

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <div onClick={() => setSelectedBooking(booking)} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-primary cursor-pointer transition-colors gap-3">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Calendar className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900">{new Date(booking.tour_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          <p className="text-sm text-gray-500 truncate">{booking.group_size} {booking.group_size === 1 ? 'person' : 'people'} • {booking.duration === 'half' ? 'Half Day' : 'Full Day'}</p>
          <p className="text-sm text-gray-500 truncate">{booking.traveler_name}</p>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-15 sm:pl-0">
        <div className="text-left sm:text-right">
          <p className="font-semibold text-gray-900">${booking.total_price}</p>
          <p className="text-xs text-gray-500">${booking.down_payment} paid</p>
        </div>
        <Badge variant={statusVariants[booking.status]} size="lg">{booking.status}</Badge>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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
                    <p className="text-xl font-semibold text-gray-900">{new Date(selectedBooking.tour_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <Badge variant={statusVariants[selectedBooking.status]} size="lg">{selectedBooking.status}</Badge>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-500">Traveler</p><p className="font-medium text-gray-900">{selectedBooking.traveler_name}</p></div>
                  <div><p className="text-sm text-gray-500">Email</p><p className="font-medium text-gray-900">{selectedBooking.traveler_email}</p></div>
                  <div><p className="text-sm text-gray-500">Group Size</p><p className="font-medium text-gray-900">{selectedBooking.group_size} people</p></div>
                  <div><p className="text-sm text-gray-500">Duration</p><p className="font-medium text-gray-900">{selectedBooking.duration === 'half' ? 'Half Day' : 'Full Day'}</p></div>
                  <div><p className="text-sm text-gray-500">Total Price</p><p className="font-medium text-gray-900">${selectedBooking.total_price}</p></div>
                  <div><p className="text-sm text-gray-500">Down Payment</p><p className="font-medium text-gray-900">${selectedBooking.down_payment}</p></div>
                </div>
                {selectedBooking.special_requests && (
                  <div><p className="text-sm text-gray-500 mb-1">Special Requests</p><p className="p-3 bg-gray-50 rounded-lg text-gray-700">{selectedBooking.special_requests}</p></div>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            {selectedBooking?.status === 'pending' && (
              <>
                <Button variant="outline" onClick={() => { updateBooking.mutate({ id: selectedBooking.id, status: 'cancelled' }); setSelectedBooking(null) }} leftIcon={<X className="h-4 w-4" />}>Decline</Button>
                <Button variant="default" onClick={() => { updateBooking.mutate({ id: selectedBooking.id, status: 'confirmed' }); setSelectedBooking(null) }} leftIcon={<Check className="h-4 w-4" />}>Confirm</Button>
              </>
            )}
            {selectedBooking?.status === 'confirmed' && (
              <>
                <Button variant="outline" onClick={() => { updateBooking.mutate({ id: selectedBooking.id, status: 'pending' }); setSelectedBooking(null) }}>Back to Pending</Button>
                <Button variant="default" onClick={() => { updateBooking.mutate({ id: selectedBooking.id, status: 'completed' }); setSelectedBooking(null) }} leftIcon={<Check className="h-4 w-4" />}>Mark Complete</Button>
              </>
            )}
            {selectedBooking?.status === 'completed' && (
              <Button variant="outline" onClick={() => { updateBooking.mutate({ id: selectedBooking.id, status: 'confirmed' }); setSelectedBooking(null) }}>Reopen</Button>
            )}
            {selectedBooking?.status === 'cancelled' && (
              <Button variant="outline" onClick={() => { updateBooking.mutate({ id: selectedBooking.id, status: 'pending' }); setSelectedBooking(null) }}>Restore</Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

