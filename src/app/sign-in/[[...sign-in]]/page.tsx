"use client";

import { SignIn } from "@clerk/nextjs";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { dark } from "@clerk/themes";
import { BadgeInfoIcon } from "lucide-react";

const Page = () => {
  const currentTheme = useCurrentTheme();

  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <section className="space-y-4 pt-[16vh] 2xl:pt-48">
        <div className="flex items-center justify-center gap-2">
          <BadgeInfoIcon className="w-5 h-5" />
          <p className="text-md">Sign in using your NIT Jamshedpur email</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <SignIn 
            appearance={{
              baseTheme: currentTheme === "dark" ? dark : undefined,
              elements: {
                cardBox: "border! shadow-none! rounded-lg!",
              }
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default Page;