import { useList } from "@refinedev/core";
import { useState } from "react";
import { CalendarDays, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import type { Attendance, Course } from "@/types";

const statusBadge: Record<Attendance["status"], string> = {
  "Présent": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100",
  "Absent": "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100",
  "Retard": "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-100",
};

export default function AttendanceHistory() {
  const [filterCourse, setFilterCourse] = useState("all");

  const { result: coursesResult } = useList<Course>({
    resource: "courses",
    pagination: { pageSize: 100 },
  });
  const courses = coursesResult.data || [];

  const filters = filterCourse !== "all"
    ? [{ field: "courseId", operator: "eq" as const, value: filterCourse }]
    : [];

  const { result, query } = useList<Attendance>({
    resource: "attendance",
    pagination: { pageSize: 200 },
    filters,
    sorters: [{ field: "date", order: "desc" }],
  });

  const records = result.data || [];

  // Stats computation
  const presentCount = records.filter((r) => r.status === "Présent").length;
  const absentCount = records.filter((r) => r.status === "Absent").length;
  const lateCount = records.filter((r) => r.status === "Retard").length;
  const total = records.length;
  const attendanceRate = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 0;

  // Per-course stats
  const courseStats = new Map<string, { name: string; present: number; absent: number; late: number; total: number }>();
  for (const r of records) {
    if (!courseStats.has(r.courseId)) {
      courseStats.set(r.courseId, { name: r.courseName, present: 0, absent: 0, late: 0, total: 0 });
    }
    const s = courseStats.get(r.courseId)!;
    s.total++;
    if (r.status === "Présent") s.present++;
    else if (r.status === "Absent") s.absent++;
    else s.late++;
  }

  return (
    <AnimatedPage>
      <Breadcrumb />
      <h1 className="text-2xl font-bold mb-6">Historique des Pr&eacute;sences</h1>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total enregistrements</p>
            <p className="text-2xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Pr&eacute;sents</p>
            <p className="text-2xl font-bold text-green-600">{presentCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Absents</p>
            <p className="text-2xl font-bold text-red-600">{absentCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Taux de pr&eacute;sence</p>
            <p className="text-2xl font-bold">{attendanceRate}%</p>
            <Progress value={attendanceRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Per-course breakdown */}
      {courseStats.size > 1 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Statistiques par cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(courseStats.entries()).map(([courseId, stats]) => {
                const rate = stats.total > 0 ? Math.round(((stats.present + stats.late) / stats.total) * 100) : 0;
                return (
                  <div key={courseId} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{stats.name}</span>
                      <span className="text-muted-foreground">
                        {rate}% &mdash; {stats.present}P / {stats.absent}A / {stats.late}R
                      </span>
                    </div>
                    <Progress value={rate} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter */}
      <div className="flex items-center gap-3 mb-4">
        <CalendarDays className="h-5 w-5 text-muted-foreground" />
        <Select value={filterCourse} onValueChange={setFilterCourse}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filtrer par cours" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les cours</SelectItem>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.code} - {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Cours</TableHead>
                <TableHead>&Eacute;tudiant</TableHead>
                <TableHead>Matricule</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {new Date(record.date).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="font-medium">{record.courseName}</TableCell>
                  <TableCell>{record.studentName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{record.studentMatricule || "---"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`border ${statusBadge[record.status]}`}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {record.sessionType && (
                      <Badge variant="secondary">{record.sessionType}</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {query.isLoading && (
            <p className="text-center py-8 text-muted-foreground">Chargement...</p>
          )}
          {!query.isLoading && records.length === 0 && (
            <p className="text-center py-8 text-muted-foreground">
              Aucun enregistrement de pr&eacute;sence
            </p>
          )}
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
