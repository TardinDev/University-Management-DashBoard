import { useCreate, useGo } from "@refinedev/core";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatedPage } from "@/components/ui/animated-page";
import { ArrowLeft } from "lucide-react";

export default function AcademicYearsCreate() {
  const go = useGo();
  const { mutate } = useCreate();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { resource: "academic-years", values: { name, startDate, endDate, isCurrent } },
      { onSuccess: () => go({ to: "/academic-years" }) }
    );
  };

  return (
    <AnimatedPage>
      <Button variant="ghost" className="mb-4" onClick={() => go({ to: "/academic-years" })}><ArrowLeft className="h-4 w-4 mr-2" />Retour</Button>
      <Card className="max-w-lg">
        <CardHeader><CardTitle>Nouvelle Annee Academique</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label>Nom</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="2025-2026" required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Date debut</Label><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required /></div>
              <div className="space-y-2"><Label>Date fin</Label><Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required /></div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="isCurrent" checked={isCurrent} onCheckedChange={(v) => setIsCurrent(!!v)} />
              <Label htmlFor="isCurrent">Annee en cours</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => go({ to: "/academic-years" })}>Annuler</Button>
              <Button type="submit">Creer</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
