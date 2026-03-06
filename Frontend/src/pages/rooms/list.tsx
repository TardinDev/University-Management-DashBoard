import { useList, useDelete } from "@refinedev/core";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Plus, Pencil, Trash2, DoorOpen } from "lucide-react";
import { useNavigate } from "react-router";
import type { Room } from "@/types";

const typeColors: Record<string, string> = {
  Amphi: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-100",
  Salle: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100",
  Labo: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100",
};

const statusColors: Record<string, string> = {
  "Disponible": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100",
  "Occupée": "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100",
  "Maintenance": "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100",
};

export default function RoomsList() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filters = [
    ...(selectedType !== "all" ? [{ field: "type", operator: "eq" as const, value: selectedType }] : []),
    ...(selectedStatus !== "all" ? [{ field: "status", operator: "eq" as const, value: selectedStatus }] : []),
  ];

  const { result, query } = useList<Room>({
    resource: "rooms",
    pagination: { pageSize: 50 },
    filters,
  });
  const { mutate: deleteOne } = useDelete();

  const rooms = result.data || [];

  return (
    <AnimatedPage>
      <Breadcrumb />
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0">Salles</h1>
        <Button onClick={() => navigate("/rooms/create")}>
          <Plus className="h-4 w-4 mr-2" />Nouvelle salle
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="Amphi">Amphi</SelectItem>
            <SelectItem value="Salle">Salle</SelectItem>
            <SelectItem value="Labo">Labo</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="Disponible">Disponible</SelectItem>
            <SelectItem value="Occupée">Occupee</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DoorOpen className="h-4 w-4" />Liste des salles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Capacite</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Batiment</TableHead>
                <TableHead>Equipements</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.capacity} places</TableCell>
                  <TableCell>
                    <Badge className={`border ${typeColors[room.type]}`}>{room.type}</Badge>
                  </TableCell>
                  <TableCell>{room.building}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {room.equipment.map((eq) => (
                        <Badge key={eq} variant="outline" className="text-xs">{eq}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`border ${statusColors[room.status]}`}>{room.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/rooms/edit/${room.id}`)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          deleteOne(
                            { resource: "rooms", id: room.id },
                            { onSuccess: () => query.refetch() }
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {rooms.length === 0 && !query.isLoading && (
            <p className="text-center py-8 text-muted-foreground">Aucune salle enregistree</p>
          )}
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
