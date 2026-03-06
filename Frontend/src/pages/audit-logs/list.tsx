import { useList } from "@refinedev/core";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Search } from "lucide-react";
import type { AuditLog } from "@/types";

const actionColors: Record<string, string> = {
  CREATE: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100",
  UPDATE: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100",
  DELETE: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100",
  LOGIN: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-100",
};

export default function AuditLogsList() {
  const [filterAction, setFilterAction] = useState("all");
  const [filterResource, setFilterResource] = useState("all");
  const [searchUser, setSearchUser] = useState("");

  const filters = [
    ...(filterAction !== "all"
      ? [{ field: "action", operator: "eq" as const, value: filterAction }]
      : []),
    ...(filterResource !== "all"
      ? [{ field: "resource", operator: "eq" as const, value: filterResource }]
      : []),
    ...(searchUser
      ? [{ field: "userName", operator: "contains" as const, value: searchUser }]
      : []),
  ];

  const { result } = useList<AuditLog>({
    resource: "audit-logs",
    pagination: { pageSize: 50 },
    filters: filters,
    sorters: [{ field: "createdAt", order: "desc" }],
  });

  const logs = result.data || [];

  // Derive unique resources from logs for the resource filter
  const uniqueResources = [...new Set(logs.map((l) => l.resource))].sort();

  return (
    <AnimatedPage>
      <Breadcrumb />
      <h1 className="page-title">Journal d'audit</h1>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par utilisateur..."
            className="pl-9 w-[220px]"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
        </div>

        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="CREATE">CREATE</SelectItem>
            <SelectItem value="UPDATE">UPDATE</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
            <SelectItem value="LOGIN">LOGIN</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterResource} onValueChange={setFilterResource}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Ressource" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {uniqueResources.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Ressource</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("fr-FR")}
                  </TableCell>
                  <TableCell className="font-medium">{log.userName}</TableCell>
                  <TableCell>
                    <Badge
                      className={`border ${actionColors[log.action] || "bg-gray-100 text-gray-800 border-gray-200"}`}
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.resource}</Badge>
                    {log.resourceId && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        #{log.resourceId}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate text-sm text-muted-foreground">
                    {log.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {logs.length === 0 && (
            <p className="text-center py-8 text-muted-foreground">
              Aucune entree dans le journal
            </p>
          )}
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
