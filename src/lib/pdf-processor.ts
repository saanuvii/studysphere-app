import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { prisma } from "./prisma";

// Type-safe CommonJS module mapping for pdf-parse
import * as pdfParseModule from "pdf-parse";
const pdfParse = (pdfParseModule as unknown as Record<string, unknown>).default || pdfParseModule;

export async function processPdfForRag(pdfId: string, pdfUrl: string) {
  try {
    const response = await fetch(pdfUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parseFunc = typeof pdfParse === "function" ? pdfParse : (pdfParse as unknown as Record<string, (...args: unknown[]) => Promise<{ text: string }>>).pdfParse;
    const pdfData = await parseFunc(buffer);
    const textContent = pdfData.text;

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await textSplitter.createDocuments([textContent]);

    const embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-3-small",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const chunkTexts = chunks.map((chunk) => chunk.pageContent);
    const embeddingsArray = await embeddings.embedDocuments(chunkTexts);

    for (let i = 0; i < chunks.length; i++) {
      const content = chunkTexts[i];
      const embedding = embeddingsArray[i];
      const vectorString = `[${embedding.join(",")}]`;

      await prisma.$executeRawUnsafe(
        `INSERT INTO "DocumentChunk" (id, content, embedding, "pdfId")
         VALUES (gen_random_uuid(), $1, $2::vector, $3)`,
        content,
        vectorString,
        pdfId
      );
    }

    await prisma.pdf.update({
      where: { id: pdfId },
      data: { status: "ready" },
    });

    return true;

  } catch (error) {
    console.error("Error processing PDF:", error);

    await prisma.pdf.update({
      where: { id: pdfId },
      data: { status: "failed" },
    });

    return false;
  }
}
