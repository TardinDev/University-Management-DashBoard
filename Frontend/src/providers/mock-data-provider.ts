import type { DataProvider } from "@refinedev/core";
import {
  MockSubjects,
  MockStudents,
  MockTeachers,
  MockSchedule,
  MockGrades,
  MockCourses,
  MockAnnouncements,
  MockAssignments,
  MockSubmissions,
  MockAcademicYears,
  MockDepartments,
  MockPrograms,
  MockGroups,
  MockAuditLogs,
  MockRooms,
  MockMessages,
  MockExams,
  MockAdminRequests,
  MockAttendances,
  MockResources,
  MockForumPosts,
  MockQuizzes,
  MockQuizAttempts,
  MockPortfolios,
  MockJuryDeliberations,
  MockECTSRecords,
} from "@/components/constants/Mock-Data";

// Deep-clone arrays so mutations don't touch the originals
function clone<T>(arr: T[]): T[] {
  return JSON.parse(JSON.stringify(arr));
}

// In-memory mutable store, keyed by resource name
const store: Record<string, Record<string, unknown>[]> = {
  subjects: clone(MockSubjects),
  students: clone(MockStudents),
  teachers: clone(MockTeachers),
  schedule: clone(MockSchedule),
  grades: clone(MockGrades),
  courses: clone(MockCourses),
  announcements: clone(MockAnnouncements),
  assignments: clone(MockAssignments),
  submissions: clone(MockSubmissions),
  "academic-years": clone(MockAcademicYears),
  departments: clone(MockDepartments),
  programs: clone(MockPrograms),
  groups: clone(MockGroups),
  "audit-logs": clone(MockAuditLogs),
  rooms: clone(MockRooms),
  messages: clone(MockMessages),
  exams: clone(MockExams),
  "admin-requests": clone(MockAdminRequests),
  attendance: clone(MockAttendances),
  resources: clone(MockResources),
  "forum-posts": clone(MockForumPosts),
  quizzes: clone(MockQuizzes),
  "quiz-attempts": clone(MockQuizAttempts),
  portfolios: clone(MockPortfolios),
  "jury-deliberations": clone(MockJuryDeliberations),
  "ects-records": clone(MockECTSRecords),
};

let nextId = 1000;

function getStore(resource: string) {
  if (!store[resource]) store[resource] = [];
  return store[resource];
}

function matchFilter(
  item: Record<string, unknown>,
  field: string,
  operator: string,
  value: unknown,
): boolean {
  const itemVal = item[field];

  switch (operator) {
    case "eq":
      return String(itemVal) === String(value);
    case "ne":
      return String(itemVal) !== String(value);
    case "contains":
      return String(itemVal ?? "")
        .toLowerCase()
        .includes(String(value).toLowerCase());
    case "in":
      return Array.isArray(value)
        ? value.some((v) => String(itemVal) === String(v))
        : false;
    case "gt":
      return Number(itemVal) > Number(value);
    case "lt":
      return Number(itemVal) < Number(value);
    case "gte":
      return Number(itemVal) >= Number(value);
    case "lte":
      return Number(itemVal) <= Number(value);
    default:
      return true;
  }
}

export const mockDataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    let items = [...getStore(resource)];

    // Apply filters
    if (filters) {
      for (const filter of filters) {
        if ("field" in filter && filter.field && filter.operator) {
          items = items.filter((item) =>
            matchFilter(item, filter.field, filter.operator, filter.value),
          );
        }
      }
    }

    // Apply sorting
    if (sorters && sorters.length > 0) {
      items.sort((a, b) => {
        for (const sorter of sorters) {
          const aVal = a[sorter.field];
          const bVal = b[sorter.field];
          const aStr = String(aVal ?? "");
          const bStr = String(bVal ?? "");
          const cmp = aStr.localeCompare(bStr);
          if (cmp !== 0) return sorter.order === "desc" ? -cmp : cmp;
        }
        return 0;
      });
    }

    const total = items.length;

    // Apply pagination
    if (pagination) {
      const { currentPage = 1, pageSize = 10, mode = "server" } = pagination;
      if (mode === "server") {
        const start = (currentPage - 1) * pageSize;
        items = items.slice(start, start + pageSize);
      }
    }

    return { data: items as any[], total };
  },

  getOne: async ({ resource, id }) => {
    const items = getStore(resource);
    const item = items.find((i) => String(i.id) === String(id));
    if (!item) throw new Error(`${resource}/${id} not found`);
    return { data: item as any };
  },

  create: async ({ resource, variables }) => {
    const items = getStore(resource);
    const newItem: Record<string, unknown> = {
      ...(variables as Record<string, unknown>),
    };

    // Generate id if not provided
    if (!newItem.id) {
      nextId++;
      newItem.id = resource === "courses" ? `c${nextId}` : String(nextId);
    }

    // Resource-specific defaults
    if (resource === "courses") {
      newItem.createdAt = newItem.createdAt || new Date().toISOString();
      newItem.joinCode =
        newItem.joinCode ||
        Math.random().toString(36).substring(2, 8).toUpperCase();
      newItem.enrollments = newItem.enrollments || [];
      newItem._count = newItem._count || {
        enrollments: 0,
        assignments: 0,
        announcements: 0,
      };
      // Attach professor info from identity in localStorage
      if (!newItem.professor) {
        try {
          const stored = localStorage.getItem("university_user");
          if (stored) {
            const user = JSON.parse(stored);
            newItem.professorId = user.id;
            newItem.professor = {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            };
          }
        } catch {
          /* ignore */
        }
      }
    }

    if (resource === "announcements") {
      newItem.createdAt = newItem.createdAt || new Date().toISOString();
      if (!newItem.author) {
        try {
          const stored = localStorage.getItem("university_user");
          if (stored) {
            const user = JSON.parse(stored);
            newItem.authorId = user.id;
            newItem.author = {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
            };
          }
        } catch {
          /* ignore */
        }
      }
    }

    if (resource === "assignments") {
      newItem.createdAt = newItem.createdAt || new Date().toISOString();
      newItem._count = newItem._count || { submissions: 0 };
    }

    if (resource === "submissions") {
      newItem.submittedAt = newItem.submittedAt || new Date().toISOString();
      if (!newItem.student) {
        try {
          const stored = localStorage.getItem("university_user");
          if (stored) {
            const user = JSON.parse(stored);
            newItem.studentId = user.id;
            newItem.student = {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
            };
          }
        } catch {
          /* ignore */
        }
      }
    }

    if (resource === "messages") {
      newItem.createdAt = newItem.createdAt || new Date().toISOString();
      newItem.read = newItem.read ?? false;
      if (!newItem.senderId) {
        try {
          const stored = localStorage.getItem("university_user");
          if (stored) {
            const user = JSON.parse(stored);
            newItem.senderId = user.id;
            newItem.senderName = `${user.firstName} ${user.lastName}`;
            newItem.senderRole = user.role;
          }
        } catch { /* ignore */ }
      }
    }

    if (resource === "admin-requests") {
      newItem.createdAt = newItem.createdAt || new Date().toISOString();
      newItem.updatedAt = newItem.updatedAt || new Date().toISOString();
      newItem.status = newItem.status || "En attente";
    }

    if (resource === "forum-posts") {
      newItem.createdAt = newItem.createdAt || new Date().toISOString();
      if (!newItem.authorId) {
        try {
          const stored = localStorage.getItem("university_user");
          if (stored) {
            const user = JSON.parse(stored);
            newItem.authorId = user.id;
            newItem.authorName = `${user.firstName} ${user.lastName}`;
            newItem.authorRole = user.role;
          }
        } catch { /* ignore */ }
      }
    }

    if (resource === "quiz-attempts") {
      newItem.submittedAt = newItem.submittedAt || new Date().toISOString();
    }

    if (resource === "resources") {
      newItem.createdAt = newItem.createdAt || new Date().toISOString();
    }

    items.push(newItem);
    return { data: newItem as any };
  },

  update: async ({ resource, id, variables }) => {
    const items = getStore(resource);
    const idx = items.findIndex((i) => String(i.id) === String(id));
    if (idx === -1) throw new Error(`${resource}/${id} not found`);
    items[idx] = { ...items[idx], ...(variables as Record<string, unknown>) };
    return { data: items[idx] as any };
  },

  deleteOne: async ({ resource, id }) => {
    const items = getStore(resource);
    const idx = items.findIndex((i) => String(i.id) === String(id));
    if (idx === -1) throw new Error(`${resource}/${id} not found`);
    const [removed] = items.splice(idx, 1);
    return { data: removed as any };
  },

  getApiUrl: () => "",
};
