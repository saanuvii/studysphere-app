"use client";

import { useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical, CheckSquare } from "lucide-react";
import { toggleTaskCompletion, deleteTask } from "@/actions/tasks";


// Define Task types based on Prisma schema with relations
type Subject = {
  id: string;
  name: string;
  color: string | null;
}

type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  isCompleted: boolean;
  subject: Subject | null;
}

export function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleTaskCompletion(id, !currentStatus);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteTask(id);
    });
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "high": return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      case "medium": return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
      case "low": return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  }

  if (initialTasks.length === 0) {
    return (
       <div className="flex flex-col items-center justify-center p-12 glass-card text-center border-dashed border-2">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <CheckSquare className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No tasks yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Stay on top of your assignments by adding a new task.
          </p>
        </div>
    )
  }

  return (
    <div className="space-y-3">
      {initialTasks.map((task) => (
        <div
          key={task.id}
          className={`glass-card p-4 flex items-start gap-4 transition-all ${
            task.isCompleted ? "opacity-60 bg-muted/20" : ""
          }`}
        >
          <div className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hidden sm:block">
            <GripVertical className="h-5 w-5" />
          </div>
          <div className="mt-1">
            <Checkbox
              checked={task.isCompleted}
              onCheckedChange={() => handleToggle(task.id, task.isCompleted)}
              disabled={isPending}
            />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className={`font-medium text-lg leading-none ${task.isCompleted ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground">{task.description}</p>
            )}
            <div className="flex items-center gap-2 pt-2">
              <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              {task.subject && (
                <Badge variant="outline" style={{ borderColor: task.subject.color || undefined }}>
                  {task.subject.name}
                </Badge>
              )}
            </div>
          </div>
          <div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(task.id)}
              disabled={isPending}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
