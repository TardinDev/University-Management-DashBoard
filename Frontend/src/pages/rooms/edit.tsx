import { useOne, useUpdate, useGo } from "@refinedev/core";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ArrowLeft } from "lucide-react";
import type { Room } from "@/types";

export default function RoomsEdit() {
  const { id } = useParams();
  const go = useGo();
  const { result, query } = useOne<Room>({ resource: "rooms", id: id! });
  const { mutate } = useUpdate();

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [type, setType] = useState<"Amphi" | "Salle" | "Labo">("Salle");
  const [building, setBuilding] = useState("");
  const [equipmentText, setEquipmentText] = useState("");
  const [status, setStatus] = useState<"Disponible" | "Occupée" | "Maintenance">("Disponible");

  useEffect(() => {
    if (result) {
      setName(result.name);
      setCapacity(String(result.capacity));
      setType(result.type);
      setBuilding(result.building);
      setEquipmentText(result.equipment.join(", "));
      setStatus(result.status);
    }
  }, [result]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const equipment = equipmentText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    mutate(
      {
        resource: "rooms",
        id: id!,
        values: {
          name,
          capacity: Number(capacity),
          type,
          building,
          equipment,
          status,
        },
      },
      { onSuccess: () => go({ to: "/rooms" }) }
    );
  };

  if (query.isLoading) {
    return <AnimatedPage><div className="animate-pulse h-64 bg-muted rounded" /></AnimatedPage>;
  }

  return (
    <AnimatedPage>
      <Breadcrumb />
      <Button variant="ghost" className="mb-4" onClick={() => go({ to: "/rooms" })}>
        <ArrowLeft className="h-4 w-4 mr-2" />Retour
      </Button>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Modifier la Salle</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Capacite</Label>
              <Input type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as "Amphi" | "Salle" | "Labo")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Amphi">Amphi</SelectItem>
                  <SelectItem value="Salle">Salle</SelectItem>
                  <SelectItem value="Labo">Labo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Batiment</Label>
              <Input value={building} onChange={(e) => setBuilding(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Equipements (separes par des virgules)</Label>
              <Input value={equipmentText} onChange={(e) => setEquipmentText(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as "Disponible" | "Occupée" | "Maintenance")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="Occupée">Occupee</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => go({ to: "/rooms" })}>Annuler</Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
