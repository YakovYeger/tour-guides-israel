import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, Phone, Globe, MessageCircle, Calendar, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Guide } from '@/types/database'

interface GuideContactSidebarProps {
  guide: Guide
}

export function GuideContactSidebar({ guide }: GuideContactSidebarProps) {
  const { t } = useTranslation(['guides', 'common'])
  const [showContact, setShowContact] = useState(false)

  // Track contact view
  const handleShowContact = async () => {
    setShowContact(true)
    // TODO: Track analytics
  }

  return (
    <div className="space-y-4">
      {/* Main Contact Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('guides:profile.contact')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showContact ? (
            <div className="space-y-3">
              <Button className="w-full gap-2" size="lg" onClick={handleShowContact}>
                <MessageCircle className="h-5 w-5" />
                Contact {guide.full_name.split(' ')[0]}
              </Button>
              <p className="text-xs text-center text-desert-ink-soft">
                Click to reveal contact information
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Email */}
              {guide.email && (
                <a
                  href={`mailto:${guide.email}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface hover:bg-link-bg-hover transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-sunset" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-desert-ink-soft">Email</p>
                    <p className="text-desert-ink truncate">{guide.email}</p>
                  </div>
                </a>
              )}

              {/* Phone */}
              {guide.phone && (
                <a
                  href={`tel:${guide.phone}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface hover:bg-link-bg-hover transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-accent-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-desert-ink-soft">Phone</p>
                    <p className="text-desert-ink">{guide.phone}</p>
                  </div>
                </a>
              )}

              {/* Website */}
              {guide.website && (
                <a
                  href={guide.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface hover:bg-link-bg-hover transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-earth-100 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-earth-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-desert-ink-soft">Website</p>
                    <p className="text-desert-ink flex items-center gap-1">
                      Visit Site <ExternalLink className="h-3 w-3" />
                    </p>
                  </div>
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Availability Card */}
      {guide.show_public_availability && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-sunset" />
              {t('guides:profile.availability')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-desert-ink-soft mb-4">
              Contact the guide directly to check availability for your preferred dates.
            </p>
            <Button variant="outline" className="w-full gap-2">
              <Calendar className="h-4 w-4" />
              Check Availability
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Info */}
      {guide.licensed_guide_number && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200">
          <p className="text-sm text-green-800 font-medium">
            ✓ Licensed Tour Guide
          </p>
          <p className="text-xs text-green-600">
            License #{guide.licensed_guide_number}
          </p>
        </div>
      )}
    </div>
  )
}

