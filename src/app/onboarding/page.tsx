'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { completeOnboarding } from './_actions'
import CFHandleVerificationForm from '@/components/cf-handle-verification-form'
import { useToast } from '@/hooks/use-toast'

export default function OnboardingPage() {
  const [error, setError] = useState('')
  const router = useRouter()
  const { success, error: showError } = useToast()

  const handleSubmit = async (formData: FormData) => {
    const res = await completeOnboarding(formData)
    if (res?.message) {
      success('Onboarding completed successfully!')
      router.push('/')
    }
    if (res?.error) {
      showError(res.error)
      setError(res.error)
    }
  }
  return (
    <div className="flex justify-center pt-[16vh] 2xl:pt-48">
      <CFHandleVerificationForm handleSubmit={handleSubmit} error={error} />
    </div>
  )
}