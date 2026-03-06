import { useCreate, useList, useGo } from "@refinedev/core";
import { useState } from "react";
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AITextHelper } from "@/components/ai-text-helper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AnimatedPage } from "@/components/ui/animated-page";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import type { Course } from "@/types";

interface QuestionForm {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  points: number;
}

function emptyQuestion(): QuestionForm {
  return { question: "", options: ["", "", "", ""], correctIndex: 0, points: 1 };
}

export default function QuizzesCreate() {
  const go = useGo();
  const { mutate: create } = useCreate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [duration, setDuration] = useState("");
  const [questions, setQuestions] = useState<QuestionForm[]>([emptyQuestion()]);
  const [submitting, setSubmitting] = useState(false);

  const { result: coursesResult } = useList<Course>({
    resource: "courses",
    pagination: { pageSize: 100 },
  });
  const courses = coursesResult.data || [];

  const addQuestion = () => {
    setQuestions([...questions, emptyQuestion()]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof QuestionForm, value: unknown) => {
    setQuestions(questions.map((q, i) => (i === index ? { ...q, [field]: value } : q)));
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    setQuestions(
      questions.map((q, i) => {
        if (i !== qIndex) return q;
        const opts = [...q.options] as [string, string, string, string];
        opts[oIndex] = value;
        return { ...q, options: opts };
      })
    );
  };

  const selectedCourse = courses.find((c) => c.id === courseId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    create(
      {
        resource: "quizzes",
        values: {
          title,
          description,
          courseId,
          courseName: selectedCourse?.name || "",
          dueDate: dueDate || undefined,
          duration: duration ? parseInt(duration) : undefined,
          questions: questions.map((q, i) => ({
            id: i + 1,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            points: q.points,
          })),
        },
      },
      {
        onSuccess: () => {
          go({ to: "/quizzes" });
        },
        onError: () => {
          setSubmitting(false);
        },
      }
    );
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <AnimatedPage>
      <Breadcrumb />
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" className="mb-4" onClick={() => go({ to: "/quizzes" })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux quiz
        </Button>

        <form onSubmit={handleSubmit}>
          {/* General info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Cr&eacute;er un nouveau Quiz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Quiz Chapitre 3"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cours</Label>
                  <Select value={courseId} onValueChange={setCourseId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="S&eacute;lectionner un cours" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.code} - {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <AITextHelper
                  id="description"
                  value={description}
                  onValueChange={setDescription}
                  context="quiz"
                  placeholder="Instructions pour les &eacute;tudiants..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Date limite</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Dur&eacute;e (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={1}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="30"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Questions ({questions.length}) &mdash; {totalPoints} point{totalPoints !== 1 ? "s" : ""}
              </h2>
              <Button type="button" variant="outline" onClick={addQuestion}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une question
              </Button>
            </div>

            {questions.map((q, qIndex) => (
              <Card key={qIndex}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      Question {qIndex + 1}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Label className="text-sm">Points :</Label>
                        <Input
                          type="number"
                          min={1}
                          className="w-16 h-8"
                          value={q.points}
                          onChange={(e) => updateQuestion(qIndex, "points", parseInt(e.target.value) || 1)}
                        />
                      </div>
                      {questions.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => removeQuestion(qIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>&Eacute;nonc&eacute;</Label>
                    <AITextHelper
                      value={q.question}
                      onValueChange={(val) => updateQuestion(qIndex, "question", val)}
                      context="quiz"
                      placeholder="Posez votre question..."
                      rows={2}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Options (s&eacute;lectionnez la bonne r&eacute;ponse)</Label>
                    <RadioGroup
                      value={String(q.correctIndex)}
                      onValueChange={(v) => updateQuestion(qIndex, "correctIndex", parseInt(v))}
                    >
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                          <RadioGroupItem value={String(oIndex)} id={`q${qIndex}-o${oIndex}`} />
                          <Input
                            value={opt}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                            className="flex-1"
                            required
                          />
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Submit */}
          <Separator className="mb-4" />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => go({ to: "/quizzes" })}>
              Annuler
            </Button>
            <Button type="submit" disabled={submitting || !title || !courseId || questions.length === 0}>
              {submitting ? "Cr&eacute;ation..." : "Cr&eacute;er le quiz"}
            </Button>
          </div>
        </form>
      </div>
    </AnimatedPage>
  );
}
