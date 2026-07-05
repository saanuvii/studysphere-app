import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { prisma } from "./prisma";

export async function processPdfForRag(pdfId: string, pdfUrl: string) {
  try {
    console.log("Downloading PDF from:", pdfUrl);
    // 1. Download the PDF file from the remote URL
    const response = await fetch(pdfUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF. Status: ${response.status}`);
    }

    const blob = await response.blob();

    console.log("PDF downloaded successfully. Extracting text...");

    // 2. Use Langchain's PDFLoader
    const loader = new PDFLoader(blob, {
      splitPages: false,
    });
    const docs = await loader.load();

    // Combine all pages into one string and clean up excessive whitespace
    const textContent = docs.map(doc => doc.pageContent).join("\n\n").replace(/\s+/g, " ");

    if (!textContent || textContent.trim() === "") {
      throw new Error("No text content extracted from PDF");
    }

    console.log("Text extracted. Splitting into chunks...");

    // 3. Split the text into manageable chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await textSplitter.createDocuments([textContent]);

    // Filter out empty chunks to prevent API errors
    const validChunks = chunks.filter(c => c.pageContent && c.pageContent.trim().length > 5);
    console.log(`Created ${validChunks.length} valid chunks. Generating embeddings...`);

    // 4. Initialize Langchain Google GenAI Embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      modelName: "text-embedding-004", // Google Gemini 768-dim model
      apiKey: process.env.GEMINI_API_KEY,
    });

    const chunkTexts = validChunks.map((chunk) => chunk.pageContent);

    // 5. Generate embeddings via Google Gemini
    const embeddingsArray = await embeddings.embedDocuments(chunkTexts);

    console.log("Embeddings generated successfully. Saving to database...");

    // Force vector dimensions if Prisma failed to sync the type change previously
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "DocumentChunk" ALTER COLUMN embedding TYPE vector(768);`);
    } catch (e) {
      // Ignore if it's already correct
    }

    // 6. Save each chunk and its embedding to the Database
    let savedCount = 0;
    for (let i = 0; i < validChunks.length; i++) {
      const content = chunkTexts[i];
      const embedding = embeddingsArray[i];

      // Safe check: skip empty/invalid embeddings which crash pgvector
      if (!embedding || embedding.length === 0 || embedding.length !== 768) {
         console.warn(`Skipping chunk ${i} due to invalid embedding dimension: ${embedding?.length}`);
         continue;
      }

      const vectorString = `[${embedding.join(",")}]`;

      await prisma.$executeRawUnsafe(
        `INSERT INTO "DocumentChunk" (id, content, embedding, "pdfId")
         VALUES (gen_random_uuid(), $1, $2::vector, $3)`,
        content,
        vectorString,
        pdfId
      );
      savedCount++;
    }

    console.log(`Database updated successfully. Saved ${savedCount} chunks.`);

    // 7. Update PDF status to ready
    await prisma.pdf.update({
      where: { id: pdfId },
      data: { status: "ready" },
    });

    return true;

  } catch (error) {
    console.error("Error processing PDF:", error);

    // Update PDF status to failed
    await prisma.pdf.update({
      where: { id: pdfId },
      data: { status: "failed" },
    });

    return false;
  }
}
