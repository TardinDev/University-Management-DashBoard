import { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Clock, Save, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserIdentity } from "@/types";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const TIME_SLOTS = [
  "08:00 - 09:30",
  "09:45 - 11:15",
  "11:30 - 13:00",
  "14:00 - 15:30",
  "15:45 - 17:15",
  "17:30 - 19:00",
];

type SlotKey = `${number}-${number}`;

function getStorageKey(userId: number) {
  return `availability-${userId}`;
}

function loadSlots(userId: number): Set<SlotKey> {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (raw) return new Set(JSON.parse(raw) as SlotKey[]);
  } catch {}
  return new Set<SlotKey>();
}

function saveSlots(userId: number, slots: Set<SlotKey>) {
  localStorage.setItem(getStorageKey(userId), JSON.stringify([...slots]));
}

export default function AvailabilityPage() {
  const { data: identity } = useGetIdentity<UserIdentity>();
  const userId = Number(identity?.id) || 0;

  const [selected, setSelected] = useState<Set<SlotKey>>(() => loadSlots(userId));
  const [saved, setSaved] = useState(false);

  const toggle = (dayIdx: number, slotIdx: number) => {
    const key: SlotKey = `${dayIdx}-${slotIdx}`;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setSaved(false);
  };

  const handleSave = () => {
    saveSlots(Number(identity?.id) || 0, selected);
    setSaved(true);
  };

  const handleReset = () => {
    setSelected(new Set());
    setSaved(false);
  };

  const totalSlots = selected.size;

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <Breadcrumb />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title mb-0 flex items-center gap-2">
              <Clock className="h-6 w-6" />
              Disponibilités Rattrapage
            </h1>
            <p className="text-muted-foreground">
              Sélectionnez vos créneaux disponibles pour les sessions de rattrapage
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </div>

        {saved && (
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm text-green-800 dark:text-green-200">
            Disponibilités enregistrées avec succès.
          </div>
        )}

        <div className="flex gap-4 items-center">
          <Badge variant="outline" className="text-sm">
            {totalSlots} créneau{totalSlots !== 1 ? "x" : ""} sélectionné{totalSlots !== 1 ? "s" : ""}
          </Badge>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-primary inline-block" /> Disponible
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-muted border inline-block" /> Non disponible
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Grille horaire hebdomadaire</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-sm font-medium text-muted-foreground p-2 min-w-[120px]">
                    Horaire
                  </th>
                  {DAYS.map((day) => (
                    <th
                      key={day}
                      className="text-center text-sm font-medium p-2 min-w-[100px]"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((slot, slotIdx) => (
                  <tr key={slot}>
                    <td className="text-sm text-muted-foreground p-2 font-mono whitespace-nowrap">
                      {slot}
                    </td>
                    {DAYS.map((_day, dayIdx) => {
                      const key: SlotKey = `${dayIdx}-${slotIdx}`;
                      const isSelected = selected.has(key);
                      return (
                        <td key={key} className="p-1">
                          <button
                            type="button"
                            onClick={() => toggle(dayIdx, slotIdx)}
                            className={cn(
                              "w-full h-12 rounded-md border-2 transition-all duration-200 cursor-pointer",
                              "hover:scale-105 active:scale-95",
                              isSelected
                                ? "bg-primary border-primary text-primary-foreground shadow-sm"
                                : "bg-muted/50 border-muted-foreground/20 hover:border-primary/50 hover:bg-muted"
                            )}
                          >
                            {isSelected && (
                              <span className="text-xs font-medium">✓</span>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Résumé des disponibilités</CardTitle>
          </CardHeader>
          <CardContent>
            {totalSlots === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                Aucun créneau sélectionné. Cliquez sur les cellules pour marquer vos disponibilités.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {DAYS.map((day, dayIdx) => {
                  const daySlots = TIME_SLOTS.filter((_, slotIdx) =>
                    selected.has(`${dayIdx}-${slotIdx}`)
                  );
                  return (
                    <div key={day} className="space-y-1">
                      <p className="font-medium text-sm">{day}</p>
                      {daySlots.length === 0 ? (
                        <p className="text-xs text-muted-foreground">—</p>
                      ) : (
                        daySlots.map((slot) => (
                          <Badge
                            key={slot}
                            variant="secondary"
                            className="text-[10px] block w-fit"
                          >
                            {slot}
                          </Badge>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}
