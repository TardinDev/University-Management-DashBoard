import { useCreate, useGo } from "@refinedev/core";
import { useState } from "react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatedPage } from "@/components/ui/animated-page";
import { DEPARTMENTS, SEMESTERS } from "@/components/constants";
import { ArrowLeft } from "lucide-react";

export default function CoursesCreate() {
  const go = useGo();
  const { mutate: create } = useCreate();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [departement, setDepartement] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create(
      {
        resource: "courses",
        values: {
          name,
          code,
          description,
          departement,
          semester,
          section: section || undefined,
        },
      },
      {
        onSuccess: () => {
          go({ to: "/courses" });
        },
      }
    );
  };

  return (
    <AnimatedPage>
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => go({ to: "/courses" })}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux cours
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Créer un nouveau cours</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du cours</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Introduction à l'Informatique"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="CS101"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description du cours..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Département</Label>
                  <Select value={departement} onValueChange={setDepartement}>
                    <SelectTrigger>
                      <SelectValue placeholder="Département" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Semestre</Label>
                  <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="Semestre" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEMESTERS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Input
                    id="section"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="A"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => go({ to: "/courses" })}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={false}>
                  {false ? "Création..." : "Créer le cours"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}
