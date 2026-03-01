import { motion } from "motion/react";
import { AnimatedPage } from "@/components/ui/animated-page";
import { containerVariants } from "@/lib/animations";
import { MockDashboardStats } from "@/components/constants/Mock-Data";
import { KpiCard } from "./dashboard/components/kpi-card";
import { EnrollmentChart } from "./dashboard/components/enrollment-chart";
import { GradeDistributionChart } from "./dashboard/components/grade-distribution-chart";
import { DepartmentBreakdown } from "./dashboard/components/department-breakdown";
import { RecentActivity } from "./dashboard/components/recent-activity";
import { Users, GraduationCap, BookOpen, TrendingUp, Award } from "lucide-react";

const stats = MockDashboardStats;

function DashBoard() {
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Bonjour" : now.getHours() < 18 ? "Bon après-midi" : "Bonsoir";
  const dateStr = now.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <AnimatedPage>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="page-title">{greeting} !</h1>
          <p className="text-muted-foreground capitalize">{dateStr} &mdash; Semestre S2 2025-2026</p>
        </div>

        {/* KPI Cards */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          <KpiCard label="Étudiants" value={stats.totalStudents} icon={Users} trend={{ value: 5.2, label: "vs sem. dernier" }} />
          <KpiCard label="Enseignants" value={stats.totalTeachers} icon={GraduationCap} trend={{ value: 2.0, label: "vs sem. dernier" }} />
          <KpiCard label="Matières" value={stats.totalSubjects} icon={BookOpen} />
          <KpiCard label="Moyenne Générale" value={stats.averageGrade} suffix="/20" icon={TrendingUp} trend={{ value: 0.3, label: "vs sem. dernier" }} />
          <KpiCard label="Taux de Réussite" value={stats.successRate} suffix="%" icon={Award} trend={{ value: 1.5, label: "vs sem. dernier" }} />
        </motion.div>

        {/* Charts Row */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 lg:grid-cols-7 gap-4"
        >
          <div className="lg:col-span-4">
            <EnrollmentChart data={stats.enrollmentTrend} />
          </div>
          <div className="lg:col-span-3">
            <GradeDistributionChart data={stats.gradeDistribution} />
          </div>
        </motion.div>

        {/* Bottom Row */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <DepartmentBreakdown data={stats.departmentDistribution} />
          <RecentActivity data={stats.recentActivity} />
        </motion.div>
      </div>
    </AnimatedPage>
  );
}

export default DashBoard;
