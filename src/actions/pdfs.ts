"use server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

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

  // Get the PDF to find its UploadThing key
  const pdf = await prisma.pdf.findUnique({
    where: { id, userId },
  });

  if (!pdf) return;

  // Delete from UploadThing
  try {
    await utapi.deleteFiles(pdf.key);
  } catch (error) {
    console.error("Failed to delete file from UploadThing:", error);
  }

  // Delete from Database
  await prisma.pdf.delete({
    where: { id, userId },
  });

  // Revalidate the entire dashboard layout to instantly reflect changes
  revalidatePath("/dashboard", "layout");
}
