import { useCreate, useList, useGo } from "@refinedev/core";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ArrowLeft } from "lucide-react";
import type { Course, Room } from "@/types";

export default function ExamsCreate() {
  const go = useGo();
  const { mutate } = useCreate();

  const { result: coursesResult } = useList<Course>({
    resource: "courses",
    pagination: { pageSize: 200 },
  });
  const { result: roomsResult } = useList<Room>({
    resource: "rooms",
    pagination: { pageSize: 200 },
  });

  const courses = coursesResult.data || [];
  const rooms = roomsResult.data || [];

  const [courseId, setCourseId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [type, setType] = useState<string>("");
  const [semester, setSemester] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      {
        resource: "exams",
        values: {
          courseId,
          roomId: Number(roomId),
          date,
          startTime,
          endTime,
          type,
          semester,
        },
      },
      { onSuccess: () => go({ to: "/exams" }) }
    );
  };

  return (
    <AnimatedPage>
      <Breadcrumb />
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => go({ to: "/exams" })}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Nouvel Examen</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Cours</Label>
              <Select value={courseId} onValueChange={setCourseId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selectionner un cours" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.code} - {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Salle</Label>
              <Select value={roomId} onValueChange={setRoomId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selectionner une salle" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      {r.name} ({r.type} - {r.capacity} places)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Heure de debut</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Heure de fin</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Type d'examen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Partiel">Partiel</SelectItem>
                    <SelectItem value="Final">Final</SelectItem>
                    <SelectItem value="Rattrapage">Rattrapage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Semestre</Label>
                <Select value={semester} onValueChange={setSemester} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S1">S1</SelectItem>
                    <SelectItem value="S2">S2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => go({ to: "/exams" })}
              >
                Annuler
              </Button>
              <Button type="submit">Creer l'examen</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
