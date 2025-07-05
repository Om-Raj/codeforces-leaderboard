'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from './_actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import CFHandleVerificationForm from '@/components/cf-handle-verification-form'

export default function OnboardingPage() {
  const [error, setError] = React.useState('')
  const { user } = useUser()
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    const res = await completeOnboarding(formData)
    if (res?.message) {
      // Reloads the user's data from the Clerk API
      await user?.reload()
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