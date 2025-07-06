"use client";

import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";
import { useCurrentTheme } from "@/hooks/use-current-theme";


export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const theme = useCurrentTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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

        {/* Mobile menu button */}
        <Button 
          className="md:hidden flex items-center"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          variant="ghost"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Link href="https://github.com/Om-Raj/codeforces-leaderboard" target="_blank" className="hover:text-secondary-foreground">
            <Image src={theme === "dark" ? "./github-white.svg" : "./github.svg"} alt="Github" width={20} height={20} className="mr-2"/>
          </Link>
          <SignedOut>
            <div className="flex gap-2">
              <SignUpButton>
                <Button variant="outline" size="sm">
                  Sign Up
                </Button>
              </SignUpButton>
              <SignInButton>
                <Button size="sm" variant="secondary">Sign In</Button>
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

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-2 mt-2 border-t border-border">
          <div className="flex flex-col gap-4">
            <ThemeToggle />
            <Link href="https://github.com/Om-Raj/codeforces-leaderboard" target="_blank" className="hover:text-secondary-foreground">
              <Button variant="ghost" size="sm" className="w-full mx-auto">
                <Image src={theme === "dark" ? "./github-white.svg" : "./github.svg"} alt="Github" width={20} height={20} />
              </Button>
            </Link>
            <SignedOut>
              <div className="flex flex-col gap-4 w-full">
                <SignUpButton>
                  <Button variant="outline" size="sm" className="w-full">
                    Sign Up
                  </Button>
                </SignUpButton>
                <SignInButton>
                  <Button size="sm" variant="secondary" className="w-full">Sign In</Button>
                </SignInButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex flex-col gap-4 w-full">
                <Link href="/change-handle" className="w-full">
                  <Button variant="outline" size="sm" className="w-full">Change Handle</Button>
                </Link>
                <SignOutButton>
                  <Button size="sm" className="w-full">Sign Out</Button>
                </SignOutButton>
              </div>
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
};