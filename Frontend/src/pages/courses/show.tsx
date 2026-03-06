import { useOne, useList, useCreate, useGetIdentity, useGo, useUpdate } from "@refinedev/core";
import { useParams } from "react-router";
import { useState } from "react";
import { ArrowLeft, Users, FileText, MessageSquare, Copy, Check, Plus, Clock, Send, Award, FolderOpen, MessageCircle, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AnimatedPage } from "@/components/ui/animated-page";
import { BulkEnrollmentDialog } from "@/components/bulk-enrollment-dialog";
import type { Course, Assignment, Announcement, Submission, UserIdentity, Resource, ForumPost } from "@/types";

function getInitials(first: string, last: string) {
  return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
}

export default function CoursesShow() {
  const { id } = useParams();
  const go = useGo();
  const { data: identity } = useGetIdentity<UserIdentity>();

  const { result: course, query: courseQuery } = useOne<Course>({
    resource: "courses",
    id: id!,
  });

  const isProfOrAdmin = identity?.role === "PROFESSOR" || identity?.role === "ADMIN";

  if (courseQuery.isLoading) {
    return (
      <AnimatedPage>
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-muted rounded-lg" />
          <div className="h-8 bg-muted rounded w-1/3" />
        </div>
      </AnimatedPage>
    );
  }

  if (!course) {
    return (
      <AnimatedPage>
        <p>Cours non trouve</p>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <Button variant="ghost" className="mb-4" onClick={() => go({ to: "/courses" })}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>

      {/* Course header */}
      <div className="relative h-40 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 mb-6 flex flex-col justify-end">
        <h1 className="text-white text-2xl font-bold">{course.name}</h1>
        <p className="text-white/80">{course.code} — {course.professor?.firstName} {course.professor?.lastName}</p>
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge className="bg-white/20 text-white">{course.departement}</Badge>
          <Badge className="bg-white/20 text-white">{course.semester}</Badge>
        </div>
      </div>

      <Tabs defaultValue="flux">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="flux" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Flux
          </TabsTrigger>
          <TabsTrigger value="travaux" className="gap-2">
            <FileText className="h-4 w-4" />
            Travaux
          </TabsTrigger>
          <TabsTrigger value="ressources" className="gap-2">
            <FolderOpen className="h-4 w-4" />
            Ressources
          </TabsTrigger>
          <TabsTrigger value="forum" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Forum
          </TabsTrigger>
          <TabsTrigger value="personnes" className="gap-2">
            <Users className="h-4 w-4" />
            Personnes
          </TabsTrigger>
          {isProfOrAdmin && (
            <TabsTrigger value="notes" className="gap-2">
              <Award className="h-4 w-4" />
              Notes
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="flux">
          <FluxTab courseId={course.id} isProfOrAdmin={isProfOrAdmin} />
        </TabsContent>
        <TabsContent value="travaux">
          <TravauxTab courseId={course.id} isProfOrAdmin={isProfOrAdmin} identity={identity} />
        </TabsContent>
        <TabsContent value="ressources">
          <ResourcesTab courseId={course.id} courseName={course.name} isProfOrAdmin={isProfOrAdmin} />
        </TabsContent>
        <TabsContent value="forum">
          <ForumTab courseId={course.id} courseName={course.name} />
        </TabsContent>
        <TabsContent value="personnes">
          <PersonnesTab course={course} isProfOrAdmin={isProfOrAdmin} onRefresh={() => courseQuery.refetch()} />
        </TabsContent>
        {isProfOrAdmin && (
          <TabsContent value="notes">
            <NotesTab courseId={course.id} />
          </TabsContent>
        )}
      </Tabs>
    </AnimatedPage>
  );
}

// ---- Flux (Announcements) Tab ----
function FluxTab({ courseId, isProfOrAdmin }: { courseId: string; isProfOrAdmin: boolean }) {
  const [newContent, setNewContent] = useState("");
  const { mutate: createAnnouncement } = useCreate();
  const { result, query } = useList<Announcement>({
    resource: "announcements",
    filters: [{ field: "courseId", operator: "eq", value: courseId }],
    sorters: [{ field: "createdAt", order: "desc" }],
    pagination: { pageSize: 50 },
  });

  const announcements = result.data || [];

  const handlePost = () => {
    if (!newContent.trim()) return;
    createAnnouncement(
      { resource: "announcements", values: { courseId, content: newContent } },
      { onSuccess: () => { setNewContent(""); query.refetch(); } }
    );
  };

  return (
    <div className="space-y-4">
      {isProfOrAdmin && (
        <Card>
          <CardContent className="pt-4">
            <Textarea placeholder="Publier une annonce..." value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={3} />
            <div className="flex justify-end mt-2">
              <Button onClick={handlePost} disabled={!newContent.trim()} size="sm">
                <Send className="h-4 w-4 mr-2" />Publier
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {announcements.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">Aucune annonce pour le moment</CardContent></Card>
      ) : (
        announcements.map((a: Announcement) => (
          <Card key={a.id}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-8 w-8"><AvatarFallback>{getInitials(a.author.firstName, a.author.lastName)}</AvatarFallback></Avatar>
                <div>
                  <p className="font-medium text-sm">{a.author.firstName} {a.author.lastName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
              <p className="text-sm whitespace-pre-wrap">{a.content}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

// ---- Travaux (Assignments) Tab ----
function TravauxTab({ courseId, isProfOrAdmin, identity }: { courseId: string; isProfOrAdmin: boolean; identity?: UserIdentity | null }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [points, setPoints] = useState("");
  const { mutate: createAssignment } = useCreate();
  const { result, query } = useList<Assignment>({
    resource: "assignments",
    filters: [{ field: "courseId", operator: "eq", value: courseId }],
    sorters: [{ field: "createdAt", order: "desc" }],
    pagination: { pageSize: 50 },
  });
  const assignments = result.data || [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createAssignment(
      { resource: "assignments", values: { courseId, title, description, dueDate: dueDate || undefined, points: points ? parseInt(points) : undefined } },
      { onSuccess: () => { setTitle(""); setDescription(""); setDueDate(""); setPoints(""); setShowForm(false); query.refetch(); } }
    );
  };

  return (
    <div className="space-y-4">
      {isProfOrAdmin && (
        <div className="flex justify-end">
          <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-2" />Nouveau devoir</Button>
        </div>
      )}
      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Nouveau devoir</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2"><Label>Titre</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Date limite</Label><Input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div>
                <div className="space-y-2"><Label>Points</Label><Input type="number" value={points} onChange={(e) => setPoints(e.target.value)} placeholder="20" /></div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
                <Button type="submit">Creer</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      {assignments.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">Aucun devoir pour le moment</CardContent></Card>
      ) : (
        assignments.map((a: Assignment) => (
          <AssignmentCard key={a.id} assignment={a} isProfOrAdmin={isProfOrAdmin} identity={identity} />
        ))
      )}
    </div>
  );
}

// ---- Single Assignment Card ----
function AssignmentCard({ assignment, isProfOrAdmin, identity }: { assignment: Assignment; isProfOrAdmin: boolean; identity?: UserIdentity | null }) {
  const [expanded, setExpanded] = useState(false);
  const [submissionContent, setSubmissionContent] = useState("");
  const { mutate: createSubmission } = useCreate();
  const { mutate: updateSubmission } = useUpdate();
  const { result: subResult, query: subQuery } = useList<Submission>({
    resource: "submissions",
    filters: [{ field: "assignmentId", operator: "eq", value: assignment.id }],
    pagination: { pageSize: 100 },
    queryOptions: { enabled: expanded },
  });
  const submissions = subResult.data || [];
  const mySubmission = submissions.find((s: Submission) => s.studentId === identity?.id);
  const isDue = assignment.dueDate && new Date(assignment.dueDate) < new Date();

  const handleSubmit = () => {
    if (!submissionContent.trim()) return;
    createSubmission(
      { resource: "submissions", values: { assignmentId: assignment.id, content: submissionContent } },
      { onSuccess: () => { setSubmissionContent(""); subQuery.refetch(); } }
    );
  };

  const handleGrade = (submissionId: string, grade: number, feedback: string) => {
    updateSubmission(
      { resource: "submissions", id: submissionId, values: { grade, feedback } },
      { onSuccess: () => subQuery.refetch() }
    );
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><FileText className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="font-medium">{assignment.title}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {assignment.dueDate && <span className={`flex items-center gap-1 ${isDue ? "text-red-500" : ""}`}><Clock className="h-3 w-3" />{new Date(assignment.dueDate).toLocaleDateString("fr-FR")}</span>}
                {assignment.points && <span>{assignment.points} pts</span>}
              </div>
            </div>
          </div>
          {mySubmission && <Badge variant={mySubmission.grade != null ? "default" : "secondary"}>{mySubmission.grade != null ? `${mySubmission.grade}/${assignment.points || 20}` : "Rendu"}</Badge>}
        </div>
        {expanded && (
          <div className="mt-4 space-y-4">
            {assignment.description && <p className="text-sm text-muted-foreground">{assignment.description}</p>}
            <Separator />
            {!isProfOrAdmin && !mySubmission && (
              <div className="space-y-2">
                <Label>Votre travail</Label>
                <Textarea value={submissionContent} onChange={(e) => setSubmissionContent(e.target.value)} placeholder="Ecrivez votre reponse..." rows={4} />
                <div className="flex justify-end"><Button size="sm" onClick={handleSubmit}><Send className="h-4 w-4 mr-2" />Soumettre</Button></div>
              </div>
            )}
            {!isProfOrAdmin && mySubmission && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Votre soumission</p>
                <p className="text-sm bg-muted p-3 rounded">{mySubmission.content}</p>
                {mySubmission.grade != null && (
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded">
                    <p className="font-medium text-sm">Note : {mySubmission.grade}/{assignment.points || 20}</p>
                    {mySubmission.feedback && <p className="text-sm mt-1">{mySubmission.feedback}</p>}
                  </div>
                )}
              </div>
            )}
            {isProfOrAdmin && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Soumissions ({submissions.length})</p>
                {submissions.length === 0 ? <p className="text-sm text-muted-foreground">Aucune soumission</p> : submissions.map((sub: Submission) => (
                  <GradingRow key={sub.id} submission={sub} maxPoints={assignment.points || 20} onGrade={handleGrade} />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---- Grading Row ----
function GradingRow({ submission, maxPoints, onGrade }: { submission: Submission; maxPoints: number; onGrade: (id: string, grade: number, feedback: string) => void }) {
  const [grade, setGrade] = useState(submission.grade?.toString() || "");
  const [feedback, setFeedback] = useState(submission.feedback || "");
  return (
    <div className="border rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6"><AvatarFallback className="text-xs">{getInitials(submission.student?.firstName || "", submission.student?.lastName || "")}</AvatarFallback></Avatar>
          <span className="text-sm font-medium">{submission.student?.firstName} {submission.student?.lastName}</span>
          <span className="text-xs text-muted-foreground">{submission.student?.matricule}</span>
        </div>
        {submission.grade != null && <Badge>{submission.grade}/{maxPoints}</Badge>}
      </div>
      <p className="text-sm bg-muted p-2 rounded mb-2">{submission.content}</p>
      <div className="flex items-end gap-2">
        <div className="flex-1"><Input placeholder="Commentaire..." value={feedback} onChange={(e) => setFeedback(e.target.value)} className="text-sm" /></div>
        <div className="w-20"><Input type="number" placeholder={`/${maxPoints}`} value={grade} onChange={(e) => setGrade(e.target.value)} className="text-sm" max={maxPoints} min={0} /></div>
        <Button size="sm" variant="outline" onClick={() => onGrade(submission.id, parseFloat(grade), feedback)} disabled={!grade}><Check className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}

// ---- Resources Tab ----
function ResourcesTab({ courseId, courseName, isProfOrAdmin }: { courseId: string; courseName: string; isProfOrAdmin: boolean }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileType, setFileType] = useState("pdf");
  const { mutate: createResource } = useCreate();
  const { result, query } = useList<Resource>({
    resource: "resources",
    filters: [{ field: "courseId", operator: "eq", value: courseId }],
    sorters: [{ field: "createdAt", order: "desc" }],
    pagination: { pageSize: 50 },
  });
  const resources = result.data || [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createResource(
      { resource: "resources", values: { courseId, courseName, title, description, fileType, fileUrl: `#simulated-${Date.now()}` } },
      { onSuccess: () => { setTitle(""); setDescription(""); setShowForm(false); query.refetch(); } }
    );
  };

  return (
    <div className="space-y-4">
      {isProfOrAdmin && (
        <div className="flex justify-end">
          <Button onClick={() => setShowForm(!showForm)}><Upload className="h-4 w-4 mr-2" />Ajouter une ressource</Button>
        </div>
      )}
      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Nouvelle ressource</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2"><Label>Titre</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} /></div>
              <div className="space-y-2"><Label>Type de fichier</Label><Input value={fileType} onChange={(e) => setFileType(e.target.value)} placeholder="pdf, pptx, docx..." /></div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
                <Button type="submit">Ajouter</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      {resources.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">Aucune ressource pour le moment</CardContent></Card>
      ) : (
        resources.map((r: Resource) => (
          <Card key={r.id}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center"><FolderOpen className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="font-medium text-sm">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{r.fileType}</Badge>
                      <span className="text-xs text-muted-foreground">{r.uploadedByName} - {new Date(r.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

// ---- Forum Tab ----
function ForumTab({ courseId, courseName }: { courseId: string; courseName: string }) {
  const [showNewTopic, setShowNewTopic] = useState(false);
  const [topicTitle, setTopicTitle] = useState("");
  const [topicContent, setTopicContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);

  const { mutate: createPost } = useCreate();
  const { result, query } = useList<ForumPost>({
    resource: "forum-posts",
    filters: [{ field: "courseId", operator: "eq", value: courseId }],
    sorters: [{ field: "createdAt", order: "desc" }],
    pagination: { pageSize: 50 },
  });

  const allPosts = result.data || [];
  const topLevelPosts = allPosts.filter((p) => !p.parentId);
  const getReplies = (postId: number) => allPosts.filter((p) => p.parentId === postId);

  const handleNewTopic = (e: React.FormEvent) => {
    e.preventDefault();
    createPost(
      { resource: "forum-posts", values: { courseId, courseName, title: topicTitle, content: topicContent } },
      { onSuccess: () => { setTopicTitle(""); setTopicContent(""); setShowNewTopic(false); query.refetch(); } }
    );
  };

  const handleReply = (parentId: number) => {
    if (!replyContent.trim()) return;
    createPost(
      { resource: "forum-posts", values: { courseId, courseName, content: replyContent, parentId } },
      { onSuccess: () => { setReplyContent(""); setReplyTo(null); query.refetch(); } }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowNewTopic(!showNewTopic)}><Plus className="h-4 w-4 mr-2" />Nouveau sujet</Button>
      </div>
      {showNewTopic && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Nouveau sujet</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleNewTopic} className="space-y-4">
              <div className="space-y-2"><Label>Titre</Label><Input value={topicTitle} onChange={(e) => setTopicTitle(e.target.value)} required /></div>
              <div className="space-y-2"><Label>Message</Label><Textarea value={topicContent} onChange={(e) => setTopicContent(e.target.value)} rows={3} required /></div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowNewTopic(false)}>Annuler</Button>
                <Button type="submit">Publier</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      {topLevelPosts.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">Aucun sujet de discussion</CardContent></Card>
      ) : (
        topLevelPosts.map((post) => {
          const replies = getReplies(post.id);
          return (
            <Card key={post.id}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{post.authorName?.[0] || "?"}</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{post.authorName}</p>
                      <Badge variant="outline" className="text-xs">{post.authorRole}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                    {post.title && <p className="font-medium mt-1">{post.title}</p>}
                    <p className="text-sm mt-1">{post.content}</p>

                    {/* Replies */}
                    {replies.length > 0 && (
                      <div className="mt-3 ml-4 space-y-3 border-l-2 pl-4">
                        {replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-2">
                            <Avatar className="h-6 w-6"><AvatarFallback className="text-xs">{reply.authorName?.[0] || "?"}</AvatarFallback></Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{reply.authorName}</span>
                                <span className="text-xs text-muted-foreground">{new Date(reply.createdAt).toLocaleDateString("fr-FR")}</span>
                              </div>
                              <p className="text-sm">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply form */}
                    {replyTo === post.id ? (
                      <div className="mt-3 flex gap-2">
                        <Input value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder="Votre reponse..." className="text-sm" />
                        <Button size="sm" onClick={() => handleReply(post.id)}><Send className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => setReplyTo(null)}>Annuler</Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" className="mt-2" onClick={() => setReplyTo(post.id)}>
                        <MessageCircle className="h-3 w-3 mr-1" />Repondre
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

// ---- Personnes (People) Tab ----
function PersonnesTab({ course, isProfOrAdmin, onRefresh }: { course: Course; isProfOrAdmin: boolean; onRefresh?: () => void }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(course.joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {isProfOrAdmin && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Code de rejoindre</p>
                <p className="text-2xl font-mono font-bold tracking-wider">{course.joinCode}</p>
              </div>
              <div className="flex gap-2">
                <BulkEnrollmentDialog course={course} onSuccess={onRefresh} />
                <Button variant="outline" size="sm" onClick={copyCode}>
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Copie !" : "Copier"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className="font-semibold mb-3">Enseignant</h3>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Avatar><AvatarFallback>{getInitials(course.professor?.firstName || "", course.professor?.lastName || "")}</AvatarFallback></Avatar>
              <div>
                <p className="font-medium">{course.professor?.firstName} {course.professor?.lastName}</p>
                <p className="text-sm text-muted-foreground">{course.professor?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Etudiants ({course.enrollments?.length || 0})</h3>
        {course.enrollments && course.enrollments.length > 0 ? (
          <Card>
            <CardContent className="pt-4 space-y-3">
              {course.enrollments.map((enrollment) => (
                <div key={enrollment.id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{getInitials(enrollment.student.firstName, enrollment.student.lastName)}</AvatarFallback></Avatar>
                  <div>
                    <p className="text-sm font-medium">{enrollment.student.firstName} {enrollment.student.lastName}</p>
                    <p className="text-xs text-muted-foreground">{enrollment.student.matricule} — {enrollment.student.email}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card><CardContent className="py-8 text-center text-muted-foreground">Aucun etudiant inscrit</CardContent></Card>
        )}
      </div>
    </div>
  );
}

// ---- Notes (Grades) Tab ----
function NotesTab({ courseId }: { courseId: string }) {
  const { result: assignmentResult } = useList<Assignment>({
    resource: "assignments",
    filters: [{ field: "courseId", operator: "eq", value: courseId }],
    pagination: { pageSize: 50 },
  });
  const assignments = assignmentResult.data || [];

  const { result: submissionResult } = useList<Submission>({
    resource: "submissions",
    pagination: { pageSize: 200 },
    queryOptions: { enabled: assignments.length > 0 },
  });
  const submissions = submissionResult.data || [];

  const assignmentIds = new Set(assignments.map((a: Assignment) => a.id));
  const courseSubmissions = submissions.filter((s: Submission) => assignmentIds.has(s.assignmentId));

  const studentMap = new Map<string, { name: string; matricule: string; grades: Map<string, number | null> }>();
  for (const sub of courseSubmissions) {
    const key = sub.studentId;
    if (!studentMap.has(key)) {
      studentMap.set(key, { name: `${sub.student?.firstName || ""} ${sub.student?.lastName || ""}`, matricule: sub.student?.matricule || "", grades: new Map() });
    }
    studentMap.get(key)!.grades.set(sub.assignmentId, sub.grade ?? null);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2 font-medium">Etudiant</th>
            {assignments.map((a: Assignment) => <th key={a.id} className="text-center p-2 font-medium">{a.title}</th>)}
            <th className="text-center p-2 font-medium">Moyenne</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(studentMap.entries()).map(([studentId, student]) => {
            const grades = assignments.map((a: Assignment) => student.grades.get(a.id));
            const validGrades = grades.filter((g): g is number => g != null);
            const avg = validGrades.length > 0 ? (validGrades.reduce((s: number, g: number) => s + g, 0) / validGrades.length).toFixed(1) : "—";
            return (
              <tr key={studentId} className="border-b hover:bg-muted/50">
                <td className="p-2"><p className="font-medium">{student.name}</p><p className="text-xs text-muted-foreground">{student.matricule}</p></td>
                {grades.map((g, i) => <td key={i} className="text-center p-2">{g != null ? <Badge variant={g >= 10 ? "default" : "destructive"}>{g}</Badge> : <span className="text-muted-foreground">—</span>}</td>)}
                <td className="text-center p-2 font-semibold">{avg}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {studentMap.size === 0 && <p className="text-center py-8 text-muted-foreground">Aucune donnee de notation</p>}
    </div>
  );
}
