"use server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user";
import { revalidatePath } from "next/cache";

export async function getPdfs() {
  const userId = await getDbUserId();
  return prisma.pdf.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { subject: true }
  });
}

export async function deletePdf(id: string) {
  const userId = await getDbUserId();

  await prisma.pdf.delete({
    where: { id, userId },
  });

  revalidatePath("/dashboard/library");
}
