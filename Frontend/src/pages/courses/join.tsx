import { useState } from "react";
import { useGo, useNotification } from "@refinedev/core";
import { ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AnimatedPage } from "@/components/ui/animated-page";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function JoinCourse() {
  const go = useGo();
  const { open } = useNotification();
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/courses/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ joinCode: joinCode.trim().toUpperCase() }),
      });

      const data = await res.json();

      if (res.ok) {
        open?.({ type: "success", message: "Inscrit avec succès !" });
        go({ to: `/courses/${data.courseId}` });
      } else {
        open?.({ type: "error", message: data.message || "Code invalide" });
      }
    } catch {
      open?.({ type: "error", message: "Erreur de connexion" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="max-w-md mx-auto">
        <Button variant="ghost" className="mb-4" onClick={() => go({ to: "/courses" })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux cours
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Rejoindre un cours</CardTitle>
            <CardDescription>
              Entrez le code fourni par votre enseignant pour rejoindre un cours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="joinCode">Code du cours</Label>
                <Input
                  id="joinCode"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Ex: A820060"
                  className="text-center text-lg font-mono tracking-widest"
                  maxLength={7}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Inscription..." : "Rejoindre"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}
