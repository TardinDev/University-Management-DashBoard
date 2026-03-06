import { Authenticated, Refine, type AccessControlProvider } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { dataProvider } from "./providers/data";
import { authProvider } from "./providers/auth";
import { Layout } from "./components/refine-ui/layout/layout";
import {
  Home, Users, GraduationCap, BookOpen, Calendar, Award, Library,
  Building2, DoorOpen, Layers, ClipboardList, FileSearch, Mail,
  MessageSquare, Scale, CreditCard, Briefcase, CalendarDays,
  CheckSquare, HelpCircle, Clock,
} from "lucide-react";
import { lazy, Suspense } from "react";

import DashBoard from "./pages/DashBoard";
import SubjectsList from "./pages/subjects/list";
import SubjectsCreate from "./pages/subjects/create";
import SubjectsEdit from "./pages/subjects/edit";
import SubjectsShow from "./pages/subjects/show";
import StudentsList from "./pages/students/list";
import StudentsCreate from "./pages/students/create";
import StudentsEdit from "./pages/students/edit";
import StudentsShow from "./pages/students/show";
import TeachersList from "./pages/teachers/list";
import TeachersCreate from "./pages/teachers/create";
import TeachersEdit from "./pages/teachers/edit";
import TeachersShow from "./pages/teachers/show";
import SchedulePage from "./pages/schedule/index";
import GradesPage from "./pages/grades/index";

import { SignInForm } from "./components/refine-ui/form/sign-in-form";
import { SignUpForm } from "./components/refine-ui/form/sign-up-form";

import CoursesList from "./pages/courses/list";
import CoursesCreate from "./pages/courses/create";
import CoursesShow from "./pages/courses/show";
import JoinCourse from "./pages/courses/join";

// Lazy-loaded new pages
const AcademicYearsList = lazy(() => import("./pages/academic-years/list"));
const AcademicYearsCreate = lazy(() => import("./pages/academic-years/create"));
const AcademicYearsEdit = lazy(() => import("./pages/academic-years/edit"));
const DepartmentsList = lazy(() => import("./pages/departments/list"));
const DepartmentsCreate = lazy(() => import("./pages/departments/create"));
const DepartmentsShow = lazy(() => import("./pages/departments/show"));
const GroupsList = lazy(() => import("./pages/groups/list"));
const GroupsCreate = lazy(() => import("./pages/groups/create"));
const RoomsList = lazy(() => import("./pages/rooms/list"));
const RoomsCreate = lazy(() => import("./pages/rooms/create"));
const RoomsEdit = lazy(() => import("./pages/rooms/edit"));
const ExamsList = lazy(() => import("./pages/exams/list"));
const ExamsCreate = lazy(() => import("./pages/exams/create"));
const AuditLogsList = lazy(() => import("./pages/audit-logs/list"));
const EmailsPage = lazy(() => import("./pages/emails/index"));
const ECTSPage = lazy(() => import("./pages/ects/index"));
const JuryList = lazy(() => import("./pages/jury/list"));
const JuryShow = lazy(() => import("./pages/jury/show"));
const AdminRequestsList = lazy(() => import("./pages/admin-requests/list"));
const AdminRequestsCreate = lazy(() => import("./pages/admin-requests/create"));
const AdminRequestsShow = lazy(() => import("./pages/admin-requests/show"));
const AttendancePage = lazy(() => import("./pages/attendance/index"));
const AttendanceHistory = lazy(() => import("./pages/attendance/history"));
const QuizzesList = lazy(() => import("./pages/quizzes/list"));
const QuizzesCreate = lazy(() => import("./pages/quizzes/create"));
const QuizzesShow = lazy(() => import("./pages/quizzes/show"));
const QuizTake = lazy(() => import("./pages/quizzes/take"));
const MessagesPage = lazy(() => import("./pages/messages/index"));
const CalendarPage = lazy(() => import("./pages/calendar/index"));
const PortfolioPage = lazy(() => import("./pages/portfolio/index"));
const AvailabilityPage = lazy(() => import("./pages/availability/index"));

function PageLoader() {
  return <div className="animate-pulse p-8"><div className="h-8 bg-muted rounded w-1/3 mb-4" /><div className="h-64 bg-muted rounded" /></div>;
}

const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const role = await authProvider.getPermissions?.({} as never);

    if (role === "ADMIN") return { can: true };

    if (role === "PROFESSOR") {
      if (["courses", "assignments", "announcements", "submissions", "attendance", "quizzes", "resources", "forum-posts", "quiz-attempts", "availability"].includes(resource || "")) {
        return { can: true };
      }
      if (["dashboard", "schedule", "messages"].includes(resource || "")) {
        return { can: true };
      }
      if (["students", "teachers", "subjects", "grades"].includes(resource || "")) {
        if (["list", "show"].includes(action)) return { can: true };
        return { can: false, reason: "Acces reserve aux administrateurs" };
      }
    }

    if (role === "STUDENT") {
      if (["dashboard", "courses", "schedule", "calendar", "portfolio"].includes(resource || "")) {
        if (["list", "show"].includes(action)) return { can: true };
        return { can: false };
      }
      if (resource === "submissions" || resource === "quiz-attempts") {
        if (["list", "show", "create"].includes(action)) return { can: true };
        return { can: false };
      }
      if (resource === "admin-requests") {
        if (["list", "show", "create"].includes(action)) return { can: true };
        return { can: false };
      }
      if (resource === "messages") {
        return { can: true };
      }
      if (resource === "forum-posts") {
        if (["list", "show", "create"].includes(action)) return { can: true };
        return { can: false };
      }
      if (["students", "teachers", "subjects", "grades", "assignments", "announcements"].includes(resource || "")) {
        if (["list", "show"].includes(action)) return { can: true };
        return { can: false, reason: "Acces restreint" };
      }
    }

    return { can: true };
  },
};

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
              accessControlProvider={accessControlProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "zTkgaM-AFAZFH-4ucY0g",
              }}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: { label: "Accueil", icon: <Home /> },
                },
                {
                  name: "courses",
                  list: "/courses",
                  create: "/courses/create",
                  show: "/courses/:id",
                  meta: { label: "Mes Cours", icon: <Library /> },
                },
                {
                  name: "students",
                  list: "/students",
                  create: "/students/create",
                  edit: "/students/edit/:id",
                  show: "/students/show/:id",
                  meta: { label: "Etudiants", icon: <Users /> },
                },
                {
                  name: "teachers",
                  list: "/teachers",
                  create: "/teachers/create",
                  edit: "/teachers/edit/:id",
                  show: "/teachers/show/:id",
                  meta: { label: "Enseignants", icon: <GraduationCap /> },
                },
                {
                  name: "subjects",
                  list: "/subjects",
                  create: "/subjects/create",
                  edit: "/subjects/edit/:id",
                  show: "/subjects/show/:id",
                  meta: { label: "Matieres", icon: <BookOpen /> },
                },
                {
                  name: "schedule",
                  list: "/schedule",
                  meta: { label: "Emploi du Temps", icon: <Calendar /> },
                },
                {
                  name: "grades",
                  list: "/grades",
                  meta: { label: "Notes", icon: <Award /> },
                },
                {
                  name: "academic-years",
                  list: "/academic-years",
                  create: "/academic-years/create",
                  edit: "/academic-years/edit/:id",
                  meta: { label: "Annees Academiques", icon: <CalendarDays /> },
                },
                {
                  name: "departments",
                  list: "/departments",
                  create: "/departments/create",
                  show: "/departments/show/:id",
                  meta: { label: "Departements", icon: <Building2 /> },
                },
                {
                  name: "groups",
                  list: "/groups",
                  create: "/groups/create",
                  meta: { label: "Groupes TD/TP", icon: <Layers /> },
                },
                {
                  name: "rooms",
                  list: "/rooms",
                  create: "/rooms/create",
                  edit: "/rooms/edit/:id",
                  meta: { label: "Salles", icon: <DoorOpen /> },
                },
                {
                  name: "exams",
                  list: "/exams",
                  create: "/exams/create",
                  meta: { label: "Examens", icon: <ClipboardList /> },
                },
                {
                  name: "audit-logs",
                  list: "/audit-logs",
                  meta: { label: "Journal d'Audit", icon: <FileSearch /> },
                },
                {
                  name: "messages",
                  list: "/messages",
                  meta: { label: "Messagerie", icon: <MessageSquare /> },
                },
                {
                  name: "admin-requests",
                  list: "/admin-requests",
                  create: "/admin-requests/create",
                  show: "/admin-requests/show/:id",
                  meta: { label: "Demandes", icon: <HelpCircle /> },
                },
                {
                  name: "jury-deliberations",
                  list: "/jury",
                  show: "/jury/show/:id",
                  meta: { label: "Jury & Deliberations", icon: <Scale /> },
                },
                {
                  name: "ects",
                  list: "/ects",
                  meta: { label: "Credits ECTS", icon: <CreditCard /> },
                },
                {
                  name: "emails",
                  list: "/emails",
                  meta: { label: "Emails", icon: <Mail /> },
                },
                {
                  name: "attendance",
                  list: "/attendance",
                  meta: { label: "Presences", icon: <CheckSquare /> },
                },
                {
                  name: "quizzes",
                  list: "/quizzes",
                  create: "/quizzes/create",
                  show: "/quizzes/show/:id",
                  meta: { label: "Quiz / QCM", icon: <HelpCircle /> },
                },
                {
                  name: "calendar",
                  list: "/calendar",
                  meta: { label: "Calendrier", icon: <CalendarDays /> },
                },
                {
                  name: "portfolio",
                  list: "/portfolio",
                  meta: { label: "Portfolio", icon: <Briefcase /> },
                },
                {
                  name: "availability",
                  list: "/availability",
                  meta: { label: "Disponibilités", icon: <Clock /> },
                },
              ]}
            >
              <Routes>
                {/* Public auth routes */}
                <Route path="/login" element={<SignInForm />} />
                <Route path="/register" element={<SignUpForm />} />

                {/* Protected routes */}
                <Route
                  element={
                    <Authenticated
                      key="auth-layout"
                      fallback={<Navigate to="/login" />}
                    >
                      <Layout>
                        <Suspense fallback={<PageLoader />}>
                          <Outlet />
                        </Suspense>
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route path="/" element={<DashBoard />} />

                  <Route path="/courses">
                    <Route index element={<CoursesList />} />
                    <Route path="create" element={<CoursesCreate />} />
                    <Route path=":id" element={<CoursesShow />} />
                  </Route>

                  <Route path="/join" element={<JoinCourse />} />

                  <Route path="/students">
                    <Route index element={<StudentsList />} />
                    <Route path="create" element={<StudentsCreate />} />
                    <Route path="edit/:id" element={<StudentsEdit />} />
                    <Route path="show/:id" element={<StudentsShow />} />
                  </Route>

                  <Route path="/teachers">
                    <Route index element={<TeachersList />} />
                    <Route path="create" element={<TeachersCreate />} />
                    <Route path="edit/:id" element={<TeachersEdit />} />
                    <Route path="show/:id" element={<TeachersShow />} />
                  </Route>

                  <Route path="/subjects">
                    <Route index element={<SubjectsList />} />
                    <Route path="create" element={<SubjectsCreate />} />
                    <Route path="edit/:id" element={<SubjectsEdit />} />
                    <Route path="show/:id" element={<SubjectsShow />} />
                  </Route>

                  <Route path="/schedule" element={<SchedulePage />} />
                  <Route path="/grades" element={<GradesPage />} />

                  {/* New routes */}
                  <Route path="/academic-years">
                    <Route index element={<AcademicYearsList />} />
                    <Route path="create" element={<AcademicYearsCreate />} />
                    <Route path="edit/:id" element={<AcademicYearsEdit />} />
                  </Route>

                  <Route path="/departments">
                    <Route index element={<DepartmentsList />} />
                    <Route path="create" element={<DepartmentsCreate />} />
                    <Route path="show/:id" element={<DepartmentsShow />} />
                  </Route>

                  <Route path="/groups">
                    <Route index element={<GroupsList />} />
                    <Route path="create" element={<GroupsCreate />} />
                  </Route>

                  <Route path="/rooms">
                    <Route index element={<RoomsList />} />
                    <Route path="create" element={<RoomsCreate />} />
                    <Route path="edit/:id" element={<RoomsEdit />} />
                  </Route>

                  <Route path="/exams">
                    <Route index element={<ExamsList />} />
                    <Route path="create" element={<ExamsCreate />} />
                  </Route>

                  <Route path="/audit-logs" element={<AuditLogsList />} />
                  <Route path="/emails" element={<EmailsPage />} />
                  <Route path="/ects" element={<ECTSPage />} />

                  <Route path="/jury">
                    <Route index element={<JuryList />} />
                    <Route path="show/:id" element={<JuryShow />} />
                  </Route>

                  <Route path="/admin-requests">
                    <Route index element={<AdminRequestsList />} />
                    <Route path="create" element={<AdminRequestsCreate />} />
                    <Route path="show/:id" element={<AdminRequestsShow />} />
                  </Route>

                  <Route path="/attendance">
                    <Route index element={<AttendancePage />} />
                    <Route path="history" element={<AttendanceHistory />} />
                  </Route>

                  <Route path="/quizzes">
                    <Route index element={<QuizzesList />} />
                    <Route path="create" element={<QuizzesCreate />} />
                    <Route path="show/:id" element={<QuizzesShow />} />
                    <Route path="take/:id" element={<QuizTake />} />
                  </Route>

                  <Route path="/messages" element={<MessagesPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/availability" element={<AvailabilityPage />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
