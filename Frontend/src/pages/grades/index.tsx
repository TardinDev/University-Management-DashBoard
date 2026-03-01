import { MockGrades, MockSubjects, MockStudents, MockDashboardStats } from "@/components/constants/Mock-Data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { AnimatedPage } from "@/components/ui/animated-page";
import { AnimatedCard } from "@/components/ui/animated-card";
import { SubjectGradesTable } from "./components/subject-grades-table";
import { StudentBulletin } from "./components/student-bulletin";
import { GradeDistributionChart } from "../dashboard/components/grade-distribution-chart";
import { motion } from "motion/react";
import { containerVariants } from "@/lib/animations";
import { useState } from "react";
import { Award, TrendingUp, Users, Search } from "lucide-react";
import { KpiCard } from "../dashboard/components/kpi-card";

const GradesPage = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  const subjectGrades = selectedSubject
    ? MockGrades.filter((g) => g.subjectId === Number(selectedSubject))
    : [];

  const matchedStudent = studentSearch.trim()
    ? MockStudents.find(
        (s) =>
          s.matricule.toLowerCase().includes(studentSearch.toLowerCase()) ||
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(studentSearch.toLowerCase())
      )
    : null;

  const studentGrades = matchedStudent
    ? MockGrades.filter((g) => g.studentId === matchedStudent.id)
    : [];

  const stats = MockDashboardStats;
  const allNotes = MockGrades.map((g) => g.note);
  const maxNote = Math.max(...allNotes);
  const minNote = Math.min(...allNotes);

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <Breadcrumb />
        <div>
          <h1 className="page-title mb-0">Notes & Résultats</h1>
          <p className="text-muted-foreground">Consultez les notes par matière ou par étudiant</p>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="by-subject">Par Matière</TabsTrigger>
            <TabsTrigger value="by-student">Par Étudiant</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-4">
            <motion.div
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <KpiCard label="Moyenne Générale" value={stats.averageGrade} suffix="/20" icon={TrendingUp} />
              <KpiCard label="Taux de Réussite" value={stats.successRate} suffix="%" icon={Award} />
              <KpiCard label="Note Max" value={maxNote} suffix="/20" icon={TrendingUp} />
              <KpiCard label="Étudiants Notés" value={new Set(MockGrades.map((g) => g.studentId)).size} icon={Users} />
            </motion.div>

            <GradeDistributionChart data={stats.gradeDistribution} />
          </TabsContent>

          <TabsContent value="by-subject" className="space-y-4 mt-4">
            <div className="flex items-center gap-4">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Sélectionner une matière" />
                </SelectTrigger>
                <SelectContent>
                  {MockSubjects.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      <span className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">{s.code}</Badge>
                        {s.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSubject ? (
              <AnimatedCard>
                <CardHeader>
                  <CardTitle className="text-base">
                    {MockSubjects.find((s) => s.id === Number(selectedSubject))?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SubjectGradesTable grades={subjectGrades} />
                </CardContent>
              </AnimatedCard>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Sélectionnez une matière pour voir les notes
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="by-student" className="space-y-4 mt-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <input
                type="text"
                placeholder="Rechercher par nom ou matricule..."
                className="search-input w-full pl-9"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />
            </div>

            {matchedStudent ? (
              <StudentBulletin student={matchedStudent} grades={studentGrades} />
            ) : studentSearch.trim() ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Aucun étudiant trouvé pour "{studentSearch}"
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Recherchez un étudiant par nom ou matricule
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedPage>
  );
};

export default GradesPage;
