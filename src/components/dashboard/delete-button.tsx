"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteButton({
  onDelete
}: {
  onDelete: () => Promise<void>
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.preventDefault();
        startTransition(async () => {
          await onDelete();
        });
      }}
      disabled={isPending}
      className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity z-20"
      title="Delete"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  );
}
