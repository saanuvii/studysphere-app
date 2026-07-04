import { getPdfs } from "@/actions/pdfs";
import { ChatInterface } from "./chat-interface";
import { Book } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: { pdfId?: string };
}) {
  const pdfs = await getPdfs();
  const activePdfId = searchParams.pdfId;

  const readyPdfs = pdfs.filter(p => p.status === "ready");
  const activePdf = readyPdfs.find(p => p.id === activePdfId);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Sidebar for PDF selection */}
      <div className="w-64 flex flex-col gap-4 border-r border-border/50 pr-4 hidden md:flex h-full overflow-y-auto">
        <div>
          <h2 className="font-semibold text-lg mb-1">Documents</h2>
          <p className="text-xs text-muted-foreground mb-4">Select a document to chat with</p>
        </div>

        {readyPdfs.length === 0 ? (
          <div className="text-center p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
            No ready PDFs found.
            <Link href="/dashboard/library" className="block mt-2 text-primary hover:underline">
              Upload one
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {readyPdfs.map((pdf) => (
              <Link key={pdf.id} href={`/dashboard/chat?pdfId=${pdf.id}`}>
                <div className={`p-3 rounded-lg text-sm transition-colors border ${
                  activePdfId === pdf.id
                    ? "bg-primary/10 border-primary/30 text-primary font-medium"
                    : "bg-card border-transparent hover:border-border hover:bg-muted/50 text-muted-foreground"
                }`}>
                  <div className="flex items-center gap-2">
                    <Book className="h-4 w-4 shrink-0" />
                    <span className="truncate">{pdf.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 glass-card overflow-hidden flex flex-col relative">
        {!activePdf ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Book className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Select a Document</h2>
            <p className="text-muted-foreground max-w-sm mb-6">
              Choose a PDF from the sidebar to start asking questions, extracting summaries, and generating notes.
            </p>
            {readyPdfs.length === 0 && (
               <Link href="/dashboard/library">
                 <Button>Go to Library</Button>
               </Link>
            )}
          </div>
        ) : (
          <ChatInterface pdfId={activePdf.id} pdfName={activePdf.name} />
        )}
      </div>
    </div>
  );
}
