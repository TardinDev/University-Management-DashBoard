import { DEPARTEMENT_OPTIONS, LEVEL_OPTIONS, SEMESTER_OPTIONS } from "@/components/constants";
import { MockSchedule } from "@/components/constants/Mock-Data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { AnimatedPage } from "@/components/ui/animated-page";
import { WeeklyCalendar } from "./components/weekly-calendar";
import { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useAIAssist } from "@/hooks/use-ai-assist";
import { BookOpen, Sparkles, Loader2, RotateCcw } from "lucide-react";
import type { UserIdentity, ScheduleEvent } from "@/types";

const SchedulePage = () => {
  const { data: identity } = useGetIdentity<UserIdentity>();
  const isStudent = identity?.role === "STUDENT";

  const [selectedDepartement, setSelectedDepartement] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("S1");

  const filteredEvents = MockSchedule.filter((event) => {
    if (selectedDepartement !== "all" && event.departement !== selectedDepartement) return false;
    if (selectedLevel !== "all" && event.level !== selectedLevel) return false;
    if (event.semester !== selectedSemester) return false;
    return true;
  });

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <Breadcrumb />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="page-title mb-0">Emploi du Temps</h1>
            <p className="text-muted-foreground">Consultez et filtrez les cours par departement, niveau et semestre</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={selectedDepartement} onValueChange={setSelectedDepartement}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Departement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {DEPARTEMENT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {LEVEL_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Semestre" />
              </SelectTrigger>
              <SelectContent>
                {SEMESTER_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <WeeklyCalendar events={filteredEvents} />
          </CardContent>
        </Card>

        {isStudent && (
          <AIRevisionSection events={filteredEvents} />
        )}
      </div>
    </AnimatedPage>
  );
};

function AIRevisionSection({ events }: { events: ScheduleEvent[] }) {
  const { result, isLoading, error, generate, reset } = useAIAssist();
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  const uniqueCourses = Array.from(
    new Map(events.map((e) => [e.subjectCode, { code: e.subjectCode, name: e.subjectName, teacher: e.teacherName }])).values()
  );

  const handleGenerate = () => {
    const course = uniqueCourses.find((c) => c.code === selectedCourse);
    if (!course) return;
    generate(
      "generate_revision",
      `${course.name} (${course.code}) - Enseignant: ${course.teacher}`,
      "revision"
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-violet-500" />
          Revision de cours avec IA
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Selectionnez un cours pour generer une fiche de revision personnalisee
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="sm:w-[350px]">
              <SelectValue placeholder="Choisir un cours a reviser" />
            </SelectTrigger>
            <SelectContent>
              {uniqueCourses.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  <span className="font-medium">{c.code}</span>
                  <span className="text-muted-foreground"> — {c.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleGenerate}
            disabled={!selectedCourse || isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isLoading ? "Generation en cours..." : "Generer la fiche"}
          </Button>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={reset}>
              Reessayer
            </Button>
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Fiche generee par IA
              </Badge>
              <Button variant="ghost" size="sm" className="gap-1" onClick={reset}>
                <RotateCcw className="h-3.5 w-3.5" />
                Nouvelle revision
              </Button>
            </div>
            <div className="rounded-lg border bg-muted/30 p-5 prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SchedulePage;
