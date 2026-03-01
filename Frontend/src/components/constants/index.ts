export const DEPARTMENTS = [
  "CS",
  "Math",
  "Physics",
  "Chemistry",
  "Biology",
] as const;

export const DEPARTEMENT_OPTIONS = DEPARTMENTS.map((departement) => ({
  value: departement,
  label: departement,
}));

export const LEVELS = ["L1", "L2", "L3", "M1", "M2", "D"] as const;

export const LEVEL_OPTIONS = LEVELS.map((level) => ({
  value: level,
  label: level,
}));

export const STUDENT_STATUSES = ["Actif", "Inactif", "Diplômé", "Suspendu"] as const;

export const STUDENT_STATUS_OPTIONS = STUDENT_STATUSES.map((status) => ({
  value: status,
  label: status,
}));

export const TEACHER_GRADES = [
  "Professeur",
  "Maître de Conférences",
  "Chargé de Cours",
  "Assistant",
] as const;

export const TEACHER_GRADE_OPTIONS = TEACHER_GRADES.map((grade) => ({
  value: grade,
  label: grade,
}));

export const TEACHER_STATUSES = ["Actif", "En congé", "Retraité"] as const;

export const TEACHER_STATUS_OPTIONS = TEACHER_STATUSES.map((status) => ({
  value: status,
  label: status,
}));

export const SEMESTERS = ["S1", "S2"] as const;

export const SEMESTER_OPTIONS = SEMESTERS.map((semester) => ({
  value: semester,
  label: semester,
}));

export const DAYS_OF_WEEK = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
] as const;

export const ACADEMIC_YEARS = [
  "2024-2025",
  "2025-2026",
  "2026-2027",
] as const;

export const ACADEMIC_YEAR_OPTIONS = ACADEMIC_YEARS.map((year) => ({
  value: year,
  label: year,
}));

export const SESSIONS = ["Normale", "Rattrapage"] as const;

export const SESSION_OPTIONS = SESSIONS.map((session) => ({
  value: session,
  label: session,
}));
