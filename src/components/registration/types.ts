export interface RegistrationData {
  // Basic Info
  fullName: string
  email: string
  phone: string
  bio: string
  
  // Professional
  yearsExperience: number
  languages: string[]
  licensedGuideNumber: string
  uniqueApproach: string
  whyTourGuide: string
  
  // Services
  tourTypes: string[]
  regionsCovered: string[]
  maxGroupSize: number
  hasVehicle: boolean
  vehicleType: string
  tourDurationOptions: string[]
  
  // Photos
  photoUrl: string
  additionalPhotos: string[]
  videoUrl: string
  website: string
  
  // Consent
  consentDisplay: boolean
  consentContact: boolean
}

export interface StepProps {
  data: RegistrationData
  updateData: (updates: Partial<RegistrationData>) => void
  onNext: () => void
  onBack?: () => void
}

