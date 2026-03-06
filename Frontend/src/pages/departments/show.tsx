import { useOne, useList } from "@refinedev/core";
import { useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ArrowLeft, Building2, GraduationCap, Users } from "lucide-react";
import { useNavigate } from "react-router";
import type { Department, Program, Student } from "@/types";

export default function DepartmentsShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { result: department, query: deptQuery } = useOne<Department>({
    resource: "departments",
    id: id!,
  });
  const { result: progResult } = useList<Program>({
    resource: "programs",
    pagination: { pageSize: 100 },
    filters: [{ field: "departmentId", operator: "eq", value: Number(id) }],
  });
  const { result: studentResult } = useList<Student>({
    resource: "students",
    pagination: { pageSize: 1 },
    filters: [{ field: "departement", operator: "eq", value: department?.name || "" }],
  });

  const programs = progResult.data || [];
  const studentCount = studentResult.total || 0;

  if (deptQuery.isLoading) {
    return <AnimatedPage><div className="animate-pulse h-64 bg-muted rounded" /></AnimatedPage>;
  }

  if (!department) return null;

  return (
    <AnimatedPage>
      <Breadcrumb />
      <Button variant="ghost" className="mb-4" onClick={() => navigate("/departments")}>
        <ArrowLeft className="h-4 w-4 mr-2" />Retour
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Departement</p>
              <p className="text-lg font-bold">{department.code}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <GraduationCap className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Programmes</p>
              <p className="text-lg font-bold">{programs.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Etudiants</p>
              <p className="text-lg font-bold">{studentCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Informations du departement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nom</p>
              <p className="font-semibold">{department.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Code</p>
              <Badge variant="outline">{department.code}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Responsable</p>
              <p className="font-medium">{department.headName || "Non assigne"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Description</p>
              <p>{department.description || "Aucune description"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Programmes ({programs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {programs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((prog) => (
                  <TableRow key={prog.id}>
                    <TableCell><Badge>{prog.code}</Badge></TableCell>
                    <TableCell className="font-medium">{prog.name}</TableCell>
                    <TableCell><Badge variant="secondary">{prog.level}</Badge></TableCell>
                    <TableCell className="text-muted-foreground max-w-[300px] truncate">{prog.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-8 text-muted-foreground">Aucun programme dans ce departement</p>
          )}
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
