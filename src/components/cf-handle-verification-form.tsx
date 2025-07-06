"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function CFHandleVerificationForm({
  handleSubmit,
  error,
}: {
  handleSubmit: (formData: FormData) => void;
  error: string;
}) {
  const [handle, setHandle] = useState<string>("");
  const [status, setStatus] = useState<
    "pending" | "success" | "error" | undefined
  >();
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [token, setToken] = useState<string>("");
  const [verificationStartedAt, setVerificationStartedAt] = useState<number>(0);
  const [submitPending, setSubmitPending] = useState<boolean>(false);
  const { success, error: showError } = useToast();
  /* TODO: maybe fetch random problem */
  const [contestId, setContestId] = useState<number>(1);
  const [problemIndex, setProblemIndex] = useState<string>("A");
  const [problemName, setProblemName] = useState<string>("Theatre Square");
  const problemUrl = `https://codeforces.com/problemset/problem/${contestId}/${problemIndex}`;

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );

  const verifyHandle = async () => {
    if (!handle) {
      showError("Please enter a Codeforces handle");
      return;
    }

    // Clear any existing timers
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setStatus("pending");
    setTimeRemaining(60);
    setVerificationStartedAt(Math.floor(Date.now() / 1000)); // in seconds

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setStatus("error");
      showError("Verification timed out. Please try again.");
    }, 60000);
  };

  const checkSubmission = async () => {
    const res = await fetch("/api/verify-handle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        handle,
        contestId,
        problemIndex,
        verificationStartedAt,
      }),
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      setStatus("success");
      success("Handle verification successful!");

      // Clear timers
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else {
      setStatus("error");
      showError(data.error || "Verification failed. Please try again.");
      console.log(data.error);
    }
  };

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "success" && !submitPending) {
      setSubmitPending(true);
      const formData = new FormData(e.currentTarget);
      handleSubmit(formData);
    }
  };

  return (
    <Card className="w-full max-w-[400px]">
      <CardHeader>
        <CardTitle>
          <h1 className="text-3xl pb-3 text-center font-bold">
            Codeforces Verification
          </h1>
        </CardTitle>
        <CardDescription>
          Enter your codeforces handle below to verify your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => formSubmit(e)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="handle">
              Codeforces handle
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                id="handle"
                name="handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                required
                className="w-full"
                placeholder="username"
              />
              <Button type="button" onClick={verifyHandle} variant="secondary">
                Verify
              </Button>
            </div>
            {status == "pending" && (
              <div className="flex flex-col gap-2">
                <p>
                  Submit a compilation error using this account on the
                  problem:&nbsp;
                  <Link
                    href={problemUrl}
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    {contestId + problemIndex + " - " + problemName}
                  </Link>
                </p>
                <p>Time remaining: {timeRemaining}s </p>
                <Button
                  type="button"
                  onClick={checkSubmission}
                  disabled={submitPending}
                  className="w-full"
                  variant="outline"
                >
                  Task Done
                </Button>
              </div>
            )}
            {status == "error" && (
              <p className="text-destructive">
                Verification failed. Please try again.
              </p>
            )}
            {status == "success" && (
              <p className="text-accent">Verification successful.</p>
            )}
          </div>
          <Input type="hidden" name="token" value={token} />
          {error && <p className="text-red-600">{error}</p>}

          <Button
            type="submit"
            disabled={status !== "success" || submitPending}
            className="w-full mt-4"
          >
            {submitPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
