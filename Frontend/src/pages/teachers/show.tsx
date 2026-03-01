import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useShow } from "@refinedev/core";
import type { Teacher, ScheduleEvent } from "@/types";
import { MockSchedule, MockSubjects } from "@/components/constants/Mock-Data";
import { AnimatedPage } from "@/components/ui/animated-page";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  "Actif": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100",
  "En congé": "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100",
  "Retraité": "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100",
};

const TeachersShow = () => {
  const { query } = useShow<Teacher>({ resource: "teachers" });
  const record = query?.data?.data;

  if (!record) return null;

  const teacherSchedule = MockSchedule.filter((s: ScheduleEvent) => s.teacherId === record.id);
  const teacherSubjectIds = [...new Set(teacherSchedule.map((s) => s.subjectId))];
  const teacherSubjects = MockSubjects.filter((s) => teacherSubjectIds.includes(s.id));

  return (
    <AnimatedPage>
      <ShowView>
        <ShowViewHeader title="Détails de l'Enseignant" />

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {record.firstName[0]}{record.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nom complet</p>
                  <p className="font-semibold">{record.firstName} {record.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Matricule</p>
                  <Badge variant="outline">{record.matricule}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <Badge className={cn("border", statusColors[record.status])}>{record.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{record.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Département</p>
                  <Badge variant="secondary">{record.departement}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Grade</p>
                  <p className="font-medium">{record.grade}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Spécialisation</p>
                  <p>{record.specialization}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p>{record.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date d'embauche</p>
                  <p>{record.hireDate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="subjects">
          <TabsList>
            <TabsTrigger value="subjects">Matières Enseignées</TabsTrigger>
            <TabsTrigger value="schedule">Emploi du Temps</TabsTrigger>
          </TabsList>
          <TabsContent value="subjects">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Matières</CardTitle>
              </CardHeader>
              <CardContent>
                {teacherSubjects.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Département</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teacherSubjects.map((subject) => (
                        <TableRow key={subject.id}>
                          <TableCell><Badge>{subject.code}</Badge></TableCell>
                          <TableCell className="font-medium">{subject.name}</TableCell>
                          <TableCell><Badge variant="secondary">{subject.departement}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Aucune matière assignée</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Emploi du Temps</CardTitle>
              </CardHeader>
              <CardContent>
                {teacherSchedule.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Jour</TableHead>
                        <TableHead>Horaire</TableHead>
                        <TableHead>Matière</TableHead>
                        <TableHead>Niveau</TableHead>
                        <TableHead>Salle</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teacherSchedule.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.dayOfWeek}</TableCell>
                          <TableCell>{event.startTime} - {event.endTime}</TableCell>
                          <TableCell>{event.subjectName}</TableCell>
                          <TableCell><Badge variant="outline">{event.level}</Badge></TableCell>
                          <TableCell><Badge variant="outline">{event.room}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Aucun cours programmé</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ShowView>
    </AnimatedPage>
  );
};

export default TeachersShow;
