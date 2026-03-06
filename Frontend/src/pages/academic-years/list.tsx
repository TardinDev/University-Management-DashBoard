import { useList, useDelete } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import type { AcademicYear } from "@/types";

export default function AcademicYearsList() {
  const navigate = useNavigate();
  const { result, query } = useList<AcademicYear>({ resource: "academic-years", pagination: { pageSize: 50 } });
  const { mutate: deleteOne } = useDelete();
  const years = result.data || [];

  return (
    <AnimatedPage>
      <Breadcrumb />
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0">Annees Academiques</h1>
        <Button onClick={() => navigate("/academic-years/create")}><Plus className="h-4 w-4 mr-2" />Nouvelle annee</Button>
      </div>
      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Date debut</TableHead>
                <TableHead>Date fin</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {years.map((y) => (
                <TableRow key={y.id}>
                  <TableCell className="font-medium">{y.name}</TableCell>
                  <TableCell>{new Date(y.startDate).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>{new Date(y.endDate).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>{y.isCurrent ? <Badge>En cours</Badge> : <Badge variant="secondary">Terminee</Badge>}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/academic-years/edit/${y.id}`)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteOne({ resource: "academic-years", id: y.id }, { onSuccess: () => query.refetch() })}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {years.length === 0 && <p className="text-center py-8 text-muted-foreground">Aucune annee academique</p>}
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
