import { useCreate, useGo } from "@refinedev/core";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ArrowLeft } from "lucide-react";

export default function RoomsCreate() {
  const go = useGo();
  const { mutate } = useCreate();

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [type, setType] = useState<"Amphi" | "Salle" | "Labo">("Salle");
  const [building, setBuilding] = useState("");
  const [equipmentText, setEquipmentText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const equipment = equipmentText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    mutate(
      {
        resource: "rooms",
        values: {
          name,
          capacity: Number(capacity),
          type,
          building,
          equipment,
          status: "Disponible",
        },
      },
      { onSuccess: () => go({ to: "/rooms" }) }
    );
  };

  return (
    <AnimatedPage>
      <Breadcrumb />
      <Button variant="ghost" className="mb-4" onClick={() => go({ to: "/rooms" })}>
        <ArrowLeft className="h-4 w-4 mr-2" />Retour
      </Button>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Nouvelle Salle</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Salle A101" required />
            </div>
            <div className="space-y-2">
              <Label>Capacite</Label>
              <Input type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="30" required />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as "Amphi" | "Salle" | "Labo")}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectionner le type" />
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
              <Input value={building} onChange={(e) => setBuilding(e.target.value)} placeholder="Batiment A" required />
            </div>
            <div className="space-y-2">
              <Label>Equipements (separes par des virgules)</Label>
              <Input value={equipmentText} onChange={(e) => setEquipmentText(e.target.value)} placeholder="Projecteur, Tableau, WiFi" />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => go({ to: "/rooms" })}>Annuler</Button>
              <Button type="submit">Creer</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
