import { createFileRoute, Link } from '@tanstack/react-router'
import { CheckCircle, Clock, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/for-guides/success')({
  component: RegistrationSuccessPage,
  head: () => ({
    meta: [
      { title: 'Registration Submitted | Tour Guides Israel' },
    ],
  }),
})

function RegistrationSuccessPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="page-wrap">
        <div className="max-w-xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-desert-ink mb-4">
            Registration Submitted!
          </h1>

          <p className="text-lg text-desert-ink-soft mb-8">
            Thank you for registering as a tour guide. Your profile is now under review.
          </p>

          {/* What's Next */}
          <div className="island-shell rounded-2xl p-6 md:p-8 text-left mb-8">
            <h2 className="font-semibold text-desert-ink mb-4">What happens next?</h2>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-accent-600" />
                </div>
                <div>
                  <p className="font-medium text-desert-ink">Review Process</p>
                  <p className="text-sm text-desert-ink-soft">
                    Our team will review your profile within 1-2 business days to verify your information.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-sunset" />
                </div>
                <div>
                  <p className="font-medium text-desert-ink">Email Notification</p>
                  <p className="text-sm text-desert-ink-soft">
                    You'll receive an email once your profile is approved and live on the platform.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-desert-ink">Start Connecting</p>
                  <p className="text-sm text-desert-ink-soft">
                    Once approved, travelers will be able to find and contact you through your profile.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/">
                Return to Home
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/guides">
                Browse Other Guides
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

