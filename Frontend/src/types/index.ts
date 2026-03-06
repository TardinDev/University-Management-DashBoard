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

export type AcademicYear = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
};

export type Department = {
  id: number;
  name: string;
  code: string;
  description: string;
  headId?: number;
  headName?: string;
};

export type Program = {
  id: number;
  name: string;
  code: string;
  departmentId: number;
  departmentName: string;
  level: string;
  description: string;
};

export type Group = {
  id: number;
  name: string;
  type: "TD" | "TP";
  courseId: string;
  courseName: string;
  professorId: number;
  professorName: string;
  students: string[];
};

export type AuditLog = {
  id: number;
  userId: number;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  createdAt: string;
};

export type Room = {
  id: number;
  name: string;
  capacity: number;
  type: "Amphi" | "Salle" | "Labo";
  building: string;
  equipment: string[];
  status: "Disponible" | "Occupée" | "Maintenance";
};

export type Message = {
  id: number;
  senderId: string;
  senderName: string;
  senderRole: string;
  receiverId: string;
  receiverName: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt: string;
};

export type Exam = {
  id: number;
  courseId: string;
  courseName: string;
  roomId: number;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "Partiel" | "Final" | "Rattrapage";
  semester: "S1" | "S2";
};

export type AdminRequest = {
  id: number;
  studentId: string;
  studentName: string;
  studentMatricule: string;
  type: string;
  subject: string;
  description: string;
  status: "En attente" | "En cours" | "Approuvée" | "Rejetée";
  response?: string;
  createdAt: string;
  updatedAt: string;
};

export type Attendance = {
  id: number;
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  studentMatricule: string;
  date: string;
  status: "Présent" | "Absent" | "Retard";
  sessionType?: "TD" | "TP" | "CM";
};

export type Resource = {
  id: number;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  uploadedById: string;
  uploadedByName: string;
  createdAt: string;
};

export type ForumPost = {
  id: number;
  courseId: string;
  courseName?: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  title?: string;
  content: string;
  parentId?: number;
  createdAt: string;
  replies?: ForumPost[];
};

export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  points: number;
};

export type Quiz = {
  id: number;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  dueDate?: string;
  duration?: number;
  createdAt: string;
};

export type QuizAttempt = {
  id: number;
  quizId: number;
  quizTitle: string;
  studentId: string;
  studentName: string;
  answers: number[];
  score: number;
  maxScore: number;
  submittedAt: string;
};

export type PortfolioItem = {
  id: number;
  title: string;
  description: string;
  type: "project" | "certificate" | "experience" | "skill";
  date?: string;
  url?: string;
  tags: string[];
};

export type Portfolio = {
  id: number;
  studentId: string;
  title: string;
  description: string;
  items: PortfolioItem[];
};

export type JuryDecision = {
  studentId: number;
  studentName: string;
  studentMatricule: string;
  average: number;
  credits: number;
  decision: "Admis" | "Ajourné" | "Redoublant" | "Exclu";
};

export type JuryDeliberation = {
  id: number;
  academicYearId: number;
  academicYearName: string;
  departmentId: number;
  departmentName: string;
  level: string;
  date: string;
  status: "Planifié" | "En cours" | "Terminé";
  decisions: JuryDecision[];
};

export type ECTSRecord = {
  studentId: number;
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  credits: number;
  validated: boolean;
  semester: "S1" | "S2";
  academicYear: string;
};
