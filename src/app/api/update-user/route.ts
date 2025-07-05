import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/utils';
import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'No Logged In User' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { handle, token } = body;

    if (!handle || !token) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const regId = clerkUser.publicMetadata.regId as string;
    const currentHandle = clerkUser.publicMetadata.handle as string;

    if (currentHandle === handle) {
      return NextResponse.json({ message: 'Handle is already set to this value' }, { status: 200 });
    }

    const { error } = verifyToken(token, handle);
    if (!!error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: {
        regId,
      },
      data: {
        handle,
      }
    });

    // Update Clerk metadata
    await client.users.updateUser(userId, {
      publicMetadata: {
        ...clerkUser.publicMetadata,
        handle,
      },
    });

    return NextResponse.json({ message: 'User updated successfully', user }, { status: 200 });
  } catch (err) {
    console.error('Error updating user:', err);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}