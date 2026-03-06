import { useCreate, useGo, useList } from "@refinedev/core";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ArrowLeft } from "lucide-react";
import type { Teacher } from "@/types";

export default function DepartmentsCreate() {
  const go = useGo();
  const { mutate } = useCreate();
  const { result: teachersResult } = useList<Teacher>({
    resource: "teachers",
    pagination: { pageSize: 200 },
    filters: [{ field: "status", operator: "eq", value: "Actif" }],
  });

  const teachers = teachersResult.data || [];

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [headId, setHeadId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      {
        resource: "departments",
        values: {
          name,
          code,
          description,
          ...(headId ? { headId: Number(headId) } : {}),
        },
      },
      { onSuccess: () => go({ to: "/departments" }) }
    );
  };

  return (
    <AnimatedPage>
      <Breadcrumb />
      <Button variant="ghost" className="mb-4" onClick={() => go({ to: "/departments" })}>
        <ArrowLeft className="h-4 w-4 mr-2" />Retour
      </Button>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Nouveau Departement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Informatique" required />
            </div>
            <div className="space-y-2">
              <Label>Code</Label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="INFO" required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description du departement" rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Responsable</Label>
              <Select value={headId} onValueChange={setHeadId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectionner un enseignant" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.firstName} {t.lastName} - {t.grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => go({ to: "/departments" })}>Annuler</Button>
              <Button type="submit">Creer</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
