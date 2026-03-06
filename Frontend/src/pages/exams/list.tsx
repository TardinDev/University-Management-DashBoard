import { useList, useDelete, useGo } from "@refinedev/core";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Plus, Trash2 } from "lucide-react";
import type { Exam } from "@/types";

const typeColors: Record<Exam["type"], string> = {
  Partiel: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100",
  Final: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100",
  Rattrapage: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-100",
};

export default function ExamsList() {
  const go = useGo();
  const { mutate: deleteOne } = useDelete();

  const [filterType, setFilterType] = useState("all");
  const [filterSemester, setFilterSemester] = useState("all");

  const filters = [
    ...(filterType !== "all"
      ? [{ field: "type", operator: "eq" as const, value: filterType }]
      : []),
    ...(filterSemester !== "all"
      ? [{ field: "semester", operator: "eq" as const, value: filterSemester }]
      : []),
  ];

  const { result, query } = useList<Exam>({
    resource: "exams",
    pagination: { pageSize: 50 },
    filters: filters,
    sorters: [{ field: "date", order: "asc" }],
  });

  const exams = result.data || [];

  return (
    <AnimatedPage>
      <Breadcrumb />
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0">Examens</h1>
        <Button onClick={() => go({ to: "/exams/create" })}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel examen
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="Partiel">Partiel</SelectItem>
            <SelectItem value="Final">Final</SelectItem>
            <SelectItem value="Rattrapage">Rattrapage</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterSemester} onValueChange={setFilterSemester}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Semestre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="S1">S1</SelectItem>
            <SelectItem value="S2">S2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cours</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Horaire</TableHead>
                <TableHead>Salle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.courseName}</TableCell>
                  <TableCell>
                    {new Date(exam.date).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    {exam.startTime} - {exam.endTime}
                  </TableCell>
                  <TableCell>{exam.roomName}</TableCell>
                  <TableCell>
                    <Badge className={`border ${typeColors[exam.type]}`}>
                      {exam.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{exam.semester}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        deleteOne(
                          { resource: "exams", id: exam.id },
                          { onSuccess: () => query.refetch() }
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {exams.length === 0 && (
            <p className="text-center py-8 text-muted-foreground">
              Aucun examen
            </p>
          )}
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
