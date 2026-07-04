import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getDbUserId } from "@/actions/user";
import { prisma } from "@/lib/prisma";
import { processPdfForRag } from "@/lib/pdf-processor";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(async () => {
      const userId = await getDbUserId().catch(() => null);
      if (!userId) throw new UploadThingError("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      const pdfRecord = await prisma.pdf.create({
        data: {
          name: file.name,
          key: file.key,
          url: file.url,
          size: file.size,
          userId: metadata.userId,
          status: "processing",
        }
      });

      processPdfForRag(pdfRecord.id, file.url).catch(console.error);

      return { uploadedBy: metadata.userId, key: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
