import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RegistrationWizard } from '@/components/registration/RegistrationWizard'

export const Route = createFileRoute('/for-guides/register')({
  component: RegisterPage,
  head: () => ({
    meta: [
      { title: 'Register as a Guide | Tour Guides Israel' },
      { name: 'description', content: 'Create your professional tour guide profile and start connecting with travelers.' },
    ],
  }),
})

function RegisterPage() {
  return (
    <div className="py-8 md:py-12">
      <div className="page-wrap">
        <RegistrationWizard />
      </div>
    </div>
  )
}

