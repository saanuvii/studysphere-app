"use server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user";
import { revalidatePath } from "next/cache";

export async function getNotes() {
  const userId = await getDbUserId();
  return prisma.note.findMany({
    where: { userId },
    orderBy: [
      { isPinned: "desc" },
      { updatedAt: "desc" },
    ],
    include: {
      subject: true,
      folder: true,
    }
  });
}

export async function getNote(id: string) {
  const userId = await getDbUserId();
  return prisma.note.findUnique({
    where: { id, userId },
    include: { subject: true, folder: true }
  });
}

export async function createNote(title: string, subjectId?: string) {
  const userId = await getDbUserId();
  const note = await prisma.note.create({
    data: {
      title,
      subjectId: subjectId || undefined,
      userId,
      content: "",
    },
  });

  revalidatePath("/dashboard/notes");
  return note;
}

export async function updateNote(id: string, data: {
  title?: string;
  content?: string;
  isPinned?: boolean;
  subjectId?: string | null;
}) {
  const userId = await getDbUserId();
  const note = await prisma.note.update({
    where: { id, userId },
    data,
  });

  revalidatePath("/dashboard/notes");
  revalidatePath(`/dashboard/notes/${id}`);
  return note;
}

export async function deleteNote(id: string) {
  const userId = await getDbUserId();
  await prisma.note.delete({
    where: { id, userId },
  });

  revalidatePath("/dashboard/notes");
}
