export type Subject = {
  id: number;
  name: string;
  departement: string;
  description: string;
  code: string;
  createdAt: string;
};

export type Student = {
  id: number;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: "M" | "F";
  departement: string;
  level: "L1" | "L2" | "L3" | "M1" | "M2" | "D";
  status: "Actif" | "Inactif" | "Diplômé" | "Suspendu";
  enrollmentDate: string;
  phone: string;
  address: string;
};

export type Teacher = {
  id: number;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  departement: string;
  specialization: string;
  grade: "Professeur" | "Maître de Conférences" | "Chargé de Cours" | "Assistant";
  status: "Actif" | "En congé" | "Retraité";
  hireDate: string;
  phone: string;
};

export type ScheduleEvent = {
  id: number;
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  teacherId: number;
  teacherName: string;
  room: string;
  dayOfWeek: "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi" | "Samedi";
  startTime: string;
  endTime: string;
  level: string;
  departement: string;
  semester: "S1" | "S2";
};

export type Grade = {
  id: number;
  studentId: number;
  studentName: string;
  studentMatricule: string;
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  note: number;
  coefficient: number;
  semester: "S1" | "S2";
  session: "Normale" | "Rattrapage";
  academicYear: string;
};

export type DashboardStats = {
  totalStudents: number;
  totalTeachers: number;
  totalSubjects: number;
  averageGrade: number;
  successRate: number;
  enrollmentTrend: { month: string; count: number }[];
  gradeDistribution: { range: string; count: number }[];
  departmentDistribution: { departement: string; students: number; teachers: number }[];
  recentActivity: { id: number; type: string; description: string; date: string; actor: string }[];
};
