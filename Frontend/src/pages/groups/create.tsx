import { useCreate, useGo, useList } from "@refinedev/core";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ArrowLeft } from "lucide-react";
import type { Course, Teacher } from "@/types";

export default function GroupsCreate() {
  const go = useGo();
  const { mutate } = useCreate();

  const { result: coursesResult } = useList<Course>({
    resource: "courses",
    pagination: { pageSize: 200 },
  });
  const { result: teachersResult } = useList<Teacher>({
    resource: "teachers",
    pagination: { pageSize: 200 },
    filters: [{ field: "status", operator: "eq", value: "Actif" }],
  });

  const courses = coursesResult.data || [];
  const teachers = teachersResult.data || [];

  const [name, setName] = useState("");
  const [type, setType] = useState<"TD" | "TP">("TD");
  const [courseId, setCourseId] = useState("");
  const [professorId, setProfessorId] = useState("");
  const [studentsText, setStudentsText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const students = studentsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    mutate(
      {
        resource: "groups",
        values: {
          name,
          type,
          courseId,
          professorId: Number(professorId),
          students,
        },
      },
      { onSuccess: () => go({ to: "/groups" }) }
    );
  };

  return (
    <AnimatedPage>
      <Breadcrumb />
      <Button variant="ghost" className="mb-4" onClick={() => go({ to: "/groups" })}>
        <ArrowLeft className="h-4 w-4 mr-2" />Retour
      </Button>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Nouveau Groupe</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Groupe A1" required />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as "TD" | "TP")}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TD">TD - Travaux Diriges</SelectItem>
                  <SelectItem value="TP">TP - Travaux Pratiques</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cours</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectionner un cours" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Enseignant</Label>
              <Select value={professorId} onValueChange={setProfessorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectionner un enseignant" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.firstName} {t.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Etudiants (IDs separes par des virgules)</Label>
              <Textarea
                value={studentsText}
                onChange={(e) => setStudentsText(e.target.value)}
                placeholder="id1, id2, id3"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => go({ to: "/groups" })}>Annuler</Button>
              <Button type="submit">Creer</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
