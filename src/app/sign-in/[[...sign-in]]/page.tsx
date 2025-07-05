"use client";

import { SignIn } from "@clerk/nextjs";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { dark } from "@clerk/themes";

const Page = () => {
  const currentTheme = useCurrentTheme();

  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <section className="space-y-6 pt-[16vh] 2xl:pt-48">
        <div className="text-center p-2 max-w-sm mx-auto">
          <p className="text-md text-sky-700 dark:text-sky-300">Sign in using your NIT Jamshedpur email</p>
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