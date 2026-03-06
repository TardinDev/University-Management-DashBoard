import { useList, useCreate, useOne } from "@refinedev/core";
import { useState } from "react";
import { Check, Clock, UserCheck, UserX, Save, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import type { Course, Attendance } from "@/types";

type AttendanceStatus = Attendance["status"];

export default function AttendancePage() {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [sessionType, setSessionType] = useState<"CM" | "TD" | "TP">("CM");
  const [attendanceMap, setAttendanceMap] = useState<Map<string, AttendanceStatus>>(new Map());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { result: coursesResult } = useList<Course>({
    resource: "courses",
    pagination: { pageSize: 100 },
  });
  const courses = coursesResult.data || [];

  const { result: courseDetail, query: courseQuery } = useOne<Course>({
    resource: "courses",
    id: selectedCourseId,
    queryOptions: { enabled: !!selectedCourseId },
  });

  const course = selectedCourseId ? courseDetail : null;
  const students = course?.enrollments || [];

  const { mutate: createAttendance } = useCreate();

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => {
      const next = new Map(prev);
      next.set(studentId, status);
      return next;
    });
    setSaved(false);
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setAttendanceMap(new Map());
    setSaved(false);
  };

  const handleSave = () => {
    if (!course || attendanceMap.size === 0) return;
    setSaving(true);
    let completed = 0;
    const total = attendanceMap.size;

    attendanceMap.forEach((status, studentId) => {
      const student = students.find((e) => e.student.id === studentId)?.student;
      createAttendance(
        {
          resource: "attendance",
          values: {
            courseId: course.id,
            courseName: course.name,
            studentId,
            studentName: student ? `${student.firstName} ${student.lastName}` : "",
            studentMatricule: student?.matricule || "",
            date,
            status,
            sessionType,
          },
        },
        {
          onSuccess: () => {
            completed++;
            if (completed >= total) {
              setSaving(false);
              setSaved(true);
            }
          },
          onError: () => {
            completed++;
            if (completed >= total) {
              setSaving(false);
            }
          },
        }
      );
    });
  };

  const markAll = (status: AttendanceStatus) => {
    const next = new Map<string, AttendanceStatus>();
    students.forEach((e) => next.set(e.student.id, status));
    setAttendanceMap(next);
    setSaved(false);
  };

  const statusConfig: Record<AttendanceStatus, { icon: typeof Check; color: string; bg: string }> = {
    "Présent": { icon: UserCheck, color: "text-green-700 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700" },
    "Absent": { icon: UserX, color: "text-red-700 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700" },
    "Retard": { icon: Clock, color: "text-orange-700 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-700" },
  };

  return (
    <AnimatedPage>
      <Breadcrumb />
      <h1 className="text-2xl font-bold mb-6">Prise de Pr&eacute;sence</h1>

      {/* Step 1: Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Configuration de la s&eacute;ance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Cours</Label>
              <Select value={selectedCourseId} onValueChange={handleSelectCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="S&eacute;lectionner un cours" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.code} - {c.name}
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
              />
            </div>
            <div className="space-y-2">
              <Label>Type de s&eacute;ance</Label>
              <Select value={sessionType} onValueChange={(v) => setSessionType(v as "CM" | "TD" | "TP")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CM">CM - Cours Magistral</SelectItem>
                  <SelectItem value="TD">TD - Travaux Dirig&eacute;s</SelectItem>
                  <SelectItem value="TP">TP - Travaux Pratiques</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Student list */}
      {selectedCourseId && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                &Eacute;tudiants inscrits ({students.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => markAll("Présent")} className="text-green-700">
                  Tous pr&eacute;sents
                </Button>
                <Button size="sm" variant="outline" onClick={() => markAll("Absent")} className="text-red-700">
                  Tous absents
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {courseQuery.isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : students.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Aucun &eacute;tudiant inscrit dans ce cours
              </p>
            ) : (
              <div className="space-y-2">
                {students.map((enrollment) => {
                  const student = enrollment.student;
                  const currentStatus = attendanceMap.get(student.id);
                  return (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {student.matricule || "---"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {(Object.entries(statusConfig) as [AttendanceStatus, typeof statusConfig["Présent"]][]).map(
                          ([status, config]) => {
                            const Icon = config.icon;
                            const isActive = currentStatus === status;
                            return (
                              <Button
                                key={status}
                                size="sm"
                                variant="outline"
                                className={isActive ? `${config.bg} ${config.color} border` : ""}
                                onClick={() => setStatus(student.id, status)}
                              >
                                <Icon className="h-4 w-4 mr-1" />
                                {status}
                              </Button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  );
                })}

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="text-green-600">
                      Pr&eacute;sents : {Array.from(attendanceMap.values()).filter((s) => s === "Présent").length}
                    </span>
                    <span className="text-red-600">
                      Absents : {Array.from(attendanceMap.values()).filter((s) => s === "Absent").length}
                    </span>
                    <span className="text-orange-600">
                      Retards : {Array.from(attendanceMap.values()).filter((s) => s === "Retard").length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {saved && (
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        <Check className="h-3 w-3 mr-1" />
                        Enregistr&eacute;
                      </Badge>
                    )}
                    <Button
                      onClick={handleSave}
                      disabled={attendanceMap.size === 0 || saving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Enregistrement..." : "Enregistrer la pr&eacute;sence"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </AnimatedPage>
  );
}
