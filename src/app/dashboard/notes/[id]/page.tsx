import { getNote } from "@/actions/notes";
import { notFound } from "next/navigation";
import { NoteEditor } from "./note-editor";
import { getSubjects } from "@/actions/subjects";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

// In Next.js 15, params is an async Promise
export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const note = await getNote(resolvedParams.id);
  const subjects = await getSubjects();

  if (!note) {
    notFound();
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/dashboard/notes">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="text-sm text-muted-foreground">Back to Notes</div>
      </div>

      <NoteEditor initialNote={note} subjects={subjects} />
    </div>
  );
}
