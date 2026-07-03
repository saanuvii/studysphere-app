"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { updateNote, deleteNote } from "@/actions/notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pin, Trash2, Save, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Note, Subject } from "@prisma/client";

export function NoteEditor({ initialNote, subjects }: { initialNote: Note, subjects: Subject[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(new Date(initialNote.updatedAt));

  const [title, setTitle] = useState(initialNote.title);
  const [content, setContent] = useState(initialNote.content || "");
  const [isPinned, setIsPinned] = useState(initialNote.isPinned);
  const [subjectId, setSubjectId] = useState(initialNote.subjectId || "none");

  const handleSave = useCallback(() => {
    setIsSaving(true);
    startTransition(async () => {
      await updateNote(initialNote.id, {
        title,
        content,
        isPinned,
        subjectId: subjectId !== "none" ? subjectId : null,
      });
      setIsSaving(false);
      setSavedAt(new Date());
    });
  }, [title, content, isPinned, subjectId, initialNote.id]);

  // Auto-save debouncer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        title !== initialNote.title ||
        content !== initialNote.content ||
        isPinned !== initialNote.isPinned ||
        subjectId !== (initialNote.subjectId || "none")
      ) {
        handleSave();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, content, isPinned, subjectId, initialNote.title, initialNote.content, initialNote.isPinned, initialNote.subjectId, handleSave]);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this note?")) {
      startTransition(async () => {
        await deleteNote(initialNote.id);
        router.push("/dashboard/notes");
      });
    }
  };

  return (
    <div className="flex flex-col h-full glass-card overflow-hidden">
      {/* Editor Header */}
      <div className="border-b border-border/50 p-4 flex items-center justify-between bg-background/50">
        <div className="flex-1 max-w-2xl flex items-center gap-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-bold bg-transparent border-none shadow-none focus-visible:ring-0 px-0 h-auto"
            placeholder="Note title..."
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground hidden sm:flex items-center gap-1 mr-4">
            {isSaving ? (
              <><Save className="h-3 w-3 animate-pulse" /> Saving...</>
            ) : savedAt ? (
              <><Check className="h-3 w-3" /> Saved</>
            ) : null}
          </div>

          <Select value={subjectId} onValueChange={(val) => val && setSubjectId(val)}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Subject</SelectItem>
              {subjects.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color || "#3b82f6" }} />
                    {s.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPinned(!isPinned)}
            className={isPinned ? "text-primary bg-primary/10" : "text-muted-foreground"}
            title={isPinned ? "Unpin note" : "Pin note"}
          >
            <Pin className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isPending}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 p-0 flex flex-col">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your notes here... (Markdown supported)"
          className="flex-1 w-full h-full resize-none border-none bg-transparent shadow-none focus-visible:ring-0 p-6 md:p-8 text-base leading-relaxed font-sans"
        />
      </div>
    </div>
  );
}
