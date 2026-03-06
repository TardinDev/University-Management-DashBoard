import { useList, useGetIdentity, useGo } from "@refinedev/core";
import { Plus, FileQuestion, Clock, CheckCircle2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import type { Quiz, QuizAttempt, UserIdentity } from "@/types";

export default function QuizzesList() {
  const go = useGo();
  const { data: identity } = useGetIdentity<UserIdentity>();
  const isStudent = identity?.role === "STUDENT";

  const { result: quizzesResult, query: quizzesQuery } = useList<Quiz>({
    resource: "quizzes",
    pagination: { pageSize: 100 },
    sorters: [{ field: "createdAt", order: "desc" }],
  });
  const quizzes = quizzesResult.data || [];

  const { result: attemptsResult } = useList<QuizAttempt>({
    resource: "quiz-attempts",
    pagination: { pageSize: 200 },
    queryOptions: { enabled: isStudent },
  });
  const attempts = attemptsResult.data || [];

  const myAttemptIds = new Set(
    attempts.filter((a) => a.studentId === identity?.id).map((a) => a.quizId)
  );

  return (
    <AnimatedPage>
      <Breadcrumb />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quiz</h1>
        {!isStudent && (
          <Button onClick={() => go({ to: "/quizzes/create" })}>
            <Plus className="h-4 w-4 mr-2" />
            Cr&eacute;er un quiz
          </Button>
        )}
      </div>

      {quizzesQuery.isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded animate-pulse" />
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucun quiz disponible</p>
          </CardContent>
        </Card>
      ) : isStudent ? (
        /* Student view: cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => {
            const completed = myAttemptIds.has(quiz.id);
            const isDue = quiz.dueDate && new Date(quiz.dueDate) < new Date();
            return (
              <Card key={quiz.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{quiz.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{quiz.courseName}</p>
                    </div>
                    {completed ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Compl&eacute;t&eacute;
                      </Badge>
                    ) : isDue ? (
                      <Badge variant="destructive">Expir&eacute;</Badge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    {quiz.description && (
                      <p className="line-clamp-2">{quiz.description}</p>
                    )}
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {quiz.questions.length} questions
                      </span>
                      {quiz.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {quiz.duration} min
                        </span>
                      )}
                    </div>
                    {quiz.dueDate && (
                      <p className="text-xs">
                        Date limite : {new Date(quiz.dueDate).toLocaleDateString("fr-FR")}
                      </p>
                    )}
                  </div>
                  {!completed && !isDue && (
                    <Button
                      className="w-full"
                      onClick={() => go({ to: `/quizzes/take/${quiz.id}` })}
                    >
                      Passer le quiz
                    </Button>
                  )}
                  {completed && (
                    <p className="text-sm text-center text-green-600 font-medium">
                      Quiz d&eacute;j&agrave; compl&eacute;t&eacute;
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Professor view: table */
        <Card>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Cours</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Dur&eacute;e</TableHead>
                  <TableHead>Date limite</TableHead>
                  <TableHead>Cr&eacute;&eacute; le</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{quiz.courseName}</Badge>
                    </TableCell>
                    <TableCell>{quiz.questions.length}</TableCell>
                    <TableCell>
                      {quiz.duration ? `${quiz.duration} min` : "---"}
                    </TableCell>
                    <TableCell>
                      {quiz.dueDate
                        ? new Date(quiz.dueDate).toLocaleDateString("fr-FR")
                        : "---"}
                    </TableCell>
                    <TableCell>
                      {new Date(quiz.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => go({ to: `/quizzes/show/${quiz.id}` })}
                      >
                        R&eacute;sultats
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </AnimatedPage>
  );
}
