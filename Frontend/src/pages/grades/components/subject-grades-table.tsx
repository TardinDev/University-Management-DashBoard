import type { Grade } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  grades: Grade[];
};

export function SubjectGradesTable({ grades }: Props) {
  if (grades.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Aucune note pour cette matière</p>;
  }

  const avg = grades.reduce((sum, g) => sum + g.note, 0) / grades.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">Moyenne de la matière :</span>
        <span className={cn("font-bold text-lg", avg >= 10 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
          {avg.toFixed(2)}/20
        </span>
        <span className="text-muted-foreground">({grades.length} notes)</span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Étudiant</TableHead>
            <TableHead>Matricule</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Session</TableHead>
            <TableHead>Année</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grades.map((grade) => (
            <TableRow key={grade.id}>
              <TableCell className="font-medium">{grade.studentName}</TableCell>
              <TableCell><Badge variant="outline">{grade.studentMatricule}</Badge></TableCell>
              <TableCell>
                <span className={cn("font-bold", grade.note >= 10 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                  {grade.note}/20
                </span>
              </TableCell>
              <TableCell><Badge variant="secondary">{grade.session}</Badge></TableCell>
              <TableCell>{grade.academicYear}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
