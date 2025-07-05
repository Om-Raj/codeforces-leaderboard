'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from './_actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function OnboardingComponent() {
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
      <form action={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold">Onboarding</h1>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Codeforces Handle</label>
          <p className="text-sm text-gray-500">Enter your codeforces username</p>
          <Input type="text" name="handle" required />
        </div>
        {error && <p className="text-red-600">Error: {error}</p>}
        <Button type="submit">Submit</Button>
      </form>
    </div>
  )
}