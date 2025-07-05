import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { handle, contestId, problemIndex, verificationStartedAt } = await request.json();
    const response = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1`);
    const data = await response.json();
    if (data.status === "OK") {
      const submission = data.result[0];
      if (submission.verdict === "COMPILATION_ERROR" && 
          submission.problem.contestId === contestId && 
          submission.problem.index === problemIndex &&
          submission.creationTimeSeconds >= verificationStartedAt &&
          submission.creationTimeSeconds <= verificationStartedAt + 60) {
        const token = sign(
          { 
            handle 
          },
          process.env.JWT_SECRET!, 
          { 
            expiresIn: "5m" 
          }
        );
        return NextResponse.json({ token });
      } else {
        return NextResponse.json({ error: "Invalid submission" });
      }
    } else {
      return NextResponse.json({ error: "Error fetching submission" });
    }
}