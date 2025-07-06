"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { completeOnboarding } from "./_actions";
import CFHandleVerificationForm from "@/components/cf-handle-verification-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";

export default function OnboardingPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { success, error: showError } = useToast();
  const { getToken } = useAuth();

  const handleSubmit = async (formData: FormData) => {
    try {
      const res = await completeOnboarding(formData);
      
      if (res?.message) {
        // Force a session refresh to update the claims with new metadata
        await getToken({ skipCache: true });
        success("Onboarding completed successfully!");
        router.push("/");
        return;
      }
      
      if (res?.error) {
        showError(res.error);
        setError(res.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      showError(errorMessage);
      setError(errorMessage);
    }
  };
  return (
    <div className="flex justify-center pt-[16vh] 2xl:pt-48">
      <CFHandleVerificationForm handleSubmit={handleSubmit} error={error} />
    </div>
  );
}
