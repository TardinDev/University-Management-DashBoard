import { useList } from "@refinedev/core";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Plus, Users } from "lucide-react";
import { useNavigate } from "react-router";
import type { Group } from "@/types";

const typeColors: Record<string, string> = {
  TD: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100",
  TP: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-100",
};

export default function GroupsList() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("all");

  const filters = selectedType !== "all"
    ? [{ field: "type", operator: "eq" as const, value: selectedType }]
    : [];

  const { result, query } = useList<Group>({
    resource: "groups",
    pagination: { pageSize: 50 },
    filters,
  });

  const groups = result.data || [];

  return (
    <AnimatedPage>
      <Breadcrumb />
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0">Groupes</h1>
        <Button onClick={() => navigate("/groups/create")}>
          <Plus className="h-4 w-4 mr-2" />Nouveau groupe
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="TD">TD</SelectItem>
            <SelectItem value="TP">TP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />Liste des groupes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Cours</TableHead>
                <TableHead>Enseignant</TableHead>
                <TableHead>Etudiants</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>
                    <Badge className={`border ${typeColors[group.type]}`}>{group.type}</Badge>
                  </TableCell>
                  <TableCell>{group.courseName}</TableCell>
                  <TableCell>{group.professorName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{group.students.length}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {groups.length === 0 && !query.isLoading && (
            <p className="text-center py-8 text-muted-foreground">Aucun groupe enregistre</p>
          )}
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
