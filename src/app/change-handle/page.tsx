'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import CFHandleVerificationForm from '@/components/cf-handle-verification-form'

export default function OnboardingPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    try {
      const res = await fetch('/api/update-user', {
        method: 'POST',
        body: JSON.stringify({
          handle: formData.get('handle'),
          token: formData.get('token')
        })
      });
      if (!res.ok) {
        throw new Error(await res.text());
      } else {
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        router.push('/');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update user");
    }
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <CFHandleVerificationForm handleSubmit={handleSubmit} error={error} />
    </div>
  )
}