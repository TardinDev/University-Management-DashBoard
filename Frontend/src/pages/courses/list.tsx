import { useList, useGetIdentity, useGo } from "@refinedev/core";
import { Plus, Users, FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedPage } from "@/components/ui/animated-page";
import type { Course, UserIdentity } from "@/types";

const GRADIENTS = [
  "from-blue-600 to-blue-800",
  "from-emerald-600 to-emerald-800",
  "from-purple-600 to-purple-800",
  "from-orange-600 to-orange-800",
  "from-rose-600 to-rose-800",
  "from-teal-600 to-teal-800",
  "from-indigo-600 to-indigo-800",
  "from-cyan-600 to-cyan-800",
];

export default function CoursesList() {
  const go = useGo();
  const { data: identity } = useGetIdentity<UserIdentity>();
  const { result, query } = useList<Course>({
    resource: "courses",
    pagination: { pageSize: 50 },
  });

  const courses = result.data || [];
  const isLoading = query.isLoading;
  const canCreate = identity?.role === "PROFESSOR" || identity?.role === "ADMIN";

  return (
    <AnimatedPage>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mes Cours</h1>
          <p className="text-muted-foreground">
            {courses.length} cours
          </p>
        </div>
        <div className="flex gap-2">
          {identity?.role === "STUDENT" && (
            <Button variant="outline" onClick={() => go({ to: "/join" })}>
              <Plus className="h-4 w-4 mr-2" />
              Rejoindre un cours
            </Button>
          )}
          {canCreate && (
            <Button onClick={() => go({ to: "/courses/create" })}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un cours
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-32 bg-muted rounded-t-lg" />
              <CardContent className="pt-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun cours</h3>
          <p className="text-muted-foreground mb-4">
            {identity?.role === "STUDENT"
              ? "Rejoignez un cours avec un code pour commencer"
              : "Créez votre premier cours pour commencer"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course: Course, index: number) => (
            <Card
              key={course.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => go({ to: `/courses/${course.id}` })}
            >
              <div
                className={`relative h-32 bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} p-4 flex flex-col justify-between`}
              >
                {course.coverImage && (
                  <img
                    src={course.coverImage}
                    alt={course.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="relative z-10">
                  <h3 className="text-white font-bold text-lg line-clamp-2">
                    {course.name}
                  </h3>
                  <p className="text-white/80 text-sm">{course.code}</p>
                </div>
                <div className="relative z-10">
                  <p className="text-white/90 text-sm">
                    {course.professor?.firstName} {course.professor?.lastName}
                  </p>
                </div>
              </div>

              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {course._count?.enrollments || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      {course._count?.assignments || 0}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="secondary">{course.departement}</Badge>
                    <Badge variant="outline">{course.semester}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AnimatedPage>
  );
}
