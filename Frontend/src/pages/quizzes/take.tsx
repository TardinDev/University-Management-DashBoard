import { useOne, useList, useCreate, useGetIdentity, useGo } from "@refinedev/core";
import { useParams } from "react-router";
import { useState } from "react";
import {
  ArrowLeft, Clock, CheckCircle2, XCircle, Send, Trophy, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import type { Quiz, QuizAttempt, UserIdentity } from "@/types";

export default function QuizTake() {
  const { id } = useParams();
  const go = useGo();
  const { data: identity } = useGetIdentity<UserIdentity>();

  const { result: quiz, query: quizQuery } = useOne<Quiz>({
    resource: "quizzes",
    id: id!,
  });

  // Check if already attempted
  const { result: attemptsResult, query: attemptsQuery } = useList<QuizAttempt>({
    resource: "quiz-attempts",
    filters: [{ field: "quizId", operator: "eq", value: Number(id) }],
    pagination: { pageSize: 200 },
  });
  const attempts = attemptsResult.data || [];
  const myAttempt = attempts.find((a) => a.studentId === identity?.id);

  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; maxScore: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { mutate: createAttempt } = useCreate();

  // Init answers array when quiz loads
  if (quiz && answers.length === 0 && quiz.questions.length > 0 && !submitted) {
    setAnswers(new Array(quiz.questions.length).fill(null));
  }

  if (quizQuery.isLoading || attemptsQuery.isLoading) {
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

  const alreadyCompleted = !!myAttempt;
  const maxScore = quiz.questions.reduce((s, q) => s + q.points, 0);

  const selectAnswer = (qIndex: number, optionIndex: number) => {
    if (submitted || alreadyCompleted) return;
    const next = [...answers];
    next[qIndex] = optionIndex;
    setAnswers(next);
  };

  const handleSubmit = () => {
    if (!identity) return;
    setSubmitting(true);

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) score += q.points;
    });

    createAttempt(
      {
        resource: "quiz-attempts",
        values: {
          quizId: quiz.id,
          quizTitle: quiz.title,
          studentId: identity.id,
          studentName: identity.fullName,
          answers: answers.map((a) => a ?? -1),
          score,
          maxScore,
        },
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          setResult({ score, maxScore });
          setSubmitting(false);
        },
        onError: () => {
          setSubmitting(false);
        },
      }
    );
  };

  const showResults = submitted || alreadyCompleted;
  const displayScore = result?.score ?? myAttempt?.score ?? 0;
  const displayMax = result?.maxScore ?? myAttempt?.maxScore ?? maxScore;
  const displayAnswers = alreadyCompleted && !submitted ? myAttempt!.answers : answers;
  const percent = displayMax > 0 ? Math.round((displayScore / displayMax) * 100) : 0;
  const answeredCount = answers.filter((a) => a !== null).length;

  return (
    <AnimatedPage>
      <Breadcrumb />
      <Button variant="ghost" className="mb-4" onClick={() => go({ to: "/quizzes" })}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux quiz
      </Button>

      {/* Quiz header */}
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
              <Badge variant="secondary">
                {quiz.questions.length} questions &mdash; {maxScore} pts
              </Badge>
            </div>
          </div>
        </CardHeader>
        {quiz.description && (
          <CardContent>
            <p className="text-sm text-muted-foreground">{quiz.description}</p>
          </CardContent>
        )}
      </Card>

      {/* Already completed banner */}
      {alreadyCompleted && !submitted && (
        <Card className="mb-6 border-orange-200 dark:border-orange-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3 text-orange-700 dark:text-orange-400">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <p className="font-medium">Quiz d&eacute;j&agrave; compl&eacute;t&eacute;</p>
                <p className="text-sm">
                  Vous avez obtenu {myAttempt!.score}/{myAttempt!.maxScore} ({Math.round((myAttempt!.score / myAttempt!.maxScore) * 100)}%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results banner */}
      {submitted && result && (
        <Card className={`mb-6 ${percent >= 50 ? "border-green-200 dark:border-green-800" : "border-red-200 dark:border-red-800"}`}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-4">
              <Trophy className={`h-8 w-8 ${percent >= 50 ? "text-green-500" : "text-red-500"}`} />
              <div className="flex-1">
                <p className="text-lg font-bold">
                  R&eacute;sultat : {result.score}/{result.maxScore} ({percent}%)
                </p>
                <Progress value={percent} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions */}
      <div className="space-y-4 mb-6">
        {quiz.questions.map((q, qIndex) => {
          const selectedAnswer = displayAnswers[qIndex] ?? null;
          const isCorrect = selectedAnswer === q.correctIndex;
          return (
            <Card key={q.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">
                    {qIndex + 1}. {q.question}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{q.points} pt{q.points > 1 ? "s" : ""}</Badge>
                    {showResults && selectedAnswer !== null && (
                      isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedAnswer !== null ? String(selectedAnswer) : undefined}
                  onValueChange={(v) => selectAnswer(qIndex, parseInt(v))}
                  disabled={showResults}
                >
                  {q.options.map((opt, oIndex) => {
                    let optClass = "";
                    if (showResults) {
                      if (oIndex === q.correctIndex) {
                        optClass = "bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700";
                      } else if (selectedAnswer === oIndex && oIndex !== q.correctIndex) {
                        optClass = "bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-700";
                      }
                    }
                    return (
                      <div
                        key={oIndex}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${optClass}`}
                      >
                        <RadioGroupItem
                          value={String(oIndex)}
                          id={`q${qIndex}-opt${oIndex}`}
                          disabled={showResults}
                        />
                        <Label
                          htmlFor={`q${qIndex}-opt${oIndex}`}
                          className="flex-1 cursor-pointer text-sm"
                        >
                          {opt}
                        </Label>
                        {showResults && oIndex === q.correctIndex && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit */}
      {!showResults && (
        <>
          <Separator className="mb-4" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {answeredCount}/{quiz.questions.length} questions r&eacute;pondues
            </p>
            <Button
              onClick={handleSubmit}
              disabled={submitting || answeredCount === 0}
            >
              <Send className="h-4 w-4 mr-2" />
              {submitting ? "Envoi en cours..." : "Soumettre le quiz"}
            </Button>
          </div>
        </>
      )}
    </AnimatedPage>
  );
}
