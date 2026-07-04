import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { prisma } from "@/lib/prisma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { getDbUserId } from "@/actions/user";

export async function POST(req: Request) {
  try {
    const userId = await getDbUserId();
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const { messages, pdfId } = await req.json();
    const lastMessage = messages[messages.length - 1];

    if (!pdfId) {
      return new Response("Missing pdfId", { status: 400 });
    }

    const embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-3-small",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const queryEmbedding = await embeddings.embedQuery(lastMessage.content);
    const vectorString = `[${queryEmbedding.join(",")}]`;

    const relevantChunks: Array<{ id: string; content: string }> = await prisma.$queryRawUnsafe(`
      SELECT id, content
      FROM "DocumentChunk"
      WHERE "pdfId" = $1
      ORDER BY embedding <=> $2::vector
      LIMIT 5;
    `, pdfId, vectorString);

    const contextText = relevantChunks.map(chunk => chunk.content).join("\n\n---\n\n");

    const systemPrompt = `
      You are an intelligent, helpful academic AI assistant named StudySphere AI.
      You are helping a student understand a document they uploaded.

      Use the following pieces of retrieved context from their document to answer their question.
      If you don't know the answer based on the context, say that you don't know and don't make up information.
      Be concise, educational, and formatting your responses using markdown for readability.

      RETRIEVED CONTEXT:
      ${contextText}
    `;

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages: messages,
      async onFinish({ text }) {
        try {
          await prisma.message.createMany({
            data: [
              { role: "user", content: lastMessage.content, pdfId },
              { role: "assistant", content: text, pdfId }
            ]
          });
        } catch (e) {
          console.error("Failed to save chat history", e);
        }
      }
    });

    return result.toTextStreamResponse();

  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
