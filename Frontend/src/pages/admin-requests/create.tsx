import { useCreate, useGetIdentity, useGo } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";
import type { UserIdentity } from "@/types";

const REQUEST_TYPES = [
  "Certificat de scolarité",
  "Relevé de notes",
  "Attestation de réussite",
  "Autre",
];

export default function AdminRequestCreate() {
  const go = useGo();
  const { data: identity } = useGetIdentity<UserIdentity>();
  const { mutate: create } = useCreate();
  const [isLoading, setIsLoading] = useState(false);

  const [type, setType] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity || !type || !subject) return;

    create(
      {
        resource: "admin-requests",
        values: {
          studentId: identity.id,
          studentName: identity.fullName,
          studentMatricule: identity.id,
          type,
          subject,
          description,
          status: "En attente",
        },
      },
      {
        onSuccess: () => {
          go({ to: "/admin-requests" });
        },
      }
    );
  };

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <Breadcrumb />
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => go({ to: "/admin-requests" })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="page-title mb-0">Nouvelle Demande</h1>
            <p className="text-muted-foreground">
              Soumettre une demande administrative
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Informations de la demande
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Demandeur</Label>
                  <Input
                    value={identity?.fullName || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Matricule</Label>
                  <Input
                    value={identity?.id || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Type de demande <span className="text-destructive">*</span>
                </Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type de demande" />
                  </SelectTrigger>
                  <SelectContent>
                    {REQUEST_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">
                  Objet <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Objet de la demande"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez votre demande en détail..."
                  rows={5}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => go({ to: "/admin-requests" })}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isLoading || !type || !subject}>
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading ? "Envoi..." : "Soumettre la demande"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}
