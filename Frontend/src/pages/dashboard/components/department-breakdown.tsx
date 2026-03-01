import { AnimatedCard } from "@/components/ui/animated-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Props = {
  data: { departement: string; students: number; teachers: number }[];
};

export function DepartmentBreakdown({ data }: Props) {
  const maxStudents = Math.max(...data.map((d) => d.students));

  return (
    <AnimatedCard>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Répartition par Département</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((dept) => (
          <div key={dept.departement} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{dept.departement}</span>
              <span className="text-muted-foreground">
                {dept.students} étudiants &middot; {dept.teachers} enseignants
              </span>
            </div>
            <Progress value={(dept.students / maxStudents) * 100} className="h-2" />
          </div>
        ))}
      </CardContent>
    </AnimatedCard>
  );
}
