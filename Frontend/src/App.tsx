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
import { Home, Users, GraduationCap, BookOpen, Calendar, Award, Library } from "lucide-react";

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

const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    // Get role from cached identity
    const role = await authProvider.getPermissions?.({} as never);

    // Admin can do everything
    if (role === "ADMIN") return { can: true };

    // Professor: full access to courses, assignments, announcements, submissions
    // Read-only for students, teachers, subjects
    if (role === "PROFESSOR") {
      if (["courses", "assignments", "announcements", "submissions"].includes(resource || "")) {
        return { can: true };
      }
      if (["dashboard", "schedule"].includes(resource || "")) {
        return { can: true };
      }
      // Admin-only resources: limited
      if (["students", "teachers", "subjects", "grades"].includes(resource || "")) {
        if (["list", "show"].includes(action)) return { can: true };
        return { can: false, reason: "Accès réservé aux administrateurs" };
      }
    }

    // Student: courses (list/show), submissions (create/show), join
    if (role === "STUDENT") {
      if (["dashboard", "courses", "schedule"].includes(resource || "")) {
        if (["list", "show"].includes(action)) return { can: true };
        return { can: false };
      }
      if (resource === "submissions") {
        if (["list", "show", "create"].includes(action)) return { can: true };
        return { can: false };
      }
      if (["students", "teachers", "subjects", "grades", "assignments", "announcements"].includes(resource || "")) {
        if (["list", "show"].includes(action)) return { can: true };
        return { can: false, reason: "Accès restreint" };
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
                  meta: {
                    label: "Accueil",
                    icon: <Home />,
                  },
                },
                {
                  name: "courses",
                  list: "/courses",
                  create: "/courses/create",
                  show: "/courses/:id",
                  meta: {
                    label: "Mes Cours",
                    icon: <Library />,
                  },
                },
                {
                  name: "students",
                  list: "/students",
                  create: "/students/create",
                  edit: "/students/edit/:id",
                  show: "/students/show/:id",
                  meta: {
                    label: "Étudiants",
                    icon: <Users />,
                  },
                },
                {
                  name: "teachers",
                  list: "/teachers",
                  create: "/teachers/create",
                  edit: "/teachers/edit/:id",
                  show: "/teachers/show/:id",
                  meta: {
                    label: "Enseignants",
                    icon: <GraduationCap />,
                  },
                },
                {
                  name: "subjects",
                  list: "/subjects",
                  create: "/subjects/create",
                  edit: "/subjects/edit/:id",
                  show: "/subjects/show/:id",
                  meta: {
                    label: "Matières",
                    icon: <BookOpen />,
                  },
                },
                {
                  name: "schedule",
                  list: "/schedule",
                  meta: {
                    label: "Emploi du Temps",
                    icon: <Calendar />,
                  },
                },
                {
                  name: "grades",
                  list: "/grades",
                  meta: {
                    label: "Notes",
                    icon: <Award />,
                  },
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
                        <Outlet />
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
