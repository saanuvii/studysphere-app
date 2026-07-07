import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, CheckSquare, FileText, Target } from "lucide-react"
import { getNotes } from "@/actions/notes"
import { getTasks } from "@/actions/tasks"
import { getPdfs } from "@/actions/pdfs"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

export default async function DashboardPage() {
  const notes = await getNotes();
  const tasks = await getTasks();
  const pdfs = await getPdfs();

  const pendingTasks = tasks.filter(t => !t.isCompleted);
  const completedTasksCount = tasks.length - pendingTasks.length;

  const readyPdfsCount = pdfs.filter(p => p.status === "ready").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">Here&apos;s an overview of your academic progress.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1 Day</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notes.length}</div>
            <p className="text-xs text-muted-foreground">Recorded securely</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks.length}</div>
            <p className="text-xs text-muted-foreground">{completedTasksCount} completed</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Documents</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readyPdfsCount}</div>
            <p className="text-xs text-muted-foreground">Ready for RAG processing</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="glass-card lg:col-span-4 flex flex-col">
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
            <CardDescription>Your latest thought records.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {notes.length === 0 ? (
               <div className="flex flex-col items-center justify-center text-center p-6 bg-muted/20 rounded-lg h-full">
                 <p className="text-sm text-muted-foreground">No notes created yet.</p>
               </div>
            ) : (
               <div className="space-y-4">
                 {notes.slice(0, 5).map((note) => (
                   <Link key={note.id} href={`/dashboard/notes/${note.id}`}>
                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border cursor-pointer">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{note.title}</p>
                        <p className="text-xs text-muted-foreground">Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</p>
                      </div>
                      {note.subject && (
                        <div className="text-xs text-muted-foreground px-2 py-1 rounded-md" style={{ backgroundColor: `${note.subject.color}20`, color: note.subject.color || undefined }}>
                          {note.subject.name}
                        </div>
                      )}
                    </div>
                   </Link>
                 ))}
               </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>Your immediate priorities.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
             {pendingTasks.length === 0 ? (
               <div className="flex flex-col items-center justify-center text-center p-6 bg-muted/20 rounded-lg h-full">
                 <p className="text-sm text-muted-foreground">You&apos;re all caught up!</p>
               </div>
            ) : (
             <div className="space-y-4">
              {pendingTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex flex-col gap-1 p-3 border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium line-clamp-1">{task.title}</p>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full capitalize"
                          style={{
                            backgroundColor: task.priority === "high" ? "rgba(239, 68, 68, 0.1)" : task.priority === "medium" ? "rgba(245, 158, 11, 0.1)" : "rgba(16, 185, 129, 0.1)",
                            color: task.priority === "high" ? "rgb(239, 68, 68)" : task.priority === "medium" ? "rgb(245, 158, 11)" : "rgb(16, 185, 129)"
                          }}>
                      {task.priority}
                    </span>
                  </div>
                  {task.subject && (
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: task.subject.color || "#ccc" }} />
                      {task.subject.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
