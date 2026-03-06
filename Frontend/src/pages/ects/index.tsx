import { useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Search, GraduationCap, Award } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { ECTSRecord } from "@/types";

type StudentSummary = {
  studentId: number;
  studentName: string;
  totalCredits: number;
  validatedCredits: number;
  percentage: number;
  records: ECTSRecord[];
};

export default function ECTSPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  const filters = [
    ...(selectedSemester !== "all"
      ? [
          {
            field: "semester",
            operator: "eq" as const,
            value: selectedSemester,
          },
        ]
      : []),
    ...(selectedYear !== "all"
      ? [
          {
            field: "academicYear",
            operator: "eq" as const,
            value: selectedYear,
          },
        ]
      : []),
  ];

  const { result, query } = useList<ECTSRecord>({
    resource: "ects-records",
    pagination: { pageSize: 500 },
    filters: filters,
  });

  const records = result.data || [];

  const academicYears = useMemo(() => {
    const years = new Set(records.map((r) => r.academicYear));
    return Array.from(years).sort();
  }, [records]);

  const studentSummaries = useMemo(() => {
    const map = new Map<number, StudentSummary>();

    for (const record of records) {
      if (!map.has(record.studentId)) {
        map.set(record.studentId, {
          studentId: record.studentId,
          studentName: "",
          totalCredits: 0,
          validatedCredits: 0,
          percentage: 0,
          records: [],
        });
      }
      const summary = map.get(record.studentId)!;
      summary.records.push(record);
      summary.totalCredits += record.credits;
      if (record.validated) {
        summary.validatedCredits += record.credits;
      }
    }

    for (const summary of map.values()) {
      summary.percentage =
        summary.totalCredits > 0
          ? Math.round((summary.validatedCredits / summary.totalCredits) * 100)
          : 0;
      const firstRecord = summary.records[0];
      if (firstRecord) {
        summary.studentName = `Étudiant #${firstRecord.studentId}`;
      }
    }

    return Array.from(map.values());
  }, [records]);

  const filteredSummaries = useMemo(() => {
    if (!searchQuery.trim()) return studentSummaries;
    const q = searchQuery.toLowerCase();
    return studentSummaries.filter(
      (s) =>
        s.studentName.toLowerCase().includes(q) ||
        String(s.studentId).includes(q)
    );
  }, [studentSummaries, searchQuery]);

  const totalAllCredits = filteredSummaries.reduce(
    (sum, s) => sum + s.totalCredits,
    0
  );
  const totalValidated = filteredSummaries.reduce(
    (sum, s) => sum + s.validatedCredits,
    0
  );
  const globalPercentage =
    totalAllCredits > 0
      ? Math.round((totalValidated / totalAllCredits) * 100)
      : 0;

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <Breadcrumb />
        <div>
          <h1 className="page-title mb-0 flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Suivi des Crédits ECTS
          </h1>
          <p className="text-muted-foreground">
            Progression des crédits par étudiant
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <Award className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredSummaries.length}
                </p>
                <p className="text-xs text-muted-foreground">Étudiants</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground mb-1">
                Crédits validés (global)
              </p>
              <p className="text-2xl font-bold">
                {totalValidated}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  / {totalAllCredits}
                </span>
              </p>
              <Progress value={globalPercentage} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground mb-1">
                Taux de validation global
              </p>
              <p className="text-2xl font-bold">{globalPercentage}%</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un étudiant..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              value={selectedSemester}
              onValueChange={setSelectedSemester}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Semestre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les semestres</SelectItem>
                <SelectItem value="S1">S1</SelectItem>
                <SelectItem value="S2">S2</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Année académique" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les années</SelectItem>
                {academicYears.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Progression par étudiant ({filteredSummaries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Crédits validés</TableHead>
                  <TableHead>Total crédits</TableHead>
                  <TableHead className="w-[200px]">Progression</TableHead>
                  <TableHead>Pourcentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSummaries.map((s) => (
                  <TableRow key={s.studentId}>
                    <TableCell className="font-medium">
                      {s.studentName}
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {s.validatedCredits}
                      </span>
                    </TableCell>
                    <TableCell>{s.totalCredits}</TableCell>
                    <TableCell>
                      <Progress value={s.percentage} className="h-3" />
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "border",
                          s.percentage >= 75
                            ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100"
                            : s.percentage >= 50
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100"
                              : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100"
                        )}
                      >
                        {s.percentage}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredSummaries.length === 0 && !query.isLoading && (
              <p className="text-center py-8 text-muted-foreground">
                Aucun enregistrement ECTS trouvé
              </p>
            )}
            {query.isLoading && (
              <p className="text-center py-8 text-muted-foreground">
                Chargement...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}
