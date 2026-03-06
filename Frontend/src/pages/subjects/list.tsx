import { DEPARTEMENT_OPTIONS } from "@/components/constants";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import type { Subject } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Search, Eye, Pencil, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { AnimatedPage } from "@/components/ui/animated-page";

const SubjectsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartement, setSelectedDepartement] = useState("all");

  const departementFilters = selectedDepartement === "all" ? [] : [
    { field: "departement", operator: "eq" as const, value: selectedDepartement }
  ];
  const searchFilters = searchQuery ? [
    { field: "name", operator: "contains" as const, value: searchQuery }
  ] : [];

  const subjectTable = useTable<Subject>({
    columns: useMemo<ColumnDef<Subject>[]>(() => [
      {
        id: "code",
        accessorKey: "code",
        size: 100,
        header: () => <p className="column-title ml-2">Code</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
      },
      {
        id: "name",
        accessorKey: "name",
        size: 200,
        header: () => <p className="column-title ml-2">Nom</p>,
        cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
        filterFn: "includesString",
      },
      {
        id: "departement",
        accessorKey: "departement",
        size: 120,
        header: () => <p className="column-title">Département</p>,
        cell: ({ getValue }) => <Badge variant="secondary">{getValue<string>()}</Badge>,
      },
      {
        id: "description",
        accessorKey: "description",
        size: 300,
        header: () => <p className="column-title">Description</p>,
        cell: ({ getValue }) => <span className="truncate line-clamp-2 text-muted-foreground">{getValue<string>()}</span>,
      },
      {
        id: "actions",
        size: 120,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <ShowButton resource="subjects" recordItemId={row.original.id} variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </ShowButton>
            <EditButton resource="subjects" recordItemId={row.original.id} variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </EditButton>
            <DeleteButton resource="subjects" recordItemId={row.original.id} variant="ghost" size="icon">
              <Trash className="h-4 w-4" />
            </DeleteButton>
          </div>
        ),
      },
    ], []),
    refineCoreProps: {
      resource: "subjects",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: [...departementFilters, ...searchFilters],
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
    },
  });

  return (
    <AnimatedPage>
      <ListView>
        <Breadcrumb />
        <h1 className="page-title">Liste des Matières</h1>

        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          <div className="search-field">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher une matière..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedDepartement} onValueChange={setSelectedDepartement}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                {DEPARTEMENT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CreateButton resource="subjects" />
          </div>
        </div>

        <DataTable table={subjectTable} />
      </ListView>
    </AnimatedPage>
  );
};

export default SubjectsList;
