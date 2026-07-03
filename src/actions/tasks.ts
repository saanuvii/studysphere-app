"use server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user";
import { revalidatePath } from "next/cache";

export async function getTasks() {
  const userId = await getDbUserId();
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      subject: true,
    }
  });
}

export async function createTask(data: {
  title: string;
  description?: string;
  priority: string;
  subjectId?: string;
}) {
  const userId = await getDbUserId();
  const task = await prisma.task.create({
    data: {
      ...data,
      userId,
    },
  });

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
  return task;
}

export async function toggleTaskCompletion(id: string, isCompleted: boolean) {
  const userId = await getDbUserId();
  await prisma.task.update({
    where: { id, userId },
    data: { isCompleted },
  });

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
}

export async function deleteTask(id: string) {
  const userId = await getDbUserId();
  await prisma.task.delete({
    where: { id, userId },
  });

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
}
