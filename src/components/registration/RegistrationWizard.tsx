import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BasicInfoStep } from './steps/BasicInfoStep'
import { ProfessionalStep } from './steps/ProfessionalStep'
import { ServicesStep } from './steps/ServicesStep'
import { PhotosStep } from './steps/PhotosStep'
import { ReviewStep } from './steps/ReviewStep'
import type { RegistrationData } from './types'

const STEPS = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'professional', label: 'Professional' },
  { id: 'services', label: 'Services' },
  { id: 'photos', label: 'Photos' },
  { id: 'review', label: 'Review' },
]

const initialData: RegistrationData = {
  fullName: '',
  email: '',
  phone: '',
  bio: '',
  yearsExperience: 0,
  languages: [],
  tourTypes: [],
  regionsCovered: [],
  maxGroupSize: 10,
  hasVehicle: false,
  vehicleType: '',
  tourDurationOptions: ['half_day', 'full_day'],
  licensedGuideNumber: '',
  uniqueApproach: '',
  whyTourGuide: '',
  photoUrl: '',
  additionalPhotos: [],
  videoUrl: '',
  website: '',
  consentDisplay: false,
  consentContact: false,
}

export function RegistrationWizard() {
  const { t } = useTranslation(['guides', 'common'])
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<RegistrationData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateData = (updates: Partial<RegistrationData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // TODO: Submit to Supabase
      console.log('Submitting:', data)
      // Redirect to success page
    } catch (error) {
      console.error('Error submitting:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                        ? 'bg-sunset text-white'
                        : 'bg-earth-100 text-earth-500'
                  )}
                >
                  {index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={cn(
                  'text-xs mt-2 hidden sm:block',
                  index === currentStep ? 'text-sunset font-medium' : 'text-desert-ink-soft'
                )}>
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={cn(
                  'h-1 w-8 sm:w-16 mx-2',
                  index < currentStep ? 'bg-green-500' : 'bg-earth-100'
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="island-shell rounded-2xl p-6 md:p-8">
        {currentStep === 0 && (
          <BasicInfoStep data={data} updateData={updateData} onNext={nextStep} />
        )}
        {currentStep === 1 && (
          <ProfessionalStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
        )}
        {currentStep === 2 && (
          <ServicesStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
        )}
        {currentStep === 3 && (
          <PhotosStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />
        )}
        {currentStep === 4 && (
          <ReviewStep data={data} onBack={prevStep} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        )}
      </div>
    </div>
  )
}

