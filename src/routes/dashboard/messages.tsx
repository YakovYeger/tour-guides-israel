import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/messages')({
  component: DashboardMessages,
})

const mockConversations = [
  { id: 1, name: 'Sarah Miller', lastMessage: 'Thank you for the wonderful tour!', time: '2h ago', unread: true },
  { id: 2, name: 'David Cohen', lastMessage: 'Looking forward to next week', time: '5h ago', unread: false },
  { id: 3, name: 'Emma Johnson', lastMessage: 'Can we reschedule to Friday?', time: '1d ago', unread: true },
  { id: 4, name: 'Michael Brown', lastMessage: 'Perfect, see you then!', time: '2d ago', unread: false },
]

const mockMessages = [
  { id: 1, sender: 'client', content: 'Hi! I saw your profile and I am interested in a Jerusalem tour.', time: '10:30 AM' },
  { id: 2, sender: 'guide', content: 'Hello! Thank you for reaching out. I would be happy to show you around Jerusalem. What dates were you thinking?', time: '10:45 AM' },
  { id: 3, sender: 'client', content: 'We are thinking next Tuesday. We are a family of 4 with 2 kids ages 8 and 12.', time: '11:00 AM' },
  { id: 4, sender: 'guide', content: 'Perfect! I have availability next Tuesday. I can do a family-friendly tour that includes the Old City and some fun stops for the kids. Would 9 AM work?', time: '11:15 AM' },
  { id: 5, sender: 'client', content: 'That sounds great! 9 AM works perfectly. Thank you!', time: '11:20 AM' },
]

function DashboardMessages() {
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [newMessage, setNewMessage] = useState('')

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-desert-ink">Messages</h1>
          <p className="text-desert-ink-soft">Communicate with your clients</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100%-4rem)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader className="pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-desert-ink-soft" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {mockConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={cn(
                    'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors',
                    selectedConversation === conv.id
                      ? 'bg-sunset/10 border border-sunset/20'
                      : 'hover:bg-link-bg-hover'
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-sunset font-semibold flex-shrink-0">
                    {conv.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={cn('font-medium truncate', conv.unread && 'text-desert-ink')}>
                        {conv.name}
                      </span>
                      <span className="text-xs text-desert-ink-soft">{conv.time}</span>
                    </div>
                    <p className={cn('text-sm truncate', conv.unread ? 'text-desert-ink' : 'text-desert-ink-soft')}>
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread && <div className="w-2 h-2 rounded-full bg-sunset mt-2" />}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="border-b border-line">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-sunset font-semibold">
                S
              </div>
              <div>
                <h3 className="font-semibold text-desert-ink">Sarah Miller</h3>
                <p className="text-sm text-desert-ink-soft">Jerusalem Tour Inquiry</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn('flex', msg.sender === 'guide' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[70%] rounded-2xl px-4 py-2',
                    msg.sender === 'guide'
                      ? 'bg-sunset text-white rounded-br-md'
                      : 'bg-surface border border-line rounded-bl-md'
                  )}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={cn(
                    'text-xs mt-1',
                    msg.sender === 'guide' ? 'text-white/70' : 'text-desert-ink-soft'
                  )}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-4 border-t border-line">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

