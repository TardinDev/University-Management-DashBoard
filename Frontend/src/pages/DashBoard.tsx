import { motion } from "motion/react";
import { AnimatedPage } from "@/components/ui/animated-page";
import { containerVariants } from "@/lib/animations";
import {
  MockDashboardStats,
  MockCourses,
  MockAssignments,
  MockAttendances,
  MockExams,
} from "@/components/constants/Mock-Data";
import { KpiCard } from "./dashboard/components/kpi-card";
import { EnrollmentChart } from "./dashboard/components/enrollment-chart";
import { GradeDistributionChart } from "./dashboard/components/grade-distribution-chart";
import { DepartmentBreakdown } from "./dashboard/components/department-breakdown";
import { RecentActivity } from "./dashboard/components/recent-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetIdentity } from "@refinedev/core";
import { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Award,
  Settings,
  Calendar,
  ClipboardList,
  CheckSquare,
  Library,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserIdentity } from "@/types";

const stats = MockDashboardStats;

type WidgetKey =
  | "kpis"
  | "enrollment"
  | "gradeDistribution"
  | "departments"
  | "recentActivity"
  | "myCourses"
  | "upcomingAssignments"
  | "upcomingExams"
  | "attendanceSummary";

const WIDGET_LABELS: Record<WidgetKey, string> = {
  kpis: "Indicateurs clés (KPI)",
  enrollment: "Tendance des inscriptions",
  gradeDistribution: "Distribution des notes",
  departments: "Répartition par département",
  recentActivity: "Activité récente",
  myCourses: "Mes cours",
  upcomingAssignments: "Travaux à rendre",
  upcomingExams: "Examens à venir",
  attendanceSummary: "Résumé des présences",
};

const ROLE_DEFAULT_WIDGETS: Record<string, WidgetKey[]> = {
  ADMIN: ["kpis", "enrollment", "gradeDistribution", "departments", "recentActivity"],
  PROFESSOR: ["kpis", "myCourses", "upcomingExams", "attendanceSummary", "recentActivity"],
  STUDENT: ["myCourses", "upcomingAssignments", "upcomingExams", "gradeDistribution"],
};

function getStoredWidgets(role: string): WidgetKey[] | null {
  try {
    const raw = localStorage.getItem(`dashboard-widgets-${role}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function storeWidgets(role: string, widgets: WidgetKey[]) {
  localStorage.setItem(`dashboard-widgets-${role}`, JSON.stringify(widgets));
}

function DashBoard() {
  const { data: identity } = useGetIdentity<UserIdentity>();
  const role = identity?.role ?? "ADMIN";
  const userName = identity
    ? `${identity.firstName ?? ""} ${identity.lastName ?? ""}`.trim()
    : "";

  const [visibleWidgets, setVisibleWidgets] = useState<WidgetKey[]>(
    () => getStoredWidgets(role) ?? ROLE_DEFAULT_WIDGETS[role] ?? ROLE_DEFAULT_WIDGETS.ADMIN
  );

  useEffect(() => {
    const stored = getStoredWidgets(role);
    if (stored) {
      setVisibleWidgets(stored);
    } else {
      setVisibleWidgets(ROLE_DEFAULT_WIDGETS[role] ?? ROLE_DEFAULT_WIDGETS.ADMIN);
    }
  }, [role]);

  const toggleWidget = (key: WidgetKey) => {
    setVisibleWidgets((prev) => {
      const next = prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key];
      storeWidgets(role, next);
      return next;
    });
  };

  const availableWidgets: WidgetKey[] =
    role === "ADMIN"
      ? ["kpis", "enrollment", "gradeDistribution", "departments", "recentActivity"]
      : role === "PROFESSOR"
        ? ["kpis", "myCourses", "upcomingExams", "attendanceSummary", "recentActivity"]
        : ["myCourses", "upcomingAssignments", "upcomingExams", "gradeDistribution", "recentActivity"];

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Bonjour" : now.getHours() < 18 ? "Bon après-midi" : "Bonsoir";
  const dateStr = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const show = (key: WidgetKey) => visibleWidgets.includes(key);

  // Data for professor/student widgets
  const myCourses = MockCourses.slice(0, 4);
  const upcomingAssignments = MockAssignments.filter(
    (a) => a.dueDate && new Date(a.dueDate) >= now
  ).slice(0, 5);
  const upcomingExams = MockExams.filter((e) => new Date(e.date) >= now).slice(0, 4);
  const attendanceStats = {
    present: MockAttendances.filter((a) => a.status === "Présent").length,
    absent: MockAttendances.filter((a) => a.status === "Absent").length,
    late: MockAttendances.filter((a) => a.status === "Retard").length,
    total: MockAttendances.length,
  };

  return (
    <AnimatedPage>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="page-title">
              {greeting}
              {userName ? `, ${userName}` : ""} !
            </h1>
            <p className="text-muted-foreground capitalize">
              {dateStr} &mdash; Semestre S2 2025-2026
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configuration du tableau de bord</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <p className="text-sm text-muted-foreground">
                  Activez ou désactivez les widgets affichés sur votre tableau de bord.
                </p>
                {availableWidgets.map((key) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={`widget-${key}`} className="cursor-pointer">
                      {WIDGET_LABELS[key]}
                    </Label>
                    <Switch
                      id={`widget-${key}`}
                      checked={visibleWidgets.includes(key)}
                      onCheckedChange={() => toggleWidget(key)}
                    />
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Admin KPI Cards */}
        {show("kpis") && (
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            <KpiCard
              label="Étudiants"
              value={stats.totalStudents}
              icon={Users}
              trend={{ value: 5.2, label: "vs sem. dernier" }}
            />
            <KpiCard
              label="Enseignants"
              value={stats.totalTeachers}
              icon={GraduationCap}
              trend={{ value: 2.0, label: "vs sem. dernier" }}
            />
            <KpiCard label="Matières" value={stats.totalSubjects} icon={BookOpen} />
            <KpiCard
              label="Moyenne Générale"
              value={stats.averageGrade}
              suffix="/20"
              icon={TrendingUp}
              trend={{ value: 0.3, label: "vs sem. dernier" }}
            />
            <KpiCard
              label="Taux de Réussite"
              value={stats.successRate}
              suffix="%"
              icon={Award}
              trend={{ value: 1.5, label: "vs sem. dernier" }}
            />
          </motion.div>
        )}

        {/* My Courses (Professor & Student) */}
        {show("myCourses") && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Library className="h-4 w-4" />
                Mes Cours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {myCourses.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-lg border p-3 space-y-2 hover:shadow-sm transition-shadow"
                  >
                    <p className="font-medium text-sm line-clamp-1">{c.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {c.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">
                        {c.code}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {(c as any)._count?.enrollments ?? 0} inscrits
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Assignments (Student) */}
        {show("upcomingAssignments") && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Travaux à rendre
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAssignments.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  Aucun travail à rendre prochainement
                </p>
              ) : (
                <div className="space-y-2">
                  {upcomingAssignments.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium text-sm">{a.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {MockCourses.find((c) => c.id === a.courseId)?.name ?? ""}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          new Date(a.dueDate!).getTime() - now.getTime() <
                            3 * 24 * 60 * 60 * 1000
                            ? "border-red-300 text-red-700 dark:text-red-400"
                            : ""
                        )}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(a.dueDate!).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Upcoming Exams */}
        {show("upcomingExams") && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Examens à venir
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingExams.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  Aucun examen planifié prochainement
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {upcomingExams.map((e) => (
                    <div
                      key={e.id}
                      className="rounded-lg border p-3 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{e.courseName}</p>
                        <Badge
                          className={cn(
                            "text-[10px] border",
                            e.type === "Final"
                              ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100"
                              : e.type === "Partiel"
                                ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100"
                                : "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-100"
                          )}
                        >
                          {e.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(e.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                        })}{" "}
                        &mdash; {e.startTime}-{e.endTime}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Salle: {e.roomName}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Attendance Summary (Professor) */}
        {show("attendanceSummary") && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Résumé des présences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {attendanceStats.present}
                  </p>
                  <p className="text-xs text-muted-foreground">Présents</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {attendanceStats.absent}
                  </p>
                  <p className="text-xs text-muted-foreground">Absents</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {attendanceStats.late}
                  </p>
                  <p className="text-xs text-muted-foreground">Retards</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {attendanceStats.total > 0
                      ? Math.round(
                          (attendanceStats.present / attendanceStats.total) * 100
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-muted-foreground">Taux présence</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts Row */}
        {(show("enrollment") || show("gradeDistribution")) && (
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 lg:grid-cols-7 gap-4"
          >
            {show("enrollment") && (
              <div className="lg:col-span-4">
                <EnrollmentChart data={stats.enrollmentTrend} />
              </div>
            )}
            {show("gradeDistribution") && (
              <div className={show("enrollment") ? "lg:col-span-3" : "lg:col-span-7"}>
                <GradeDistributionChart data={stats.gradeDistribution} />
              </div>
            )}
          </motion.div>
        )}

        {/* Bottom Row */}
        {(show("departments") || show("recentActivity")) && (
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            {show("departments") && (
              <DepartmentBreakdown data={stats.departmentDistribution} />
            )}
            {show("recentActivity") && (
              <RecentActivity data={stats.recentActivity} />
            )}
          </motion.div>
        )}
      </div>
    </AnimatedPage>
  );
}

export default DashBoard;
