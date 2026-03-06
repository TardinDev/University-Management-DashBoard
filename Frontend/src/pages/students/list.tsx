import { DEPARTEMENT_OPTIONS, LEVEL_OPTIONS, STUDENT_STATUS_OPTIONS } from "@/components/constants";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { CSVImportExport } from "@/components/csv-import-export";
import { MockStudents } from "@/components/constants/Mock-Data";
import type { Student } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Search, Eye, Pencil, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { AnimatedPage } from "@/components/ui/animated-page";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  "Actif": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100",
  "Inactif": "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100",
  "Diplômé": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100",
  "Suspendu": "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100",
};

const StudentsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartement, setSelectedDepartement] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filters = [
    ...(selectedDepartement !== "all" ? [{ field: "departement", operator: "eq" as const, value: selectedDepartement }] : []),
    ...(selectedLevel !== "all" ? [{ field: "level", operator: "eq" as const, value: selectedLevel }] : []),
    ...(selectedStatus !== "all" ? [{ field: "status", operator: "eq" as const, value: selectedStatus }] : []),
    ...(searchQuery ? [{ field: "lastName", operator: "contains" as const, value: searchQuery }] : []),
  ];

  const table = useTable<Student>({
    columns: useMemo<ColumnDef<Student>[]>(() => [
      {
        id: "name",
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        size: 200,
        header: () => <p className="column-title ml-2">Étudiant</p>,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {row.original.firstName[0]}{row.original.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{row.original.firstName} {row.original.lastName}</p>
              <p className="text-xs text-muted-foreground">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        id: "matricule",
        accessorKey: "matricule",
        size: 130,
        header: () => <p className="column-title">Matricule</p>,
        cell: ({ getValue }) => <Badge variant="outline">{getValue<string>()}</Badge>,
      },
      {
        id: "departement",
        accessorKey: "departement",
        size: 100,
        header: () => <p className="column-title">Département</p>,
        cell: ({ getValue }) => <Badge variant="secondary">{getValue<string>()}</Badge>,
      },
      {
        id: "level",
        accessorKey: "level",
        size: 80,
        header: () => <p className="column-title">Niveau</p>,
        cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
      },
      {
        id: "status",
        accessorKey: "status",
        size: 100,
        header: () => <p className="column-title">Statut</p>,
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return <Badge className={cn("border", statusColors[status])}>{status}</Badge>;
        },
      },
      {
        id: "actions",
        size: 120,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <ShowButton resource="students" recordItemId={row.original.id} variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </ShowButton>
            <EditButton resource="students" recordItemId={row.original.id} variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </EditButton>
            <DeleteButton resource="students" recordItemId={row.original.id} variant="ghost" size="icon">
              <Trash className="h-4 w-4" />
            </DeleteButton>
          </div>
        ),
      },
    ], []),
    refineCoreProps: {
      resource: "students",
      pagination: { pageSize: 10, mode: "server" },
      filters: { permanent: filters },
      sorters: { initial: [{ field: "id", order: "desc" }] },
    },
  });

  return (
    <AnimatedPage>
      <ListView>
        <Breadcrumb />
        <h1 className="page-title">Liste des Étudiants</h1>

        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          <div className="search-field">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un étudiant..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={selectedDepartement} onValueChange={setSelectedDepartement}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {DEPARTEMENT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {LEVEL_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {STUDENT_STATUS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <CreateButton resource="students" />
          </div>
        </div>

        <div className="flex justify-end">
          <CSVImportExport
            data={MockStudents as unknown as Record<string, unknown>[]}
            columns={[
              { key: "matricule", label: "Matricule" },
              { key: "firstName", label: "Prenom" },
              { key: "lastName", label: "Nom" },
              { key: "email", label: "Email" },
              { key: "departement", label: "Departement" },
              { key: "level", label: "Niveau" },
              { key: "status", label: "Statut" },
            ]}
            resourceName="etudiants"
          />
        </div>

        <DataTable table={table} />
      </ListView>
    </AnimatedPage>
  );
};

export default StudentsList;
