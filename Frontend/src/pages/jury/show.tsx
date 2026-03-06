import { useOne, useUpdate, useGo } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  ArrowLeft,
  Save,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Ban,
} from "lucide-react";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { JuryDeliberation, JuryDecision } from "@/types";

const statusColors: Record<string, string> = {
  "Planifié":
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100",
  "En cours":
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100",
  "Terminé":
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100",
};

const decisionColors: Record<string, string> = {
  Admis:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100",
  "Ajourné":
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100",
  Redoublant:
    "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-100",
  Exclu:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100",
};

const DECISION_OPTIONS: JuryDecision["decision"][] = [
  "Admis",
  "Ajourné",
  "Redoublant",
  "Exclu",
];

export default function JuryShow() {
  const { id } = useParams();
  const go = useGo();

  const { result, query } = useOne<JuryDeliberation>({
    resource: "jury-deliberations",
    id: id as string,
  });

  const record = result;

  const [decisions, setDecisions] = useState<JuryDecision[]>([]);

  useEffect(() => {
    if (record?.decisions) {
      setDecisions([...record.decisions]);
    }
  }, [record]);

  const { mutate: update } = useUpdate();
  const [isUpdating, setIsUpdating] = useState(false);

  const canEdit = record && record.status !== "Terminé";

  const handleDecisionChange = (
    studentId: number,
    newDecision: JuryDecision["decision"]
  ) => {
    setDecisions((prev) =>
      prev.map((d) =>
        d.studentId === studentId ? { ...d, decision: newDecision } : d
      )
    );
  };

  const handleSave = () => {
    if (!record) return;
    update(
      {
        resource: "jury-deliberations",
        id: record.id,
        values: { decisions },
      },
      {
        onSuccess: () => {
          query.refetch();
        },
      }
    );
  };

  const admisCount = decisions.filter((d) => d.decision === "Admis").length;
  const ajourneCount = decisions.filter((d) => d.decision === "Ajourné").length;
  const redoublantCount = decisions.filter(
    (d) => d.decision === "Redoublant"
  ).length;
  const excluCount = decisions.filter((d) => d.decision === "Exclu").length;

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
          Délibération introuvable
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
            onClick={() => go({ to: "/jury" })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="page-title mb-0">
              Délibération - {record.departmentName} {record.level}
            </h1>
            <p className="text-muted-foreground">
              {record.academicYearName} &mdash;{" "}
              {new Date(record.date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <Badge className={cn("border text-sm", statusColors[record.status])}>
            {record.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <Users className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{decisions.length}</p>
                <p className="text-xs text-muted-foreground">Total étudiants</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {admisCount}
                </p>
                <p className="text-xs text-muted-foreground">Admis</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {ajourneCount}
                </p>
                <p className="text-xs text-muted-foreground">Ajournés</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <Ban className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {redoublantCount + excluCount}
                </p>
                <p className="text-xs text-muted-foreground">
                  Redoublants / Exclus
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              Décisions ({decisions.length} étudiants)
            </CardTitle>
            {canEdit && (
              <Button onClick={handleSave} disabled={isUpdating} size="sm">
                <Save className="h-4 w-4 mr-2" />
                {isUpdating ? "Enregistrement..." : "Enregistrer les décisions"}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Moyenne</TableHead>
                  <TableHead>Crédits</TableHead>
                  <TableHead>Décision</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {decisions.map((d) => (
                  <TableRow key={d.studentId}>
                    <TableCell className="font-medium">
                      {d.studentName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{d.studentMatricule}</Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "font-bold",
                          d.average >= 10
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        )}
                      >
                        {d.average.toFixed(2)}/20
                      </span>
                    </TableCell>
                    <TableCell>{d.credits}</TableCell>
                    <TableCell>
                      {canEdit ? (
                        <Select
                          value={d.decision}
                          onValueChange={(v) =>
                            handleDecisionChange(
                              d.studentId,
                              v as JuryDecision["decision"]
                            )
                          }
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DECISION_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          className={cn(
                            "border",
                            decisionColors[d.decision]
                          )}
                        >
                          {d.decision}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {decisions.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">
                Aucune décision enregistrée
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}
