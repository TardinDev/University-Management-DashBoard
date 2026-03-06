import { useOne, useList, useGo } from "@refinedev/core";
import { useParams } from "react-router";
import { ArrowLeft, Users, BarChart3, CheckCircle2, XCircle, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import type { Quiz, QuizAttempt } from "@/types";

export default function QuizzesShow() {
  const { id } = useParams();
  const go = useGo();

  const { result: quiz, query: quizQuery } = useOne<Quiz>({
    resource: "quizzes",
    id: id!,
  });

  const { result: attemptsResult } = useList<QuizAttempt>({
    resource: "quiz-attempts",
    filters: [{ field: "quizId", operator: "eq", value: Number(id) }],
    pagination: { pageSize: 200 },
    sorters: [{ field: "submittedAt", order: "desc" }],
  });
  const attempts = attemptsResult.data || [];

  if (quizQuery.isLoading) {
    return (
      <AnimatedPage>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-40 bg-muted rounded" />
        </div>
      </AnimatedPage>
    );
  }

  if (!quiz) {
    return (
      <AnimatedPage>
        <p>Quiz non trouv&eacute;</p>
      </AnimatedPage>
    );
  }

  const avgScore = attempts.length > 0
    ? (attempts.reduce((s, a) => s + a.score, 0) / attempts.length).toFixed(1)
    : "---";
  const avgPercent = attempts.length > 0
    ? Math.round(attempts.reduce((s, a) => s + (a.score / a.maxScore) * 100, 0) / attempts.length)
    : 0;
  const maxScore = quiz.questions.reduce((s, q) => s + q.points, 0);

  // Per-question stats
  const questionStats = quiz.questions.map((q, qIdx) => {
    let correct = 0;
    for (const attempt of attempts) {
      if (attempt.answers[qIdx] === q.correctIndex) correct++;
    }
    return {
      question: q.question,
      points: q.points,
      correct,
      total: attempts.length,
      rate: attempts.length > 0 ? Math.round((correct / attempts.length) * 100) : 0,
    };
  });

  return (
    <AnimatedPage>
      <Breadcrumb />
      <Button variant="ghost" className="mb-4" onClick={() => go({ to: "/quizzes" })}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux quiz
      </Button>

      {/* Quiz info */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{quiz.title}</CardTitle>
              <p className="text-muted-foreground mt-1">{quiz.courseName}</p>
            </div>
            <div className="flex gap-2">
              {quiz.duration && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {quiz.duration} min
                </Badge>
              )}
              <Badge variant="secondary" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {quiz.questions.length} questions
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {quiz.description && (
            <p className="text-sm text-muted-foreground mb-4">{quiz.description}</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Score max</p>
              <p className="text-lg font-bold">{maxScore} pts</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tentatives</p>
              <p className="text-lg font-bold">{attempts.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Moyenne</p>
              <p className="text-lg font-bold">{avgScore} pts</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taux r&eacute;ussite</p>
              <p className="text-lg font-bold">{avgPercent}%</p>
              <Progress value={avgPercent} className="mt-1" />
            </div>
          </div>
          {quiz.dueDate && (
            <p className="text-sm text-muted-foreground mt-3">
              Date limite : {new Date(quiz.dueDate).toLocaleDateString("fr-FR", {
                day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
              })}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Attempts table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tentatives des &eacute;tudiants ({attempts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {attempts.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              Aucune tentative pour le moment
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>&Eacute;tudiant</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Pourcentage</TableHead>
                  <TableHead>Date de soumission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attempts.map((attempt) => {
                  const percent = Math.round((attempt.score / attempt.maxScore) * 100);
                  return (
                    <TableRow key={attempt.id}>
                      <TableCell className="font-medium">{attempt.studentName}</TableCell>
                      <TableCell>
                        <Badge variant={percent >= 50 ? "default" : "destructive"}>
                          {attempt.score}/{attempt.maxScore}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={percent} className="w-20" />
                          <span className="text-sm">{percent}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(attempt.submittedAt).toLocaleDateString("fr-FR", {
                          day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Per-question stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Statistiques par question
          </CardTitle>
        </CardHeader>
        <CardContent>
          {attempts.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              Pas de donn&eacute;es disponibles
            </p>
          ) : (
            <div className="space-y-4">
              {questionStats.map((qs, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Q{idx + 1}. {qs.question}
                      </p>
                      <p className="text-xs text-muted-foreground">{qs.points} pt{qs.points > 1 ? "s" : ""}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {qs.rate >= 50 ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm font-medium">{qs.correct}/{qs.total}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={qs.rate} className="flex-1" />
                    <span className="text-sm text-muted-foreground w-10 text-right">{qs.rate}%</span>
                  </div>
                  {idx < questionStats.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
