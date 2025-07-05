"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

export default function CFHandleVerificationForm({ handleSubmit, error }: { handleSubmit: (formData: FormData) => void, error: string }) {
  const [handle, setHandle] = useState<string>("");
  const [status, setStatus] = useState<"pending" | "success" | "error" | undefined>();
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [token, setToken] = useState<string>("");
  const [verificationStartedAt, setVerificationStartedAt] = useState<number>(0);
  /* TODO: maybe fetch random problem */
  const [contestId, setContestId] = useState<number>(1);
  const [problemIndex, setProblemIndex] = useState<string>("A");
  const [problemName, setProblemName] = useState<string>("Theatre Square");
  const problemUrl = `https://codeforces.com/problemset/problem/${contestId}/${problemIndex}`;

  const verifyHandle = async () => {
    setStatus("pending");
    setTimeRemaining(60);
    setVerificationStartedAt(Math.floor(Date.now() / 1000)); // in seconds
    const interval = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      if (status === "pending") {
        setStatus("error");
      }
    }, 60000);
  }

  const checkSubmission = async () => {
    const res = await fetch('/api/verify-handle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        handle, 
        contestId, 
        problemIndex, 
        verificationStartedAt 
      }),
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      setStatus("success");
    } else {
      setStatus("error");
      console.log(data.error);
    }
  }

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        if (status === "success") {
          const formData = new FormData(e.currentTarget);
          handleSubmit(formData);
        }
      }} 
      className="flex flex-col gap-4 w-full max-w-sm"
    >
      <h1 className="text-2xl font-bold">Codeforces Verification</h1>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="handle">Codeforces handle</label>
        <p className="text-sm text-gray-500">Enter your codeforces handle</p>
        <div className="flex gap-2">
          <Input type="text" id="handle" name="handle" value={handle} onChange={(e) => setHandle(e.target.value)} required />
          <Button type="button" onClick={verifyHandle}>Verify</Button>
        </div>
        {status == "pending" && (
          <div className="flex flex-col gap-2">
            <p>
              Submit a compilation error using this account on the problem:&nbsp;
              <Link href={problemUrl} target="_blank" className="text-blue-500 hover:underline">
                {problemName}
              </Link>
            </p>
            <p>Time remaining: {timeRemaining}s </p>
            <Button type="button" onClick={checkSubmission}>Done</Button>
          </div>
        )}
        {status == "error" && (
          <p>Verification failed. Please try again.</p>
        )}
        {status == "success" && (
          <p>Verification successful.</p>
        )}
      </div>
      <Input type="hidden" name="token" value={token} />
      {error && <p className="text-red-600">Error: {error}</p>}
      <Button type="submit" disabled={status !== "success"}>Submit</Button>
    </form>
  )
}