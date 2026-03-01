import { useState } from "react";
import { useGetIdentity, useGo, useNotification } from "@refinedev/core";
import { ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AnimatedPage } from "@/components/ui/animated-page";
import { MockCourses } from "@/components/constants/Mock-Data";
import type { UserIdentity } from "@/types";

export default function JoinCourse() {
  const go = useGo();
  const { open } = useNotification();
  const { data: user } = useGetIdentity<UserIdentity>();
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    setLoading(true);
    try {
      const code = joinCode.trim().toUpperCase();
      const course = MockCourses.find((c) => c.joinCode === code);

      if (!course) {
        open?.({ type: "error", message: "Code invalide ou cours introuvable" });
        return;
      }

      // Check if already enrolled
      const alreadyEnrolled = course.enrollments?.some(
        (e) => String(e.student.id) === String(user?.id),
      );
      if (alreadyEnrolled) {
        open?.({ type: "error", message: "Vous êtes déjà inscrit à ce cours" });
        go({ to: `/courses/${course.id}` });
        return;
      }

      // Add enrollment in-memory
      if (user) {
        const enrollment = {
          id: `e-join-${Date.now()}`,
          student: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
        };
        if (!course.enrollments) course.enrollments = [];
        course.enrollments.push(enrollment);
        course._count.enrollments = course.enrollments.length;
      }

      open?.({ type: "success", message: "Inscrit avec succès !" });
      go({ to: `/courses/${course.id}` });
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
                  placeholder="Ex: CS101AB"
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
