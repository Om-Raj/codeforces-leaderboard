import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

const isOnboardingRoute = createRouteMatcher(["/onboarding"]);

export default clerkMiddleware(async (auth, req) => {

  const { userId, redirectToSignIn } = await auth();

  // For users visiting /onboarding, don't try to redirect
  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next();
  }

  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && !isPublicRoute(req))
    return redirectToSignIn({ returnBackUrl: req.url });

  // Check if onboarding is complete using server-side Clerk SDK
  if (userId && !isPublicRoute(req)) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const onboardingComplete = user.publicMetadata?.onboardingComplete;

    if (!onboardingComplete) {
      // Allow certain backend routes even if onboarding is not complete
      if (req.nextUrl.pathname === "/api/verify-handle") {
        return NextResponse.next();
      }

      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
