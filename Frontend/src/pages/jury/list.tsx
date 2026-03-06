import { useList, useGo } from "@refinedev/core";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Eye, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JuryDeliberation } from "@/types";

const statusColors: Record<string, string> = {
  "Planifié":
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100",
  "En cours":
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100",
  "Terminé":
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100",
};

export default function JuryList() {
  const go = useGo();

  const { result, query } = useList<JuryDeliberation>({
    resource: "jury-deliberations",
    pagination: { pageSize: 20 },
    sorters: [{ field: "date", order: "desc" }],
  });

  const deliberations = result.data || [];

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <Breadcrumb />
        <div>
          <h1 className="page-title mb-0 flex items-center gap-2">
            <Scale className="h-6 w-6" />
            Délibérations du Jury
          </h1>
          <p className="text-muted-foreground">
            Liste des sessions de délibération
          </p>
        </div>

        <Card>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Année académique</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Étudiants</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliberations.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">
                      {d.academicYearName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{d.departmentName}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{d.level}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(d.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("border", statusColors[d.status])}>
                        {d.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{d.decisions?.length || 0}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => go({ to: `/jury/show/${d.id}` })}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {deliberations.length === 0 && !query.isLoading && (
              <p className="text-center py-8 text-muted-foreground">
                Aucune délibération trouvée
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
