import type { ScheduleEvent } from "@/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"] as const;
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8h to 18h

const dayColors: Record<string, string> = {
  "Lundi": "bg-blue-100 border-blue-300 text-blue-900 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-100",
  "Mardi": "bg-emerald-100 border-emerald-300 text-emerald-900 dark:bg-emerald-900/40 dark:border-emerald-700 dark:text-emerald-100",
  "Mercredi": "bg-purple-100 border-purple-300 text-purple-900 dark:bg-purple-900/40 dark:border-purple-700 dark:text-purple-100",
  "Jeudi": "bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-900/40 dark:border-amber-700 dark:text-amber-100",
  "Vendredi": "bg-rose-100 border-rose-300 text-rose-900 dark:bg-rose-900/40 dark:border-rose-700 dark:text-rose-100",
  "Samedi": "bg-cyan-100 border-cyan-300 text-cyan-900 dark:bg-cyan-900/40 dark:border-cyan-700 dark:text-cyan-100",
};

function parseTime(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

type WeeklyCalendarProps = {
  events: ScheduleEvent[];
};

export function WeeklyCalendar({ events }: WeeklyCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header row */}
          <div className="grid grid-cols-[80px_repeat(6,1fr)] border-b">
            <div className="p-2 text-sm font-medium text-muted-foreground" />
            {DAYS.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-semibold border-l">
                {day}
              </div>
            ))}
          </div>

          {/* Time slots */}
          <div className="relative">
            {HOURS.map((hour) => (
              <div key={hour} className="grid grid-cols-[80px_repeat(6,1fr)] border-b" style={{ height: "60px" }}>
                <div className="p-2 text-xs text-muted-foreground text-right pr-3 -translate-y-2">
                  {hour}:00
                </div>
                {DAYS.map((day) => (
                  <div key={`${day}-${hour}`} className="border-l relative" />
                ))}
              </div>
            ))}

            {/* Events overlay */}
            {events.map((event) => {
              const dayIndex = DAYS.indexOf(event.dayOfWeek as typeof DAYS[number]);
              if (dayIndex === -1) return null;

              const startHour = parseTime(event.startTime);
              const endHour = parseTime(event.endTime);
              const top = (startHour - 8) * 60;
              const height = (endHour - startHour) * 60;
              const colWidth = `calc((100% - 80px) / 6)`;
              const left = `calc(80px + ${dayIndex} * ${colWidth})`;

              return (
                <div
                  key={event.id}
                  className={cn(
                    "absolute rounded-md border px-2 py-1 cursor-pointer transition-all hover:shadow-md overflow-hidden",
                    dayColors[event.dayOfWeek] || "bg-gray-100 border-gray-300"
                  )}
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                    left,
                    width: `calc(${colWidth} - 4px)`,
                    marginLeft: "2px",
                  }}
                  onClick={() => setSelectedEvent(event)}
                >
                  <p className="text-xs font-semibold truncate">{event.subjectCode}</p>
                  <p className="text-[10px] truncate">{event.subjectName}</p>
                  <p className="text-[10px] truncate opacity-80">{event.room}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event detail dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.subjectName}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Code</p>
                  <Badge>{selectedEvent.subjectCode}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Enseignant</p>
                  <p className="font-medium">{selectedEvent.teacherName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Jour</p>
                  <p className="font-medium">{selectedEvent.dayOfWeek}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Horaire</p>
                  <p className="font-medium">{selectedEvent.startTime} - {selectedEvent.endTime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Salle</p>
                  <Badge variant="outline">{selectedEvent.room}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Niveau</p>
                  <Badge variant="secondary">{selectedEvent.level}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Département</p>
                  <Badge variant="secondary">{selectedEvent.departement}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Semestre</p>
                  <Badge variant="outline">{selectedEvent.semester}</Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
