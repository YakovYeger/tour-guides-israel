import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: 'Contact Us | Tour Guides Israel' },
      { name: 'description', content: 'Get in touch with Tour Guides Israel. We are here to help with any questions.' },
    ],
  }),
})

function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSuccess(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'info@tourguidesisrael.com', href: 'mailto:info@tourguidesisrael.com' },
    { icon: Phone, label: 'Phone', value: '+972-3-123-4567', href: 'tel:+972312345678' },
    { icon: MapPin, label: 'Location', value: 'Tel Aviv, Israel', href: null },
  ]

  return (
    <div className="py-12 md:py-20">
      <div className="page-wrap">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="display-title text-4xl md:text-5xl font-bold text-desert-ink mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-desert-ink-soft">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-4">
            {contactInfo.map((item) => (
              <Card key={item.label}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-sunset" />
                    </div>
                    <div>
                      <p className="text-sm text-desert-ink-soft">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="font-medium text-desert-ink hover:text-sunset transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-medium text-desert-ink">{item.value}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* FAQ Callout */}
            <Card className="bg-accent-50 border-accent-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-desert-ink mb-2">Looking for answers?</h3>
                <p className="text-sm text-desert-ink-soft mb-3">
                  Check our FAQ section for quick answers to common questions.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/#faq">View FAQ</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-desert-ink mb-2">Message Sent!</h3>
                  <p className="text-desert-ink-soft mb-4">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <Button variant="outline" onClick={() => setIsSuccess(false)}>Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-desert-ink">Your Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Smith"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-desert-ink">Email *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-desert-ink">Subject *</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-desert-ink">Message *</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      required
                      className="flex w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm placeholder:text-desert-ink-soft/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset/50 focus-visible:border-sunset transition-colors"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

