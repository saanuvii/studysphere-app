import { getSubjects, deleteSubject } from "@/actions/subjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, FileText, CheckSquare, Plus, Trash2 } from "lucide-react";
import { SubjectForm } from "./subject-form";
import { Button } from "@/components/ui/button";

export default async function SubjectsPage() {
  const subjects = await getSubjects();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Subjects</h1>
          <p className="text-muted-foreground">Manage your classes and categories.</p>
        </div>
        <SubjectForm />
      </div>

      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 glass-card text-center border-dashed border-2">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <FolderOpen className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No subjects yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Create subjects to organize your notes, flashcards, and tasks efficiently.
          </p>
          <SubjectForm trigger={
            <Button type="button">
              <Plus className="mr-2 h-4 w-4" /> Add your first subject
            </Button>
          } />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Card key={subject.id} className="glass-card overflow-hidden group relative">
              <div
                className="absolute top-0 left-0 w-full h-1.5"
                style={{ backgroundColor: subject.color || "#3b82f6" }}
              />
              <CardHeader className="pb-2 pt-6 flex flex-row items-start justify-between space-y-0">
                <CardTitle className="text-xl font-bold">{subject.name}</CardTitle>
                <form action={deleteSubject.bind(null, subject.id)} className="relative z-20">
                  <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity z-20" title="Delete subject">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    <span>{subject._count.notes} Notes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckSquare className="h-4 w-4" />
                    <span>{subject._count.tasks} Tasks</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
