"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        clerkId: userId,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        imageUrl: user.imageUrl,
      },
    });
  }

  return { success: true };
}

export async function getDbUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  if (!dbUser) {
    await syncUser();
    const newDbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });
    return newDbUser!.id;
  }

  return dbUser.id;
}
