'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { completeOnboarding } from './_actions'
import CFHandleVerificationForm from '@/components/cf-handle-verification-form'

export default function OnboardingPage() {
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    const res = await completeOnboarding(formData)
    if (res?.message) {
      router.push('/')
    }
    if (res?.error) {
      setError(res?.error)
    }
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <CFHandleVerificationForm handleSubmit={handleSubmit} error={error} />
    </div>
  )
}