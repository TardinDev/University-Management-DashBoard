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

export type UserIdentity = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "PROFESSOR" | "STUDENT";
  avatar?: string;
};

export type Course = {
  id: string;
  name: string;
  code: string;
  description?: string;
  coverImage?: string;
  joinCode: string;
  professorId: string;
  departement: string;
  semester: string;
  section?: string;
  createdAt: string;
  professor: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    email?: string;
  };
  enrollments?: Array<{
    id: string;
    student: {
      id: string;
      firstName: string;
      lastName: string;
      avatar?: string;
      email?: string;
      matricule?: string;
    };
  }>;
  _count: {
    enrollments: number;
    assignments: number;
    announcements: number;
  };
};

export type Assignment = {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  dueDate?: string;
  points?: number;
  attachments?: Array<{ url: string; filename: string; type: string }>;
  createdAt: string;
  course?: { id: string; name: string; code: string; professorId?: string };
  submissions?: Submission[];
  _count?: { submissions: number };
};

export type Submission = {
  id: string;
  assignmentId: string;
  studentId: string;
  content?: string;
  attachments?: Array<{ url: string; filename: string; type: string }>;
  grade?: number;
  feedback?: string;
  submittedAt: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    matricule?: string;
    avatar?: string;
  };
  assignment?: { id: string; title: string; points?: number; courseId?: string };
};

export type Announcement = {
  id: string;
  courseId: string;
  authorId: string;
  content: string;
  attachments?: Array<{ url: string; filename: string; type: string }>;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: string;
  };
  course?: { id: string; name: string; code: string };
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
