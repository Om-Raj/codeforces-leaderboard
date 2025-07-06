"use server";

import prisma from "@/lib/prisma";
import { capitalizeWords, verifyToken } from "@/lib/utils";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

const regIdSchema = z
  .string()
  .regex(/^\d{4}[A-Z]{2}[A-Z]{2}\d{3}$/, "Invalid registration ID format");

export const completeOnboarding = async (formData: FormData) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "No Logged In User" };
  }

  const client = await clerkClient();

  try {
    const clerkUser = await client.users.getUser(userId);
    const email = clerkUser.primaryEmailAddress?.emailAddress ?? "";

    if (!email) {
      return { error: "No valid primary email address found" };
    }

    const regId: z.infer<typeof regIdSchema> = email
      .split("@")[0]
      .toUpperCase();
    const parsedRegId = regIdSchema.safeParse(regId);

    if (!parsedRegId.success) {
      return { error: "Invalid registration ID format" };
    }

    const token = formData.get("token") as string;
    const handle = formData.get("handle") as string;

    const { error } = verifyToken(token, handle);
    if (!!error) {
      return { error };
    }

    const year = parseInt(regId.slice(0, 4));
    const branch = regId.slice(6, 8);

    const user = prisma.user.create({
      data: {
        regId,
        name: capitalizeWords(clerkUser.fullName ?? "Unknown"),
        handle,
        year,
        branch,
      },
    });
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        regId,
        handle,
      },
    });
    return { message: user };
  } catch (err) {
    return { error: "There was an error in completing user onboarding." };
  }
};
