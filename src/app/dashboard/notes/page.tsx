import { getNotes } from "@/actions/notes";
import { getSubjects } from "@/actions/subjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Pin, Clock } from "lucide-react";
import Link from "next/link";
import { NoteForm } from "./note-form";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default async function NotesPage() {
  const notes = await getNotes();
  const subjects = await getSubjects();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Notes</h1>
          <p className="text-muted-foreground">Capture and organize your thoughts.</p>
        </div>
        <NoteForm subjects={subjects} />
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 glass-card text-center border-dashed border-2">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No notes yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Start writing down your ideas and class summaries.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Link key={note.id} href={`/dashboard/notes/${note.id}`}>
              <Card className="glass-card hover:border-primary/50 transition-colors cursor-pointer h-full flex flex-col group relative overflow-hidden">
                {note.subject && (
                  <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{ backgroundColor: note.subject.color || "#3b82f6" }}
                  />
                )}
                <CardHeader className="pb-3 pt-6 flex flex-row items-start justify-between space-y-0">
                  <div className="space-y-1 pr-6">
                    <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  {note.isPinned && (
                    <Pin className="h-4 w-4 text-primary absolute top-4 right-4" />
                  )}
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end">
                  <div className="flex flex-wrap gap-2 pt-4">
                    {note.subject && (
                      <Badge variant="outline" style={{ borderColor: note.subject.color || undefined }}>
                        {note.subject.name}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
