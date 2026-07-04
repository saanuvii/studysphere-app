import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
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

    // 2. Use Langchain's WebPDFLoader which uses PDF.js internally and is much safer
    // in Web/Next.js/Turbopack environments than node-native `pdf-parse`
    const loader = new WebPDFLoader(blob);
    const docs = await loader.load();

    // Combine all pages into one string
    const textContent = docs.map(doc => doc.pageContent).join("\n\n");

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

    console.log(`Created ${chunks.length} chunks. Generating embeddings...`);

    // 4. Initialize Langchain OpenAI Embeddings
    const embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-3-small",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const chunkTexts = chunks.map((chunk) => chunk.pageContent);

    // 5. Generate embeddings via OpenAI
    const embeddingsArray = await embeddings.embedDocuments(chunkTexts);

    console.log("Embeddings generated successfully. Saving to database...");

    // 6. Save each chunk and its embedding to the Database
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

    console.log("Database updated successfully.");

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
