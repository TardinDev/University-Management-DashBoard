import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

function joinCode() {
  return randomBytes(4).toString("hex").slice(0, 7).toUpperCase();
}

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.announcement.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.courseEnrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.session.deleteMany();
  await prisma.media.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash("admin123", 10);
  const profHash = await bcrypt.hash("prof123", 10);
  const studentHash = await bcrypt.hash("student123", 10);

  // 1. Admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@univ.mg",
      passwordHash: hash,
      firstName: "Admin",
      lastName: "Système",
      role: "ADMIN",
      matricule: "ADM-001",
    },
  });

  // 2. Professors
  const profData = [
    { firstName: "Jean", lastName: "Rakoto", email: "jean.rakoto@univ.mg", departement: "CS", specialization: "Intelligence Artificielle", professorGrade: "Professeur", matricule: "ENS-001" },
    { firstName: "Marie", lastName: "Rabe", email: "marie.rabe@univ.mg", departement: "Math", specialization: "Algèbre", professorGrade: "Maître de Conférences", matricule: "ENS-002" },
    { firstName: "Paul", lastName: "Andria", email: "paul.andria@univ.mg", departement: "Physics", specialization: "Mécanique Quantique", professorGrade: "Professeur", matricule: "ENS-003" },
    { firstName: "Sophie", lastName: "Razafi", email: "sophie.razafi@univ.mg", departement: "Chemistry", specialization: "Chimie Organique", professorGrade: "Chargé de Cours", matricule: "ENS-004" },
  ];

  const professors = [];
  for (const p of profData) {
    const prof = await prisma.user.create({
      data: {
        ...p,
        passwordHash: profHash,
        role: "PROFESSOR",
        professorStatus: "Actif",
        hireDate: "2020-09-01",
      },
    });
    professors.push(prof);
  }

  // 3. Students
  const studentData = [
    { firstName: "Aina", lastName: "Rasoanaivo", email: "aina.r@univ.mg", departement: "CS", level: "L1", gender: "F", matricule: "ETU-2024-001" },
    { firstName: "Hery", lastName: "Randrianasolo", email: "hery.r@univ.mg", departement: "CS", level: "L2", gender: "M", matricule: "ETU-2024-002" },
    { firstName: "Faly", lastName: "Rakotondra", email: "faly.r@univ.mg", departement: "Math", level: "L1", gender: "M", matricule: "ETU-2024-003" },
    { firstName: "Noro", lastName: "Andriamala", email: "noro.a@univ.mg", departement: "Math", level: "L3", gender: "F", matricule: "ETU-2024-004" },
    { firstName: "Tiana", lastName: "Razafind", email: "tiana.r@univ.mg", departement: "Physics", level: "L2", gender: "M", matricule: "ETU-2024-005" },
    { firstName: "Voahangy", lastName: "Ratsimba", email: "voahangy.r@univ.mg", departement: "Physics", level: "M1", gender: "F", matricule: "ETU-2024-006" },
    { firstName: "Lova", lastName: "Ramana", email: "lova.r@univ.mg", departement: "Chemistry", level: "L1", gender: "M", matricule: "ETU-2024-007" },
    { firstName: "Mirana", lastName: "Ravelona", email: "mirana.r@univ.mg", departement: "CS", level: "L3", gender: "F", matricule: "ETU-2024-008" },
    { firstName: "Tsiry", lastName: "Rabear", email: "tsiry.r@univ.mg", departement: "CS", level: "M1", gender: "M", matricule: "ETU-2024-009" },
    { firstName: "Hasina", lastName: "Rako", email: "hasina.r@univ.mg", departement: "Biology", level: "L2", gender: "F", matricule: "ETU-2024-010" },
  ];

  const students = [];
  for (const s of studentData) {
    const student = await prisma.user.create({
      data: {
        ...s,
        passwordHash: studentHash,
        role: "STUDENT",
        studentStatus: "Actif",
        enrollmentDate: "2024-09-01",
        dateOfBirth: "2002-05-15",
        phone: "+261 34 00 000 00",
        address: "Antananarivo, Madagascar",
      },
    });
    students.push(student);
  }

  // 4. Courses
  const coursesData = [
    { name: "Introduction à l'Informatique", code: "CS101", description: "Bases de la programmation et de l'algorithmique", departement: "CS", semester: "S1", professorId: professors[0].id },
    { name: "Algèbre Linéaire", code: "MATH201", description: "Espaces vectoriels, matrices et applications linéaires", departement: "Math", semester: "S1", professorId: professors[1].id },
    { name: "Physique Générale", code: "PHY301", description: "Mécanique newtonienne et thermodynamique", departement: "Physics", semester: "S2", professorId: professors[2].id },
    { name: "Chimie Organique", code: "CHEM101", description: "Introduction aux composés organiques et réactions", departement: "Chemistry", semester: "S1", professorId: professors[3].id },
  ];

  const courses = [];
  for (const c of coursesData) {
    const course = await prisma.course.create({
      data: { ...c, joinCode: joinCode() },
    });
    courses.push(course);
  }

  // 5. Enrollments — enroll students in courses based on department
  const enrollPairs = [
    // CS students in CS course
    [courses[0].id, students[0].id], [courses[0].id, students[1].id],
    [courses[0].id, students[7].id], [courses[0].id, students[8].id],
    // Math students in Math course
    [courses[1].id, students[2].id], [courses[1].id, students[3].id],
    // Physics students in Physics course
    [courses[2].id, students[4].id], [courses[2].id, students[5].id],
    // Chemistry student in Chemistry course
    [courses[3].id, students[6].id],
    // Cross-department: some CS students also in Math
    [courses[1].id, students[0].id], [courses[1].id, students[1].id],
  ];

  for (const [courseId, studentId] of enrollPairs) {
    await prisma.courseEnrollment.create({
      data: { courseId, studentId },
    });
  }

  // 6. Assignments
  const assignmentsData = [
    { courseId: courses[0].id, title: "TP1 — Hello World en Python", description: "Écrire un programme Python qui affiche votre nom et matricule", points: 20, dueDate: new Date("2025-04-15") },
    { courseId: courses[0].id, title: "TP2 — Structures de données", description: "Implémenter une pile et une file en Python", points: 30, dueDate: new Date("2025-05-01") },
    { courseId: courses[1].id, title: "DM1 — Espaces vectoriels", description: "Résoudre les exercices 1 à 5 du chapitre 3", points: 20, dueDate: new Date("2025-04-20") },
    { courseId: courses[2].id, title: "Rapport de TP — Pendule simple", description: "Rédiger le rapport du TP sur le pendule simple", points: 25, dueDate: new Date("2025-04-25") },
  ];

  const assignments = [];
  for (const a of assignmentsData) {
    const assignment = await prisma.assignment.create({ data: a });
    assignments.push(assignment);
  }

  // 7. Submissions — some students submitted
  await prisma.submission.create({
    data: {
      assignmentId: assignments[0].id,
      studentId: students[0].id,
      content: "print('Bonjour, je suis Aina Rasoanaivo, ETU-2024-001')",
      grade: 18,
      feedback: "Excellent travail !",
    },
  });
  await prisma.submission.create({
    data: {
      assignmentId: assignments[0].id,
      studentId: students[1].id,
      content: "print('Hello, Hery Randrianasolo')",
    },
  });

  // 8. Announcements
  await prisma.announcement.create({
    data: {
      courseId: courses[0].id,
      authorId: professors[0].id,
      content: "Bienvenue dans le cours d'Introduction à l'Informatique ! Le premier TP est disponible.",
    },
  });
  await prisma.announcement.create({
    data: {
      courseId: courses[0].id,
      authorId: professors[0].id,
      content: "Rappel : le TP1 est à rendre avant le 15 avril. N'oubliez pas d'inclure votre matricule.",
    },
  });
  await prisma.announcement.create({
    data: {
      courseId: courses[1].id,
      authorId: professors[1].id,
      content: "Le DM1 sur les espaces vectoriels est maintenant disponible. Travail individuel uniquement.",
    },
  });

  console.log("Seed completed!");
  console.log(`  Admin: admin@univ.mg / admin123`);
  console.log(`  Professors: jean.rakoto@univ.mg / prof123 (+ 3 others)`);
  console.log(`  Students: aina.r@univ.mg / student123 (+ 9 others)`);
  console.log(`  Courses: ${courses.map((c) => `${c.code} (join: ${c.joinCode})`).join(", ")}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
