import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useShow } from "@refinedev/core";
import type { Student, Grade, ScheduleEvent } from "@/types";
import { MockGrades, MockSchedule } from "@/components/constants/Mock-Data";
import { AnimatedPage } from "@/components/ui/animated-page";
import { TranscriptGenerator } from "@/components/transcript-generator";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  "Actif": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100",
  "Inactif": "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100",
  "Diplômé": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100",
  "Suspendu": "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100",
};

const StudentsShow = () => {
  const { query } = useShow<Student>({ resource: "students" });
  const record = query?.data?.data;

  if (!record) return null;

  const studentGrades = MockGrades.filter((g: Grade) => g.studentId === record.id);
  const studentSchedule = MockSchedule.filter((s: ScheduleEvent) => s.departement === record.departement && s.level === record.level);

  return (
    <AnimatedPage>
      <ShowView>
        <ShowViewHeader title="Détails de l'Étudiant" />

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
                  <p className="text-sm text-muted-foreground">Niveau</p>
                  <p className="font-medium">{record.level}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date de Naissance</p>
                  <p>{record.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p>{record.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p>{record.address}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {studentGrades.length > 0 && (
          <TranscriptGenerator student={record} grades={studentGrades} className="mb-4" />
        )}

        <Tabs defaultValue="grades">
          <TabsList>
            <TabsTrigger value="grades">Notes</TabsTrigger>
            <TabsTrigger value="schedule">Emploi du Temps</TabsTrigger>
          </TabsList>
          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes de l'Étudiant</CardTitle>
              </CardHeader>
              <CardContent>
                {studentGrades.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Matière</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Coeff.</TableHead>
                        <TableHead>Session</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentGrades.map((grade) => (
                        <TableRow key={grade.id}>
                          <TableCell>{grade.subjectName}</TableCell>
                          <TableCell><Badge variant="outline">{grade.subjectCode}</Badge></TableCell>
                          <TableCell>
                            <span className={cn("font-bold", grade.note >= 10 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                              {grade.note}/20
                            </span>
                          </TableCell>
                          <TableCell>{grade.coefficient}</TableCell>
                          <TableCell><Badge variant="secondary">{grade.session}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Aucune note enregistrée</p>
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
                {studentSchedule.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Jour</TableHead>
                        <TableHead>Horaire</TableHead>
                        <TableHead>Matière</TableHead>
                        <TableHead>Enseignant</TableHead>
                        <TableHead>Salle</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentSchedule.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.dayOfWeek}</TableCell>
                          <TableCell>{event.startTime} - {event.endTime}</TableCell>
                          <TableCell>{event.subjectName}</TableCell>
                          <TableCell>{event.teacherName}</TableCell>
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

export default StudentsShow;
