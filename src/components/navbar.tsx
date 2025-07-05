"use client";

import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";


export const Navbar = () => {
  return (
    <nav className="p-4 bg-background fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-border">
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo-dark.png" 
            alt="CF Leaderboard" 
            width={24} 
            height={24} 
            className="block dark:hidden"
          />
          <Image 
            src="/logo-light.png" 
            alt="CF Leaderboard" 
            width={24} 
            height={24} 
            className="hidden dark:block"
          />
          <span className="text-xl font-semibold">CF Leaderboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignedOut>
            <div className="flex gap-2">
              <SignUpButton>
                <Button variant="outline" size="sm">
                  Sign Up
                </Button>
              </SignUpButton>
              <SignInButton>
                <Button size="sm">Sign In</Button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <Link href="/change-handle">
              <Button variant="outline" size="sm">Change Handle</Button>
            </Link>
            <SignOutButton>
              <Button size="sm">Sign Out</Button>
            </SignOutButton>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};