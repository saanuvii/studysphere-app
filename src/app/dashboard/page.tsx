import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Calendar, CheckSquare, FileText, Target } from "lucide-react"

export default function DashboardPage() {
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
            <div className="text-2xl font-bold">12 Days</div>
            <p className="text-xs text-muted-foreground">+2 days from last week</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">Across 5 subjects</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">3 due today</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flashcards Mastered</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">84% accuracy rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="glass-card lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
            <CardDescription>You&apos;ve created 4 notes this week.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border cursor-pointer">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Biology Chapter {i} Summary</p>
                    <p className="text-xs text-muted-foreground">Last edited 2 hours ago</p>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">Science</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card lg:col-span-3">
          <CardHeader>
            <CardTitle>Today&apos;s Schedule</CardTitle>
            <CardDescription>You have 3 events today.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              {[
                { title: "Calculus Exam prep", time: "10:00 AM - 12:00 PM", type: "Study" },
                { title: "Review History Flashcards", time: "2:00 PM - 2:30 PM", type: "Revision" },
                { title: "Complete Physics Assignment", time: "4:00 PM - 6:00 PM", type: "Task" }
              ].map((event, i) => (
                <div key={i} className="flex flex-col gap-1 p-3 border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{event.title}</p>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {event.type}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Calendar className="h-3 w-3" />
                    {event.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
