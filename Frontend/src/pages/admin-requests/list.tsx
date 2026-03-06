import { useList, useGetIdentity, useGo } from "@refinedev/core";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Plus, Eye, Search, FileText } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { AdminRequest, UserIdentity } from "@/types";

const statusColors: Record<string, string> = {
  "En attente":
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100",
  "En cours":
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100",
  "Approuvée":
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100",
  "Rejetée":
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100",
};

const REQUEST_TYPES = [
  "Certificat de scolarité",
  "Relevé de notes",
  "Attestation de réussite",
  "Autre",
];

const STATUS_OPTIONS: AdminRequest["status"][] = [
  "En attente",
  "En cours",
  "Approuvée",
  "Rejetée",
];

export default function AdminRequestsList() {
  const go = useGo();
  const { data: identity } = useGetIdentity<UserIdentity>();
  const isAdmin = identity?.role === "ADMIN";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filters = [
    ...(!isAdmin && identity
      ? [{ field: "studentId", operator: "eq" as const, value: identity.id }]
      : []),
    ...(selectedType !== "all"
      ? [{ field: "type", operator: "eq" as const, value: selectedType }]
      : []),
    ...(selectedStatus !== "all"
      ? [{ field: "status", operator: "eq" as const, value: selectedStatus }]
      : []),
    ...(searchQuery
      ? [
          {
            field: "studentName",
            operator: "contains" as const,
            value: searchQuery,
          },
        ]
      : []),
  ];

  const { result, query } = useList<AdminRequest>({
    resource: "admin-requests",
    pagination: { pageSize: 20 },
    filters: filters,
    sorters: [{ field: "createdAt", order: "desc" }],
  });

  const requests = result.data || [];

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <Breadcrumb />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title mb-0">Demandes Administratives</h1>
            <p className="text-muted-foreground">
              {isAdmin
                ? "Gérer toutes les demandes des étudiants"
                : "Mes demandes administratives"}
            </p>
          </div>
          {!isAdmin && (
            <Button onClick={() => go({ to: "/admin-requests/create" })}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle demande
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          {isAdmin && (
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {REQUEST_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  {isAdmin && <TableHead>Étudiant</TableHead>}
                  {isAdmin && <TableHead>Matricule</TableHead>}
                  <TableHead>Type</TableHead>
                  <TableHead>Objet</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id}>
                    {isAdmin && (
                      <TableCell className="font-medium">
                        {req.studentName}
                      </TableCell>
                    )}
                    {isAdmin && (
                      <TableCell>
                        <Badge variant="outline">{req.studentMatricule}</Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {req.type}
                      </div>
                    </TableCell>
                    <TableCell>{req.subject}</TableCell>
                    <TableCell>
                      <Badge className={cn("border", statusColors[req.status])}>
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(req.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          go({ to: `/admin-requests/show/${req.id}` })
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {requests.length === 0 && !query.isLoading && (
              <p className="text-center py-8 text-muted-foreground">
                Aucune demande trouvée
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
