'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import CFHandleVerificationForm from '@/components/cf-handle-verification-form'
import { useToast } from '@/hooks/use-toast'

export default function OnboardingPage() {
  const [error, setError] = useState('');
  const router = useRouter();
  const { success, error: showError } = useToast();

  const handleSubmit = async (formData: FormData) => {
    try {
      const res = await fetch('/api/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          handle: formData.get('handle'),
          token: formData.get('token')
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        showError(data.error || 'Failed to update handle');
        setError(data.error || 'Failed to update handle');
        return;
      }
      
      if (data.message === 'Handle is already set to this value') {
        success('Your handle is already set to this value.');
        router.push('/');
        return;
      }
      
      success('Handle updated successfully!');
      router.push('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update user";
      setError(errorMessage);
      showError(errorMessage);
    }
  }
  
  return (
    <div className="flex justify-center pt-[16vh] 2xl:pt-48">
      <CFHandleVerificationForm handleSubmit={handleSubmit} error={error} />
    </div>
  )
}