import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useConversations, useMessages, useSendMessage, type Conversation } from '@/hooks/use-dashboard-data'

export const Route = createFileRoute('/dashboard/messages')({
  component: DashboardMessages,
})

function DashboardMessages() {
  const { data: conversations, isLoading: convsLoading } = useConversations()
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const { data: messages, isLoading: msgsLoading } = useMessages(selectedConversation?.id || null)
  const sendMessage = useSendMessage()
  const [searchQuery, setSearchQuery] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Select first conversation by default
  useEffect(() => {
    if (conversations?.length && !selectedConversation) {
      setSelectedConversation(conversations[0])
    }
  }, [conversations, selectedConversation])

  // Scroll to bottom only when sending a new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const filteredConversations = (conversations || []).filter(c =>
    !searchQuery || c.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConversation) return
    sendMessage.mutate({ conversationId: selectedConversation.id, content: newMessage }, {
      onSuccess: () => scrollToBottom()
    })
    setNewMessage('')
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${Math.floor(diffHours)}h ago`
    return date.toLocaleDateString()
  }

  if (convsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // On mobile, show either conversation list or chat view
  const showChatOnMobile = selectedConversation !== null

  return (
    <div className="h-[calc(100vh-12rem)] lg:h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm lg:text-base text-gray-500 hidden sm:block">Communicate with your clients</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100%-3rem)]">
        {/* Conversations List - hidden on mobile when chat is open */}
        <Card className={cn('lg:col-span-1 flex flex-col', showChatOnMobile ? 'hidden lg:flex' : 'flex')}>
          <CardHeader className="pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-2">
            {filteredConversations.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No conversations yet</p>
            ) : (
              <div className="space-y-1">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={cn(
                      'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors',
                      selectedConversation?.id === conv.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-gray-50'
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                      {conv.client_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate text-gray-900">{conv.client_name}</span>
                        <span className="text-xs text-gray-500">{formatTime(conv.last_message_at)}</span>
                      </div>
                      <p className="text-sm truncate text-gray-500">{conv.subject}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Messages - hidden on mobile when no chat selected */}
        <Card className={cn('lg:col-span-2 flex flex-col', !showChatOnMobile ? 'hidden lg:flex' : 'flex')}>
          {selectedConversation ? (
            <>
              <CardHeader className="border-b py-3">
                <div className="flex items-center gap-3">
                  {/* Back button on mobile */}
                  <button onClick={() => setSelectedConversation(null)} className="lg:hidden p-1 -ml-1 hover:bg-gray-100 rounded">
                    <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {selectedConversation.client_name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">{selectedConversation.client_name}</h3>
                    <p className="text-sm text-gray-500 truncate">{selectedConversation.subject}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {msgsLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : (
                  <>
                    {(messages || []).map((msg) => (
                      <div key={msg.id} className={cn('flex', msg.sender_type === 'guide' ? 'justify-end' : 'justify-start')}>
                        <div className={cn('max-w-[70%] rounded-2xl px-4 py-2', msg.sender_type === 'guide' ? 'bg-primary text-white rounded-br-md' : 'bg-gray-100 rounded-bl-md')}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={cn('text-xs mt-1', msg.sender_type === 'guide' ? 'text-white/70' : 'text-gray-500')}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </CardContent>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1" onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
                  <Button onClick={handleSend} disabled={!newMessage.trim() || sendMessage.isPending}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to view messages
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

