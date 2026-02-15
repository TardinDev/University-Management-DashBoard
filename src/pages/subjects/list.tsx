import { DEPARTEMENT_OPTIONS } from "@/components/constants";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Subject } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

const SubjectsList = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartement, setSelectedDepartement] = useState('all');

    const subjectTable = useTable<Subject>({
        columns: useMemo<ColumnDef<Subject>[]>(() => [
            {
                id: 'code',
                accessorKey: 'code',
                size: 100,
                header: ({ }) => <p className="column-title ml-2">Code</p>,
                cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>

            },
            {
                id: 'name',
                accessorKey: 'name',
                size: 200,
                header: ({ }) => <p className="column-title ml-2">Name</p>,
                cell: ({ getValue }) => <span className="text-forground">{getValue<string>()}</span>,
                filterFn: 'includesString',
            },
            {
                id: 'departement',
                accessorKey: 'departement',
                size: 150,
                header: ({ }) => <p className="column-title">Departement</p>,
                cell: ({ getValue }) => <Badge
                    variant="secondary">{getValue<string>()}</Badge>,
                filterFn: 'includesString',
            },
            {
                id: 'description',
                accessorKey: 'description',
                size: 300,
                header: ({ }) => <p className="column-title">Description</p>,
                cell: ({ getValue }) => <span className="truncate line-clamp-2">{getValue<string>()}</span>,
                filterFn: 'includesString',
            },
        ], []),
        refineCoreProps: {
            resource: "subjects",
            pagination: { pageSize: 10, mode: 'server' },
            filters: {
                permanent: []
            },
            sorters: {},

        }
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Subjects List</h1>

            <div className="intro-row">
                <p>Quick acces to essential metrics and management tools</p>
                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />
                        <input type="text"
                            placeholder="Search by name..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={selectedDepartement}
                            onValueChange={setSelectedDepartement}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by departement" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departements</SelectItem>
                                {DEPARTEMENT_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <CreateButton />
                    </div>
                </div>
            </div>

            <DataTable table={subjectTable} />
        </ListView>
    );
};

export default SubjectsList;