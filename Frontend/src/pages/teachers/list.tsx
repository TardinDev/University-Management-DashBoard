import { DEPARTEMENT_OPTIONS, TEACHER_GRADE_OPTIONS, TEACHER_STATUS_OPTIONS } from "@/components/constants";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import type { Teacher } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AnimatedPage } from "@/components/ui/animated-page";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  "Actif": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100",
  "En congé": "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100",
  "Retraité": "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100",
};

const TeachersList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartement, setSelectedDepartement] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filters = [
    ...(selectedDepartement !== "all" ? [{ field: "departement", operator: "eq" as const, value: selectedDepartement }] : []),
    ...(selectedGrade !== "all" ? [{ field: "grade", operator: "eq" as const, value: selectedGrade }] : []),
    ...(selectedStatus !== "all" ? [{ field: "status", operator: "eq" as const, value: selectedStatus }] : []),
    ...(searchQuery ? [{ field: "lastName", operator: "contains" as const, value: searchQuery }] : []),
  ];

  const table = useTable<Teacher>({
    columns: useMemo<ColumnDef<Teacher>[]>(() => [
      {
        id: "name",
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        size: 200,
        header: () => <p className="column-title ml-2">Enseignant</p>,
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
        size: 100,
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
        id: "grade",
        accessorKey: "grade",
        size: 150,
        header: () => <p className="column-title">Grade</p>,
        cell: ({ getValue }) => <span className="text-sm">{getValue<string>()}</span>,
      },
      {
        id: "specialization",
        accessorKey: "specialization",
        size: 150,
        header: () => <p className="column-title">Spécialisation</p>,
        cell: ({ getValue }) => <span className="text-sm text-muted-foreground">{getValue<string>()}</span>,
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
            <ShowButton resource="teachers" recordItemId={row.original.id} variant="ghost" size="icon">
              <span className="sr-only">Voir</span>
            </ShowButton>
            <EditButton resource="teachers" recordItemId={row.original.id} variant="ghost" size="icon">
              <span className="sr-only">Modifier</span>
            </EditButton>
            <DeleteButton resource="teachers" recordItemId={row.original.id} variant="ghost" size="icon">
              <span className="sr-only">Supprimer</span>
            </DeleteButton>
          </div>
        ),
      },
    ], []),
    refineCoreProps: {
      resource: "teachers",
      pagination: { pageSize: 10, mode: "server" },
      filters: { permanent: filters },
      sorters: { initial: [{ field: "id", order: "desc" }] },
    },
  });

  return (
    <AnimatedPage>
      <ListView>
        <Breadcrumb />
        <h1 className="page-title">Liste des Enseignants</h1>

        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          <div className="search-field">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un enseignant..."
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

            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {TEACHER_GRADE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {TEACHER_STATUS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <CreateButton resource="teachers" />
          </div>
        </div>

        <DataTable table={table} />
      </ListView>
    </AnimatedPage>
  );
};

export default TeachersList;
