import { getPdfs } from "@/actions/pdfs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Loader2, Trash2 } from "lucide-react";
import { UploadPdfDialog } from "./upload-dialog";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deletePdf } from "@/actions/pdfs";

export default async function LibraryPage() {
  const pdfs = await getPdfs();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">PDF Library</h1>
          <p className="text-muted-foreground">Upload textbooks and lecture slides to chat with AI.</p>
        </div>
        <UploadPdfDialog />
      </div>

      {pdfs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 glass-card text-center border-dashed border-2">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Book className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No documents yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Upload your first PDF to generate flashcards, summaries, and chat with your documents.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pdfs.map((pdf) => (
            <Card key={pdf.id} className="glass-card flex flex-col relative group">
              <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1 pr-6 flex-1">
                  <CardTitle className="text-lg line-clamp-2" title={pdf.name}>
                    {pdf.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {(pdf.size / 1024 / 1024).toFixed(2)} MB • Uploaded {formatDistanceToNow(new Date(pdf.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <form action={async () => {
                    "use server";
                    await deletePdf(pdf.id);
                  }}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" title="Delete PDF">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                <div className="flex items-center justify-between mt-2">
                  <Badge variant={pdf.status === "ready" ? "default" : pdf.status === "failed" ? "destructive" : "secondary"}>
                    {pdf.status === "processing" && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                    {pdf.status.charAt(0).toUpperCase() + pdf.status.slice(1)}
                  </Badge>
                  {pdf.subject && (
                    <Badge variant="outline" style={{ borderColor: pdf.subject.color || undefined }}>
                      {pdf.subject.name}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
