import { useOne, useUpdate, useGetIdentity, useGo } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { AITextHelper } from "@/components/ai-text-helper";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import {
  ArrowLeft,
  User,
  FileText,
  Calendar,
  MessageSquare,
  Save,
} from "lucide-react";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
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

const STATUS_OPTIONS: AdminRequest["status"][] = [
  "En attente",
  "En cours",
  "Approuvée",
  "Rejetée",
];

export default function AdminRequestShow() {
  const { id } = useParams();
  const go = useGo();
  const { data: identity } = useGetIdentity<UserIdentity>();
  const isAdmin = identity?.role === "ADMIN";

  const { result, query } = useOne<AdminRequest>({
    resource: "admin-requests",
    id: id as string,
  });

  const record = result;

  const [responseText, setResponseText] = useState("");
  const [newStatus, setNewStatus] = useState<AdminRequest["status"]>(
    "En attente"
  );

  useEffect(() => {
    if (record) {
      setResponseText(record.response || "");
      setNewStatus(record.status);
    }
  }, [record]);

  const { mutate: update } = useUpdate();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = () => {
    if (!record) return;
    update(
      {
        resource: "admin-requests",
        id: record.id,
        values: {
          status: newStatus,
          response: responseText,
        },
      },
      {
        onSuccess: () => {
          query.refetch();
        },
      }
    );
  };

  if (query.isLoading) {
    return (
      <AnimatedPage>
        <p className="text-center py-12 text-muted-foreground">Chargement...</p>
      </AnimatedPage>
    );
  }

  if (!record) {
    return (
      <AnimatedPage>
        <p className="text-center py-12 text-muted-foreground">
          Demande introuvable
        </p>
      </AnimatedPage>
    );
  }

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
          <div className="flex-1">
            <h1 className="page-title mb-0">Demande #{record.id}</h1>
            <p className="text-muted-foreground">{record.type}</p>
          </div>
          <Badge className={cn("border text-sm", statusColors[record.status])}>
            {record.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Détails de la demande
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium">{record.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Objet</Label>
                  <p className="font-medium">{record.subject}</p>
                </div>
                <Separator />
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1 whitespace-pre-wrap">
                    {record.description || "Aucune description fournie"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {isAdmin ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Réponse administrative
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Statut de la demande</Label>
                    <Select
                      value={newStatus}
                      onValueChange={(v) =>
                        setNewStatus(v as AdminRequest["status"])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="response">Réponse</Label>
                    <AITextHelper
                      id="response"
                      value={responseText}
                      onValueChange={setResponseText}
                      context="admin-response"
                      placeholder="Rédigez votre réponse..."
                      rows={5}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isUpdating}>
                      <Save className="h-4 w-4 mr-2" />
                      {isUpdating ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              record.response && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Réponse de l'administration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{record.response}</p>
                  </CardContent>
                </Card>
              )
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Informations étudiant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-muted-foreground">Nom</Label>
                  <p className="font-medium">{record.studentName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Matricule</Label>
                  <Badge variant="outline">{record.studentMatricule}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-muted-foreground">Créée le</Label>
                  <p className="font-medium">
                    {new Date(record.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Dernière mise à jour
                  </Label>
                  <p className="font-medium">
                    {new Date(record.updatedAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
