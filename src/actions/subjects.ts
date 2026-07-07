"use server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user";
import { revalidatePath } from "next/cache";

export async function getSubjects() {
  const userId = await getDbUserId();
  return prisma.subject.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { notes: true, tasks: true }
      }
    }
  });
}

export async function createSubject(name: string, color: string) {
  const userId = await getDbUserId();
  const subject = await prisma.subject.create({
    data: {
      name,
      color,
      userId,
    },
  });

  revalidatePath("/dashboard", "layout");
  return subject;
}

export async function deleteSubject(id: string) {
  const userId = await getDbUserId();
  await prisma.subject.delete({
    where: { id, userId },
  });

  revalidatePath("/dashboard", "layout");
}
