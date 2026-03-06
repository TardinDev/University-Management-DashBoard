import { useState } from "react";
import { useList, useGetIdentity } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ChevronLeft, ChevronRight, Clock, FileText, GraduationCap } from "lucide-react";
import type { ScheduleEvent, Assignment, Exam, UserIdentity } from "@/types";

const DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

type CalendarEvent = {
  date: string;
  title: string;
  type: "course" | "assignment" | "exam";
  time?: string;
  color: string;
};

export default function CalendarPage() {
  const { data: identity } = useGetIdentity<UserIdentity>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { result: scheduleResult } = useList<ScheduleEvent>({ resource: "schedule", pagination: { pageSize: 100 } });
  const { result: assignmentResult } = useList<Assignment>({ resource: "assignments", pagination: { pageSize: 100 } });
  const { result: examResult } = useList<Exam>({ resource: "exams", pagination: { pageSize: 100 } });

  const schedule = scheduleResult.data || [];
  const assignments = assignmentResult.data || [];
  const exams = examResult.data || [];

  // Build calendar events
  const events: CalendarEvent[] = [];

  // Weekly schedule events for current month
  const dayMap: Record<string, number> = { Lundi: 1, Mardi: 2, Mercredi: 3, Jeudi: 4, Vendredi: 5, Samedi: 6 };
  const daysInMonth = getDaysInMonth(year, month);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dow = date.getDay();
    for (const s of schedule) {
      if (dayMap[s.dayOfWeek] === dow) {
        events.push({
          date: date.toISOString().split("T")[0],
          title: s.subjectName,
          type: "course",
          time: `${s.startTime}-${s.endTime}`,
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        });
      }
    }
  }

  // Assignment deadlines
  for (const a of assignments) {
    if (a.dueDate) {
      const d = a.dueDate.split("T")[0];
      events.push({ date: d, title: a.title, type: "assignment", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" });
    }
  }

  // Exams
  for (const e of exams) {
    events.push({
      date: e.date,
      title: `${e.type}: ${e.courseName}`,
      type: "exam",
      time: `${e.startTime}-${e.endTime}`,
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    });
  }

  const eventsByDate = events.reduce<Record<string, CalendarEvent[]>>((acc, ev) => {
    (acc[ev.date] = acc[ev.date] || []).push(ev);
    return acc;
  }, {});

  const firstDay = getFirstDayOfMonth(year, month);
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const today = new Date().toISOString().split("T")[0];

  const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];

  return (
    <AnimatedPage>
      <Breadcrumb />
      <h1 className="page-title">Calendrier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
                <CardTitle className="text-lg">{MONTHS[month]} {year}</CardTitle>
                <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
                ))}
                {cells.map((day, i) => {
                  if (day === null) return <div key={`empty-${i}`} />;
                  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const dayEvents = eventsByDate[dateStr] || [];
                  const isToday = dateStr === today;
                  const isSelected = dateStr === selectedDate;

                  return (
                    <div
                      key={dateStr}
                      className={`min-h-[60px] p-1 border rounded cursor-pointer hover:bg-muted/50 transition-colors ${isToday ? "border-primary" : "border-border"} ${isSelected ? "bg-primary/10" : ""}`}
                      onClick={() => setSelectedDate(dateStr)}
                    >
                      <span className={`text-xs font-medium ${isToday ? "text-primary" : ""}`}>{day}</span>
                      <div className="space-y-0.5 mt-0.5">
                        {dayEvents.slice(0, 2).map((ev, j) => (
                          <div key={j} className={`text-[10px] px-1 rounded truncate ${ev.color}`}>{ev.title}</div>
                        ))}
                        {dayEvents.length > 2 && <div className="text-[10px] text-muted-foreground">+{dayEvents.length - 2}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {selectedDate ? new Date(selectedDate + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : "Selectionnez une date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">{selectedDate ? "Aucun evenement" : ""}</p>
              ) : (
                <div className="space-y-3">
                  {selectedEvents.map((ev, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 rounded border">
                      <div className="mt-0.5">
                        {ev.type === "course" && <Clock className="h-4 w-4 text-blue-500" />}
                        {ev.type === "assignment" && <FileText className="h-4 w-4 text-orange-500" />}
                        {ev.type === "exam" && <GraduationCap className="h-4 w-4 text-red-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{ev.title}</p>
                        {ev.time && <p className="text-xs text-muted-foreground">{ev.time}</p>}
                        <Badge variant="outline" className="text-[10px] mt-1">
                          {ev.type === "course" ? "Cours" : ev.type === "assignment" ? "Devoir" : "Examen"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader><CardTitle className="text-base">Legende</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500" /><span className="text-sm">Cours</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-orange-500" /><span className="text-sm">Devoirs</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500" /><span className="text-sm">Examens</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
}
