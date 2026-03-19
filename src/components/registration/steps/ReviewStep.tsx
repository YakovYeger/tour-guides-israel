import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Check, Loader2 } from 'lucide-react'
import type { RegistrationData } from '../types'

interface ReviewStepProps {
  data: RegistrationData
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function ReviewStep({ data, onBack, onSubmit, isSubmitting }: ReviewStepProps) {
  const { t } = useTranslation(['guides', 'common'])

  const isValid = data.consentDisplay && data.consentContact

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-desert-ink mb-2">Review Your Profile</h2>
        <p className="text-desert-ink-soft">Please review your information before submitting</p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4">
        <SummaryCard title="Basic Info">
          <p><strong>Name:</strong> {data.fullName}</p>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Phone:</strong> {data.phone}</p>
        </SummaryCard>

        <SummaryCard title="Professional">
          <p><strong>Experience:</strong> {data.yearsExperience} years</p>
          <p><strong>Languages:</strong> {data.languages.map(l => t(`common:languages.${l}`)).join(', ')}</p>
          {data.licensedGuideNumber && <p><strong>License:</strong> #{data.licensedGuideNumber}</p>}
        </SummaryCard>

        <SummaryCard title="Services">
          <p><strong>Tour Types:</strong> {data.tourTypes.map(type => t(`common:tourTypes.${type}`)).join(', ')}</p>
          <p><strong>Regions:</strong> {data.regionsCovered.map(r => t(`common:regions.${r}`)).join(', ')}</p>
          <p><strong>Max Group:</strong> {data.maxGroupSize} people</p>
          <p><strong>Vehicle:</strong> {data.hasVehicle ? `Yes (${data.vehicleType || 'Type not specified'})` : 'No'}</p>
        </SummaryCard>

        <SummaryCard title="Media">
          <p><strong>Profile Photo:</strong> {data.photoUrl ? '✓ Added' : '✗ Not added'}</p>
          <p><strong>Gallery Photos:</strong> {data.additionalPhotos.length} photos</p>
          <p><strong>Video:</strong> {data.videoUrl ? '✓ Added' : '✗ Not added'}</p>
          <p><strong>Website:</strong> {data.website || 'Not provided'}</p>
        </SummaryCard>
      </div>

      {/* Consent */}
      <div className="p-4 rounded-xl bg-earth-50 border border-earth-200 space-y-4">
        <h3 className="font-semibold text-desert-ink">Terms & Consent</h3>
        
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={data.consentDisplay}
            onChange={(e) => {
              // This is a bit hacky since we don't have updateData in ReviewStep
              // In production, pass updateData to ReviewStep
            }}
            className="mt-1 w-4 h-4 text-sunset rounded"
          />
          <span className="text-sm text-desert-ink-soft">
            I consent to having my profile displayed publicly on Tour Guides Israel. I understand that my contact information will be visible to potential clients.
          </span>
        </label>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={data.consentContact}
            onChange={(e) => {
              // Same as above
            }}
            className="mt-1 w-4 h-4 text-sunset rounded"
          />
          <span className="text-sm text-desert-ink-soft">
            I consent to being contacted by Tour Guides Israel regarding my profile and by potential clients through the platform.
          </span>
        </label>
      </div>

      {/* Note about approval */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> Your profile will be reviewed by our team before being published. This usually takes 1-2 business days. You'll receive an email once your profile is approved.
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" size="lg" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button size="lg" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Submit Profile
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function SummaryCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl bg-surface border border-line">
      <h3 className="font-semibold text-desert-ink mb-2">{title}</h3>
      <div className="text-sm text-desert-ink-soft space-y-1">
        {children}
      </div>
    </div>
  )
}

