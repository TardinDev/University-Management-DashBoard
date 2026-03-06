import { useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Plus, Eye, Building2, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router";
import type { Department, Program } from "@/types";

export default function DepartmentsList() {
  const navigate = useNavigate();
  const { result: deptResult, query: deptQuery } = useList<Department>({
    resource: "departments",
    pagination: { pageSize: 50 },
  });
  const { result: progResult } = useList<Program>({
    resource: "programs",
    pagination: { pageSize: 100 },
  });

  const departments = deptResult.data || [];
  const programs = progResult.data || [];

  const programsByDept = programs.reduce<Record<number, Program[]>>((acc, p) => {
    (acc[p.departmentId] ||= []).push(p);
    return acc;
  }, {});

  return (
    <AnimatedPage>
      <Breadcrumb />
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0">Departements</h1>
        <Button onClick={() => navigate("/departments/create")}>
          <Plus className="h-4 w-4 mr-2" />Nouveau departement
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4" />Liste des departements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Programmes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell><Badge variant="outline">{dept.code}</Badge></TableCell>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">{dept.description}</TableCell>
                  <TableCell>{dept.headName || <span className="text-muted-foreground">Non assigne</span>}</TableCell>
                  <TableCell><Badge variant="secondary">{(programsByDept[dept.id] || []).length}</Badge></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/departments/show/${dept.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {departments.length === 0 && !deptQuery.isLoading && (
            <p className="text-center py-8 text-muted-foreground">Aucun departement enregistre</p>
          )}
        </CardContent>
      </Card>

      {departments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />Programmes par departement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {departments.map((dept) => {
              const deptPrograms = programsByDept[dept.id] || [];
              if (deptPrograms.length === 0) return null;
              return (
                <div key={dept.id}>
                  <h3 className="font-semibold mb-2">{dept.name} ({dept.code})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {deptPrograms.map((prog) => (
                      <Card key={prog.id} className="border">
                        <CardContent className="pt-4 pb-3">
                          <div className="flex items-center justify-between mb-1">
                            <Badge>{prog.code}</Badge>
                            <Badge variant="secondary">{prog.level}</Badge>
                          </div>
                          <p className="font-medium text-sm mt-2">{prog.name}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{prog.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
            {programs.length === 0 && (
              <p className="text-center py-4 text-muted-foreground">Aucun programme enregistre</p>
            )}
          </CardContent>
        </Card>
      )}
    </AnimatedPage>
  );
}
