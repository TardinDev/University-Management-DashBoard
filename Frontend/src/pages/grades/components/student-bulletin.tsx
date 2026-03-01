import type { Grade, Student } from "@/types";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  student: Student;
  grades: Grade[];
};

export function StudentBulletin({ student, grades }: Props) {
  if (grades.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Aucune note trouvée pour cet étudiant</p>;
  }

  const totalWeighted = grades.reduce((sum, g) => sum + g.note * g.coefficient, 0);
  const totalCoeff = grades.reduce((sum, g) => sum + g.coefficient, 0);
  const avg = totalCoeff > 0 ? totalWeighted / totalCoeff : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Bulletin de {student.firstName} {student.lastName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{student.matricule}</Badge>
            <Badge variant="secondary">{student.level} - {student.departement}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Matière</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Coeff.</TableHead>
              <TableHead>Pondérée</TableHead>
              <TableHead>Session</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.map((grade) => (
              <TableRow key={grade.id}>
                <TableCell className="font-medium">{grade.subjectName}</TableCell>
                <TableCell><Badge variant="outline">{grade.subjectCode}</Badge></TableCell>
                <TableCell>
                  <span className={cn("font-bold", grade.note >= 10 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                    {grade.note}/20
                  </span>
                </TableCell>
                <TableCell>{grade.coefficient}</TableCell>
                <TableCell>{(grade.note * grade.coefficient).toFixed(1)}</TableCell>
                <TableCell><Badge variant="secondary">{grade.session}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} className="font-bold">Moyenne Générale</TableCell>
              <TableCell colSpan={1}>
                <span className={cn("font-bold text-lg", avg >= 10 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                  {avg.toFixed(2)}/20
                </span>
              </TableCell>
              <TableCell>{totalCoeff}</TableCell>
              <TableCell>{totalWeighted.toFixed(1)}</TableCell>
              <TableCell>
                <Badge variant={avg >= 10 ? "default" : "destructive"}>
                  {avg >= 10 ? "Admis" : "Ajourné"}
                </Badge>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
