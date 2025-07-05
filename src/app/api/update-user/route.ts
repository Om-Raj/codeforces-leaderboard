'use server'

import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/utils';
import { auth, clerkClient } from '@clerk/nextjs/server'


export async function POST (formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    return { error: 'No Logged In User' }
  }

  const client = await clerkClient()

  try {
    const clerkUser = await client.users.getUser(userId);
    const regId = clerkUser.publicMetadata.regId as string;

    const token = formData.get('token') as string;
    const handle = formData.get('handle') as string;

    const { error } = verifyToken(token, handle);
    if (!!error) {
      return { error };
    }

    const user = prisma.user.update({
      where: {
        regId,
      },
      data: {
        handle,
      }
    });
    return { message: user }
  } catch (err) {
    return { error: 'Failed to update user' }
  }
}