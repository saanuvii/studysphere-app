import { getTasks } from "@/actions/tasks";
import { getSubjects } from "@/actions/subjects";
import { TaskList } from "./task-list";
import { TaskForm } from "./task-form";

export default async function TasksPage() {
  const tasks = await getTasks();
  const subjects = await getSubjects();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Tasks</h1>
          <p className="text-muted-foreground">Manage your assignments and to-dos.</p>
        </div>
        <TaskForm subjects={subjects} />
      </div>

      <TaskList initialTasks={tasks} />
    </div>
  );
}
