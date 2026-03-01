import { DEPARTEMENT_OPTIONS, LEVEL_OPTIONS, SEMESTER_OPTIONS } from "@/components/constants";
import { MockSchedule } from "@/components/constants/Mock-Data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { AnimatedPage } from "@/components/ui/animated-page";
import { WeeklyCalendar } from "./components/weekly-calendar";
import { useState } from "react";

const SchedulePage = () => {
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
            <p className="text-muted-foreground">Consultez et filtrez les cours par département, niveau et semestre</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={selectedDepartement} onValueChange={setSelectedDepartement}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Département" />
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
      </div>
    </AnimatedPage>
  );
};

export default SchedulePage;
