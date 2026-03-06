import type { Subject, Student, Teacher, ScheduleEvent, Grade, DashboardStats, Course, Announcement, Assignment, Submission, AcademicYear, Department, Program, Group, AuditLog, Room, Message, Exam, AdminRequest, Attendance, Resource, ForumPost, Quiz, QuizAttempt, Portfolio, JuryDeliberation, ECTSRecord } from "@/types";

const MockSubjects: Subject[] = [
  { id: 1, code: "CS101", name: "Introduction à la Programmation", departement: "CS", description: "Cours fondamental couvrant les bases de la programmation avec Python, incluant les variables, boucles, fonctions et structures de données.", createdAt: "2025-01-15" },
  { id: 2, code: "MATH201", name: "Analyse Mathématique II", departement: "Math", description: "Étude approfondie des intégrales, séries numériques et équations différentielles avec applications en physique et ingénierie.", createdAt: "2025-02-10" },
  { id: 3, code: "PHY301", name: "Mécanique Quantique", departement: "Physics", description: "Introduction aux principes fondamentaux de la mécanique quantique : dualité onde-particule, équation de Schrödinger et atome d'hydrogène.", createdAt: "2025-03-05" },
  { id: 4, code: "CS201", name: "Structures de Données", departement: "CS", description: "Étude des structures de données avancées : arbres, graphes, tables de hachage et algorithmes de tri et recherche.", createdAt: "2025-01-20" },
  { id: 5, code: "CS301", name: "Bases de Données", departement: "CS", description: "Conception et gestion de bases de données relationnelles, SQL avancé, normalisation et optimisation des requêtes.", createdAt: "2025-02-01" },
  { id: 6, code: "MATH101", name: "Algèbre Linéaire", departement: "Math", description: "Espaces vectoriels, matrices, déterminants, valeurs propres et applications aux systèmes d'équations linéaires.", createdAt: "2025-01-10" },
  { id: 7, code: "PHY201", name: "Électromagnétisme", departement: "Physics", description: "Champs électriques et magnétiques, équations de Maxwell, ondes électromagnétiques et applications.", createdAt: "2025-02-15" },
  { id: 8, code: "CHEM101", name: "Chimie Générale", departement: "Chemistry", description: "Principes fondamentaux de la chimie : structure atomique, liaisons chimiques, thermodynamique et cinétique.", createdAt: "2025-01-25" },
  { id: 9, code: "BIO101", name: "Biologie Cellulaire", departement: "Biology", description: "Structure et fonction des cellules, membranes, organites, division cellulaire et communication intercellulaire.", createdAt: "2025-03-01" },
  { id: 10, code: "CS401", name: "Intelligence Artificielle", departement: "CS", description: "Introduction à l'IA : apprentissage automatique, réseaux de neurones, traitement du langage naturel et vision par ordinateur.", createdAt: "2025-03-10" },
  { id: 11, code: "MATH301", name: "Probabilités et Statistiques", departement: "Math", description: "Théorie des probabilités, variables aléatoires, distributions, tests d'hypothèses et régression.", createdAt: "2025-02-20" },
  { id: 12, code: "CHEM201", name: "Chimie Organique", departement: "Chemistry", description: "Étude des composés organiques, réactions de substitution, élimination, addition et mécanismes réactionnels.", createdAt: "2025-03-15" },
];

const MockStudents: Student[] = [
  { id: 1, matricule: "ETU-2024-001", firstName: "Amadou", lastName: "Diallo", email: "amadou.diallo@univ.mg", dateOfBirth: "2002-03-15", gender: "M", departement: "CS", level: "L3", status: "Actif", enrollmentDate: "2022-09-01", phone: "+261 34 12 345 67", address: "Lot IB 123, Antananarivo" },
  { id: 2, matricule: "ETU-2024-002", firstName: "Fatima", lastName: "Benali", email: "fatima.benali@univ.mg", dateOfBirth: "2003-07-22", gender: "F", departement: "Math", level: "L2", status: "Actif", enrollmentDate: "2023-09-01", phone: "+261 34 23 456 78", address: "Rue de l'Indépendance, Antsirabe" },
  { id: 3, matricule: "ETU-2024-003", firstName: "Jean", lastName: "Rakoto", email: "jean.rakoto@univ.mg", dateOfBirth: "2001-11-08", gender: "M", departement: "Physics", level: "M1", status: "Actif", enrollmentDate: "2021-09-01", phone: "+261 34 34 567 89", address: "Lot IV 456, Fianarantsoa" },
  { id: 4, matricule: "ETU-2024-004", firstName: "Aïcha", lastName: "Traoré", email: "aicha.traore@univ.mg", dateOfBirth: "2002-05-30", gender: "F", departement: "CS", level: "L3", status: "Actif", enrollmentDate: "2022-09-01", phone: "+261 34 45 678 90", address: "Rue du Commerce, Mahajanga" },
  { id: 5, matricule: "ETU-2024-005", firstName: "Pierre", lastName: "Randria", email: "pierre.randria@univ.mg", dateOfBirth: "2000-09-12", gender: "M", departement: "Chemistry", level: "M2", status: "Actif", enrollmentDate: "2020-09-01", phone: "+261 34 56 789 01", address: "Lot III 789, Toamasina" },
  { id: 6, matricule: "ETU-2024-006", firstName: "Marie", lastName: "Rabe", email: "marie.rabe@univ.mg", dateOfBirth: "2003-01-18", gender: "F", departement: "Biology", level: "L1", status: "Actif", enrollmentDate: "2024-09-01", phone: "+261 34 67 890 12", address: "Avenue de France, Antananarivo" },
  { id: 7, matricule: "ETU-2024-007", firstName: "Moussa", lastName: "Koné", email: "moussa.kone@univ.mg", dateOfBirth: "2001-06-25", gender: "M", departement: "CS", level: "M1", status: "Actif", enrollmentDate: "2021-09-01", phone: "+261 34 78 901 23", address: "Lot IVG 321, Antananarivo" },
  { id: 8, matricule: "ETU-2024-008", firstName: "Hanta", lastName: "Razafi", email: "hanta.razafi@univ.mg", dateOfBirth: "2002-12-03", gender: "F", departement: "Math", level: "L3", status: "Actif", enrollmentDate: "2022-09-01", phone: "+261 34 89 012 34", address: "Rue Rainizanabololona, Antsirabe" },
  { id: 9, matricule: "ETU-2024-009", firstName: "Ibrahim", lastName: "Sy", email: "ibrahim.sy@univ.mg", dateOfBirth: "2003-04-07", gender: "M", departement: "Physics", level: "L2", status: "Actif", enrollmentDate: "2023-09-01", phone: "+261 34 90 123 45", address: "Lot II 654, Fianarantsoa" },
  { id: 10, matricule: "ETU-2024-010", firstName: "Noëlla", lastName: "Andriana", email: "noella.andriana@univ.mg", dateOfBirth: "2001-08-19", gender: "F", departement: "CS", level: "L3", status: "Diplômé", enrollmentDate: "2021-09-01", phone: "+261 34 01 234 56", address: "Avenue de l'Indépendance, Antananarivo" },
  { id: 11, matricule: "ETU-2024-011", firstName: "Oumar", lastName: "Bah", email: "oumar.bah@univ.mg", dateOfBirth: "2002-10-14", gender: "M", departement: "Chemistry", level: "L2", status: "Actif", enrollmentDate: "2023-09-01", phone: "+261 34 12 345 00", address: "Lot VB 987, Toamasina" },
  { id: 12, matricule: "ETU-2024-012", firstName: "Soa", lastName: "Ravelona", email: "soa.ravelona@univ.mg", dateOfBirth: "2003-02-28", gender: "F", departement: "Biology", level: "L1", status: "Actif", enrollmentDate: "2024-09-01", phone: "+261 34 23 456 00", address: "Rue Ratsimandrava, Antananarivo" },
  { id: 13, matricule: "ETU-2024-013", firstName: "Bakary", lastName: "Cissé", email: "bakary.cisse@univ.mg", dateOfBirth: "2000-07-11", gender: "M", departement: "Math", level: "M2", status: "Actif", enrollmentDate: "2020-09-01", phone: "+261 34 34 567 00", address: "Avenue Andrianampoinimerina, Antsirabe" },
  { id: 14, matricule: "ETU-2024-014", firstName: "Lalao", lastName: "Raharison", email: "lalao.raharison@univ.mg", dateOfBirth: "2002-09-05", gender: "F", departement: "CS", level: "L2", status: "Suspendu", enrollmentDate: "2023-09-01", phone: "+261 34 45 678 00", address: "Lot IA 147, Mahajanga" },
  { id: 15, matricule: "ETU-2024-015", firstName: "Youssouf", lastName: "Diarra", email: "youssouf.diarra@univ.mg", dateOfBirth: "2001-12-20", gender: "M", departement: "Physics", level: "L3", status: "Actif", enrollmentDate: "2022-09-01", phone: "+261 34 56 789 00", address: "Rue Gallieni, Fianarantsoa" },
  { id: 16, matricule: "ETU-2024-016", firstName: "Voahirana", lastName: "Ratsimba", email: "voahirana.ratsimba@univ.mg", dateOfBirth: "2003-05-16", gender: "F", departement: "Chemistry", level: "L1", status: "Actif", enrollmentDate: "2024-09-01", phone: "+261 34 67 890 00", address: "Avenue de la Libération, Toamasina" },
  { id: 17, matricule: "ETU-2024-017", firstName: "Abdoulaye", lastName: "Ndiaye", email: "abdoulaye.ndiaye@univ.mg", dateOfBirth: "2002-01-09", gender: "M", departement: "Biology", level: "L2", status: "Actif", enrollmentDate: "2023-09-01", phone: "+261 34 78 901 00", address: "Lot IIIG 258, Antananarivo" },
  { id: 18, matricule: "ETU-2024-018", firstName: "Fanja", lastName: "Rasolofo", email: "fanja.rasolofo@univ.mg", dateOfBirth: "2001-03-27", gender: "F", departement: "CS", level: "M1", status: "Actif", enrollmentDate: "2021-09-01", phone: "+261 34 89 012 00", address: "Rue Rabearivelo, Antananarivo" },
  { id: 19, matricule: "ETU-2024-019", firstName: "Sékou", lastName: "Touré", email: "sekou.toure@univ.mg", dateOfBirth: "2003-08-02", gender: "M", departement: "Math", level: "L1", status: "Actif", enrollmentDate: "2024-09-01", phone: "+261 34 90 123 00", address: "Avenue du 26 Juin, Antsirabe" },
  { id: 20, matricule: "ETU-2024-020", firstName: "Hasina", lastName: "Ramana", email: "hasina.ramana@univ.mg", dateOfBirth: "2002-06-13", gender: "F", departement: "Physics", level: "L3", status: "Actif", enrollmentDate: "2022-09-01", phone: "+261 34 01 234 00", address: "Lot VIA 369, Fianarantsoa" },
  { id: 21, matricule: "ETU-2024-021", firstName: "Mamadou", lastName: "Camara", email: "mamadou.camara@univ.mg", dateOfBirth: "2001-11-24", gender: "M", departement: "CS", level: "L3", status: "Inactif", enrollmentDate: "2022-09-01", phone: "+261 34 12 000 00", address: "Rue de la Réunion, Antananarivo" },
  { id: 22, matricule: "ETU-2024-022", firstName: "Mialy", lastName: "Andria", email: "mialy.andria@univ.mg", dateOfBirth: "2003-10-06", gender: "F", departement: "Chemistry", level: "L1", status: "Actif", enrollmentDate: "2024-09-01", phone: "+261 34 23 000 00", address: "Avenue de la Paix, Toamasina" },
  { id: 23, matricule: "ETU-2024-023", firstName: "Issa", lastName: "Keita", email: "issa.keita@univ.mg", dateOfBirth: "2002-04-17", gender: "M", departement: "Biology", level: "L2", status: "Actif", enrollmentDate: "2023-09-01", phone: "+261 34 34 000 00", address: "Lot IB 741, Antananarivo" },
  { id: 24, matricule: "ETU-2024-024", firstName: "Tiana", lastName: "Rakotondra", email: "tiana.rakotondra@univ.mg", dateOfBirth: "2000-08-31", gender: "F", departement: "Math", level: "M2", status: "Actif", enrollmentDate: "2020-09-01", phone: "+261 34 45 000 00", address: "Rue Razafindrahety, Antsirabe" },
  { id: 25, matricule: "ETU-2024-025", firstName: "Cheikh", lastName: "Fall", email: "cheikh.fall@univ.mg", dateOfBirth: "2001-02-14", gender: "M", departement: "CS", level: "M1", status: "Actif", enrollmentDate: "2021-09-01", phone: "+261 34 56 000 00", address: "Avenue Rainilaiarivony, Antananarivo" },
];

const MockTeachers: Teacher[] = [
  { id: 1, matricule: "ENS-001", firstName: "Andry", lastName: "Rajoelina", email: "andry.rajoelina@univ.mg", departement: "CS", specialization: "Intelligence Artificielle", grade: "Professeur", status: "Actif", hireDate: "2010-09-01", phone: "+261 34 11 111 11" },
  { id: 2, matricule: "ENS-002", firstName: "Brice", lastName: "Randrianasolo", email: "brice.randrianasolo@univ.mg", departement: "Math", specialization: "Analyse Numérique", grade: "Maître de Conférences", status: "Actif", hireDate: "2012-09-01", phone: "+261 34 22 222 22" },
  { id: 3, matricule: "ENS-003", firstName: "Claire", lastName: "Razafimahefa", email: "claire.razafimahefa@univ.mg", departement: "Physics", specialization: "Physique Quantique", grade: "Professeur", status: "Actif", hireDate: "2008-09-01", phone: "+261 34 33 333 33" },
  { id: 4, matricule: "ENS-004", firstName: "David", lastName: "Rakotobe", email: "david.rakotobe@univ.mg", departement: "CS", specialization: "Génie Logiciel", grade: "Chargé de Cours", status: "Actif", hireDate: "2015-09-01", phone: "+261 34 44 444 44" },
  { id: 5, matricule: "ENS-005", firstName: "Emma", lastName: "Ratsimba", email: "emma.ratsimba@univ.mg", departement: "Chemistry", specialization: "Chimie Organique", grade: "Maître de Conférences", status: "Actif", hireDate: "2013-09-01", phone: "+261 34 55 555 55" },
  { id: 6, matricule: "ENS-006", firstName: "Fabrice", lastName: "Andriamanalina", email: "fabrice.andriamanalina@univ.mg", departement: "Biology", specialization: "Biologie Moléculaire", grade: "Chargé de Cours", status: "Actif", hireDate: "2016-09-01", phone: "+261 34 66 666 66" },
  { id: 7, matricule: "ENS-007", firstName: "Gisèle", lastName: "Rabemananjara", email: "gisele.rabemananjara@univ.mg", departement: "Math", specialization: "Algèbre", grade: "Professeur", status: "Actif", hireDate: "2005-09-01", phone: "+261 34 77 777 77" },
  { id: 8, matricule: "ENS-008", firstName: "Henri", lastName: "Ravelo", email: "henri.ravelo@univ.mg", departement: "Physics", specialization: "Électromagnétisme", grade: "Assistant", status: "Actif", hireDate: "2019-09-01", phone: "+261 34 88 888 88" },
  { id: 9, matricule: "ENS-009", firstName: "Irène", lastName: "Razafindrabe", email: "irene.razafindrabe@univ.mg", departement: "CS", specialization: "Cybersécurité", grade: "Maître de Conférences", status: "En congé", hireDate: "2011-09-01", phone: "+261 34 99 999 99" },
  { id: 10, matricule: "ENS-010", firstName: "Jacques", lastName: "Ramaroson", email: "jacques.ramaroson@univ.mg", departement: "Chemistry", specialization: "Chimie Analytique", grade: "Assistant", status: "Actif", hireDate: "2020-09-01", phone: "+261 34 10 101 01" },
  { id: 11, matricule: "ENS-011", firstName: "Ketaka", lastName: "Raveloson", email: "ketaka.raveloson@univ.mg", departement: "Biology", specialization: "Écologie", grade: "Maître de Conférences", status: "Actif", hireDate: "2014-09-01", phone: "+261 34 20 202 02" },
  { id: 12, matricule: "ENS-012", firstName: "Luc", lastName: "Andrianaivo", email: "luc.andrianaivo@univ.mg", departement: "CS", specialization: "Réseaux Informatiques", grade: "Chargé de Cours", status: "Actif", hireDate: "2017-09-01", phone: "+261 34 30 303 03" },
];

const MockSchedule: ScheduleEvent[] = [
  { id: 1, subjectId: 1, subjectName: "Introduction à la Programmation", subjectCode: "CS101", teacherId: 1, teacherName: "Pr. Rajoelina", room: "Amphi A", dayOfWeek: "Lundi", startTime: "08:00", endTime: "10:00", level: "L1", departement: "CS", semester: "S1" },
  { id: 2, subjectId: 4, subjectName: "Structures de Données", subjectCode: "CS201", teacherId: 4, teacherName: "M. Rakotobe", room: "Salle 201", dayOfWeek: "Lundi", startTime: "10:00", endTime: "12:00", level: "L2", departement: "CS", semester: "S1" },
  { id: 3, subjectId: 6, subjectName: "Algèbre Linéaire", subjectCode: "MATH101", teacherId: 7, teacherName: "Pr. Rabemananjara", room: "Amphi B", dayOfWeek: "Lundi", startTime: "14:00", endTime: "16:00", level: "L1", departement: "Math", semester: "S1" },
  { id: 4, subjectId: 2, subjectName: "Analyse Mathématique II", subjectCode: "MATH201", teacherId: 2, teacherName: "Dr. Randrianasolo", room: "Salle 102", dayOfWeek: "Mardi", startTime: "08:00", endTime: "10:00", level: "L2", departement: "Math", semester: "S1" },
  { id: 5, subjectId: 7, subjectName: "Électromagnétisme", subjectCode: "PHY201", teacherId: 8, teacherName: "M. Ravelo", room: "Labo Physique", dayOfWeek: "Mardi", startTime: "10:00", endTime: "12:00", level: "L2", departement: "Physics", semester: "S1" },
  { id: 6, subjectId: 5, subjectName: "Bases de Données", subjectCode: "CS301", teacherId: 12, teacherName: "M. Andrianaivo", room: "Salle Info 1", dayOfWeek: "Mardi", startTime: "14:00", endTime: "16:00", level: "L3", departement: "CS", semester: "S1" },
  { id: 7, subjectId: 8, subjectName: "Chimie Générale", subjectCode: "CHEM101", teacherId: 5, teacherName: "Dr. Ratsimba", room: "Labo Chimie", dayOfWeek: "Mercredi", startTime: "08:00", endTime: "10:00", level: "L1", departement: "Chemistry", semester: "S1" },
  { id: 8, subjectId: 9, subjectName: "Biologie Cellulaire", subjectCode: "BIO101", teacherId: 6, teacherName: "M. Andriamanalina", room: "Salle 301", dayOfWeek: "Mercredi", startTime: "10:00", endTime: "12:00", level: "L1", departement: "Biology", semester: "S1" },
  { id: 9, subjectId: 3, subjectName: "Mécanique Quantique", subjectCode: "PHY301", teacherId: 3, teacherName: "Pr. Razafimahefa", room: "Amphi C", dayOfWeek: "Mercredi", startTime: "14:00", endTime: "16:00", level: "L3", departement: "Physics", semester: "S1" },
  { id: 10, subjectId: 10, subjectName: "Intelligence Artificielle", subjectCode: "CS401", teacherId: 1, teacherName: "Pr. Rajoelina", room: "Salle Info 2", dayOfWeek: "Jeudi", startTime: "08:00", endTime: "10:00", level: "M1", departement: "CS", semester: "S1" },
  { id: 11, subjectId: 11, subjectName: "Probabilités et Statistiques", subjectCode: "MATH301", teacherId: 2, teacherName: "Dr. Randrianasolo", room: "Salle 103", dayOfWeek: "Jeudi", startTime: "10:00", endTime: "12:00", level: "L3", departement: "Math", semester: "S1" },
  { id: 12, subjectId: 12, subjectName: "Chimie Organique", subjectCode: "CHEM201", teacherId: 10, teacherName: "M. Ramaroson", room: "Labo Chimie", dayOfWeek: "Jeudi", startTime: "14:00", endTime: "16:00", level: "L2", departement: "Chemistry", semester: "S1" },
  { id: 13, subjectId: 1, subjectName: "Introduction à la Programmation", subjectCode: "CS101", teacherId: 4, teacherName: "M. Rakotobe", room: "Salle Info 1", dayOfWeek: "Vendredi", startTime: "08:00", endTime: "10:00", level: "L1", departement: "CS", semester: "S1" },
  { id: 14, subjectId: 9, subjectName: "Biologie Cellulaire", subjectCode: "BIO101", teacherId: 11, teacherName: "Dr. Raveloson", room: "Labo Bio", dayOfWeek: "Vendredi", startTime: "10:00", endTime: "12:00", level: "L1", departement: "Biology", semester: "S1" },
  { id: 15, subjectId: 6, subjectName: "Algèbre Linéaire", subjectCode: "MATH101", teacherId: 7, teacherName: "Pr. Rabemananjara", room: "Salle 104", dayOfWeek: "Vendredi", startTime: "14:00", endTime: "16:00", level: "L1", departement: "Math", semester: "S1" },
  { id: 16, subjectId: 5, subjectName: "Bases de Données", subjectCode: "CS301", teacherId: 12, teacherName: "M. Andrianaivo", room: "Salle Info 2", dayOfWeek: "Samedi", startTime: "08:00", endTime: "10:00", level: "L3", departement: "CS", semester: "S1" },
  { id: 17, subjectId: 3, subjectName: "Mécanique Quantique", subjectCode: "PHY301", teacherId: 3, teacherName: "Pr. Razafimahefa", room: "Labo Physique", dayOfWeek: "Samedi", startTime: "10:00", endTime: "12:00", level: "L3", departement: "Physics", semester: "S1" },
];

const MockGrades: Grade[] = [
  { id: 1, studentId: 1, studentName: "Amadou Diallo", studentMatricule: "ETU-2024-001", subjectId: 1, subjectName: "Introduction à la Programmation", subjectCode: "CS101", note: 16, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 2, studentId: 1, studentName: "Amadou Diallo", studentMatricule: "ETU-2024-001", subjectId: 4, subjectName: "Structures de Données", subjectCode: "CS201", note: 14, coefficient: 4, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 3, studentId: 1, studentName: "Amadou Diallo", studentMatricule: "ETU-2024-001", subjectId: 5, subjectName: "Bases de Données", subjectCode: "CS301", note: 15, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 4, studentId: 2, studentName: "Fatima Benali", studentMatricule: "ETU-2024-002", subjectId: 6, subjectName: "Algèbre Linéaire", subjectCode: "MATH101", note: 17, coefficient: 4, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 5, studentId: 2, studentName: "Fatima Benali", studentMatricule: "ETU-2024-002", subjectId: 2, subjectName: "Analyse Mathématique II", subjectCode: "MATH201", note: 13, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 6, studentId: 3, studentName: "Jean Rakoto", studentMatricule: "ETU-2024-003", subjectId: 3, subjectName: "Mécanique Quantique", subjectCode: "PHY301", note: 12, coefficient: 4, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 7, studentId: 3, studentName: "Jean Rakoto", studentMatricule: "ETU-2024-003", subjectId: 7, subjectName: "Électromagnétisme", subjectCode: "PHY201", note: 11, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 8, studentId: 4, studentName: "Aïcha Traoré", studentMatricule: "ETU-2024-004", subjectId: 1, subjectName: "Introduction à la Programmation", subjectCode: "CS101", note: 18, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 9, studentId: 4, studentName: "Aïcha Traoré", studentMatricule: "ETU-2024-004", subjectId: 5, subjectName: "Bases de Données", subjectCode: "CS301", note: 15, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 10, studentId: 5, studentName: "Pierre Randria", studentMatricule: "ETU-2024-005", subjectId: 8, subjectName: "Chimie Générale", subjectCode: "CHEM101", note: 14, coefficient: 4, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 11, studentId: 5, studentName: "Pierre Randria", studentMatricule: "ETU-2024-005", subjectId: 12, subjectName: "Chimie Organique", subjectCode: "CHEM201", note: 16, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 12, studentId: 6, studentName: "Marie Rabe", studentMatricule: "ETU-2024-006", subjectId: 9, subjectName: "Biologie Cellulaire", subjectCode: "BIO101", note: 15, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 13, studentId: 7, studentName: "Moussa Koné", studentMatricule: "ETU-2024-007", subjectId: 10, subjectName: "Intelligence Artificielle", subjectCode: "CS401", note: 17, coefficient: 4, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 14, studentId: 7, studentName: "Moussa Koné", studentMatricule: "ETU-2024-007", subjectId: 4, subjectName: "Structures de Données", subjectCode: "CS201", note: 13, coefficient: 4, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 15, studentId: 8, studentName: "Hanta Razafi", studentMatricule: "ETU-2024-008", subjectId: 11, subjectName: "Probabilités et Statistiques", subjectCode: "MATH301", note: 16, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 16, studentId: 8, studentName: "Hanta Razafi", studentMatricule: "ETU-2024-008", subjectId: 6, subjectName: "Algèbre Linéaire", subjectCode: "MATH101", note: 14, coefficient: 4, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 17, studentId: 9, studentName: "Ibrahim Sy", studentMatricule: "ETU-2024-009", subjectId: 7, subjectName: "Électromagnétisme", subjectCode: "PHY201", note: 9, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 18, studentId: 9, studentName: "Ibrahim Sy", studentMatricule: "ETU-2024-009", subjectId: 3, subjectName: "Mécanique Quantique", subjectCode: "PHY301", note: 8, coefficient: 4, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 19, studentId: 10, studentName: "Noëlla Andriana", studentMatricule: "ETU-2024-010", subjectId: 1, subjectName: "Introduction à la Programmation", subjectCode: "CS101", note: 19, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 20, studentId: 10, studentName: "Noëlla Andriana", studentMatricule: "ETU-2024-010", subjectId: 10, subjectName: "Intelligence Artificielle", subjectCode: "CS401", note: 17, coefficient: 4, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 21, studentId: 11, studentName: "Oumar Bah", studentMatricule: "ETU-2024-011", subjectId: 8, subjectName: "Chimie Générale", subjectCode: "CHEM101", note: 10, coefficient: 4, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 22, studentId: 12, studentName: "Soa Ravelona", studentMatricule: "ETU-2024-012", subjectId: 9, subjectName: "Biologie Cellulaire", subjectCode: "BIO101", note: 13, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 23, studentId: 13, studentName: "Bakary Cissé", studentMatricule: "ETU-2024-013", subjectId: 2, subjectName: "Analyse Mathématique II", subjectCode: "MATH201", note: 18, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 24, studentId: 13, studentName: "Bakary Cissé", studentMatricule: "ETU-2024-013", subjectId: 11, subjectName: "Probabilités et Statistiques", subjectCode: "MATH301", note: 16, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 25, studentId: 14, studentName: "Lalao Raharison", studentMatricule: "ETU-2024-014", subjectId: 1, subjectName: "Introduction à la Programmation", subjectCode: "CS101", note: 7, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 26, studentId: 15, studentName: "Youssouf Diarra", studentMatricule: "ETU-2024-015", subjectId: 3, subjectName: "Mécanique Quantique", subjectCode: "PHY301", note: 14, coefficient: 4, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 27, studentId: 15, studentName: "Youssouf Diarra", studentMatricule: "ETU-2024-015", subjectId: 7, subjectName: "Électromagnétisme", subjectCode: "PHY201", note: 12, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 28, studentId: 16, studentName: "Voahirana Ratsimba", studentMatricule: "ETU-2024-016", subjectId: 8, subjectName: "Chimie Générale", subjectCode: "CHEM101", note: 15, coefficient: 4, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 29, studentId: 17, studentName: "Abdoulaye Ndiaye", studentMatricule: "ETU-2024-017", subjectId: 9, subjectName: "Biologie Cellulaire", subjectCode: "BIO101", note: 11, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 30, studentId: 18, studentName: "Fanja Rasolofo", studentMatricule: "ETU-2024-018", subjectId: 10, subjectName: "Intelligence Artificielle", subjectCode: "CS401", note: 16, coefficient: 4, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 31, studentId: 18, studentName: "Fanja Rasolofo", studentMatricule: "ETU-2024-018", subjectId: 5, subjectName: "Bases de Données", subjectCode: "CS301", note: 14, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 32, studentId: 19, studentName: "Sékou Touré", studentMatricule: "ETU-2024-019", subjectId: 6, subjectName: "Algèbre Linéaire", subjectCode: "MATH101", note: 12, coefficient: 4, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 33, studentId: 20, studentName: "Hasina Ramana", studentMatricule: "ETU-2024-020", subjectId: 3, subjectName: "Mécanique Quantique", subjectCode: "PHY301", note: 15, coefficient: 4, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 34, studentId: 20, studentName: "Hasina Ramana", studentMatricule: "ETU-2024-020", subjectId: 7, subjectName: "Électromagnétisme", subjectCode: "PHY201", note: 13, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 35, studentId: 21, studentName: "Mamadou Camara", studentMatricule: "ETU-2024-021", subjectId: 4, subjectName: "Structures de Données", subjectCode: "CS201", note: 6, coefficient: 4, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 36, studentId: 22, studentName: "Mialy Andria", studentMatricule: "ETU-2024-022", subjectId: 8, subjectName: "Chimie Générale", subjectCode: "CHEM101", note: 14, coefficient: 4, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 37, studentId: 23, studentName: "Issa Keita", studentMatricule: "ETU-2024-023", subjectId: 9, subjectName: "Biologie Cellulaire", subjectCode: "BIO101", note: 16, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 38, studentId: 24, studentName: "Tiana Rakotondra", studentMatricule: "ETU-2024-024", subjectId: 11, subjectName: "Probabilités et Statistiques", subjectCode: "MATH301", note: 18, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 39, studentId: 24, studentName: "Tiana Rakotondra", studentMatricule: "ETU-2024-024", subjectId: 2, subjectName: "Analyse Mathématique II", subjectCode: "MATH201", note: 17, coefficient: 3, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 40, studentId: 25, studentName: "Cheikh Fall", studentMatricule: "ETU-2024-025", subjectId: 10, subjectName: "Intelligence Artificielle", subjectCode: "CS401", note: 15, coefficient: 4, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 41, studentId: 25, studentName: "Cheikh Fall", studentMatricule: "ETU-2024-025", subjectId: 4, subjectName: "Structures de Données", subjectCode: "CS201", note: 12, coefficient: 4, semester: "S1", session: "Normale", academicYear: "2025-2026" },
  { id: 42, studentId: 9, studentName: "Ibrahim Sy", studentMatricule: "ETU-2024-009", subjectId: 7, subjectName: "Électromagnétisme", subjectCode: "PHY201", note: 11, coefficient: 3, semester: "S1", session: "Rattrapage", academicYear: "2025-2026" },
  { id: 43, studentId: 9, studentName: "Ibrahim Sy", studentMatricule: "ETU-2024-009", subjectId: 3, subjectName: "Mécanique Quantique", subjectCode: "PHY301", note: 10, coefficient: 4, semester: "S1", session: "Rattrapage", academicYear: "2025-2026" },
  { id: 44, studentId: 14, studentName: "Lalao Raharison", studentMatricule: "ETU-2024-014", subjectId: 1, subjectName: "Introduction à la Programmation", subjectCode: "CS101", note: 10, coefficient: 3, semester: "S1", session: "Rattrapage", academicYear: "2025-2026" },
  { id: 45, studentId: 21, studentName: "Mamadou Camara", studentMatricule: "ETU-2024-021", subjectId: 4, subjectName: "Structures de Données", subjectCode: "CS201", note: 9, coefficient: 4, semester: "S1", session: "Rattrapage", academicYear: "2025-2026" },
];

const MockDashboardStats: DashboardStats = {
  totalStudents: 25,
  totalTeachers: 12,
  totalSubjects: 12,
  averageGrade: 13.8,
  successRate: 82,
  enrollmentTrend: [
    { month: "Sep", count: 180 },
    { month: "Oct", count: 195 },
    { month: "Nov", count: 210 },
    { month: "Dec", count: 205 },
    { month: "Jan", count: 220 },
    { month: "Fev", count: 235 },
    { month: "Mar", count: 248 },
  ],
  gradeDistribution: [
    { range: "0-4", count: 0 },
    { range: "5-7", count: 3 },
    { range: "8-9", count: 4 },
    { range: "10-11", count: 6 },
    { range: "12-13", count: 8 },
    { range: "14-15", count: 10 },
    { range: "16-17", count: 9 },
    { range: "18-20", count: 5 },
  ],
  departmentDistribution: [
    { departement: "CS", students: 9, teachers: 4 },
    { departement: "Math", students: 5, teachers: 2 },
    { departement: "Physics", students: 4, teachers: 2 },
    { departement: "Chemistry", students: 4, teachers: 2 },
    { departement: "Biology", students: 3, teachers: 2 },
  ],
  recentActivity: [
    { id: 1, type: "inscription", description: "Nouvel étudiant inscrit en L1 CS", date: "2026-02-28", actor: "Système" },
    { id: 2, type: "note", description: "Notes du partiel CS301 publiées", date: "2026-02-27", actor: "Pr. Rajoelina" },
    { id: 3, type: "emploi_du_temps", description: "Modification emploi du temps L2 Math", date: "2026-02-26", actor: "Administration" },
    { id: 4, type: "note", description: "Notes du TP PHY201 saisies", date: "2026-02-25", actor: "M. Ravelo" },
    { id: 5, type: "inscription", description: "3 étudiants transférés en M1", date: "2026-02-24", actor: "Scolarité" },
    { id: 6, type: "emploi_du_temps", description: "Ajout cours MATH301 le samedi", date: "2026-02-23", actor: "Administration" },
  ],
};

// Demo professor (id "2") = Jean Rakoto, Demo student (id "3") = Aina Rasoanirina
const MockCourses: Course[] = [
  {
    id: "c1", name: "Introduction à la Programmation", code: "CS101",
    description: "Cours fondamental couvrant les bases de la programmation avec Python.",
    joinCode: "CS101AB", professorId: "2", departement: "CS", semester: "S1", createdAt: "2025-09-01",
    professor: { id: "2", firstName: "Jean", lastName: "Rakoto", email: "jean.rakoto@univ.mg" },
    enrollments: [
      { id: "e1", student: { id: "3", firstName: "Aina", lastName: "Rasoanirina", email: "aina.r@univ.mg", matricule: "ETU-2024-003" } },
      { id: "e2", student: { id: "4", firstName: "Aïcha", lastName: "Traoré", email: "aicha.traore@univ.mg", matricule: "ETU-2024-004" } },
      { id: "e3", student: { id: "7", firstName: "Moussa", lastName: "Koné", email: "moussa.kone@univ.mg", matricule: "ETU-2024-007" } },
      { id: "e4", student: { id: "18", firstName: "Fanja", lastName: "Rasolofo", email: "fanja.rasolofo@univ.mg", matricule: "ETU-2024-018" } },
    ],
    _count: { enrollments: 4, assignments: 2, announcements: 3 },
  },
  {
    id: "c2", name: "Structures de Données", code: "CS201",
    description: "Étude des structures de données avancées : arbres, graphes, tables de hachage.",
    joinCode: "CS201XY", professorId: "2", departement: "CS", semester: "S1", createdAt: "2025-09-01",
    professor: { id: "2", firstName: "Jean", lastName: "Rakoto", email: "jean.rakoto@univ.mg" },
    enrollments: [
      { id: "e5", student: { id: "3", firstName: "Aina", lastName: "Rasoanirina", email: "aina.r@univ.mg", matricule: "ETU-2024-003" } },
      { id: "e6", student: { id: "1", firstName: "Amadou", lastName: "Diallo", email: "amadou.diallo@univ.mg", matricule: "ETU-2024-001" } },
      { id: "e7", student: { id: "7", firstName: "Moussa", lastName: "Koné", email: "moussa.kone@univ.mg", matricule: "ETU-2024-007" } },
    ],
    _count: { enrollments: 3, assignments: 2, announcements: 2 },
  },
  {
    id: "c3", name: "Bases de Données", code: "CS301",
    description: "Conception et gestion de bases de données relationnelles, SQL avancé.",
    joinCode: "CS301QR", professorId: "2", departement: "CS", semester: "S2", createdAt: "2025-09-15",
    professor: { id: "2", firstName: "Jean", lastName: "Rakoto", email: "jean.rakoto@univ.mg" },
    enrollments: [
      { id: "e8", student: { id: "3", firstName: "Aina", lastName: "Rasoanirina", email: "aina.r@univ.mg", matricule: "ETU-2024-003" } },
      { id: "e9", student: { id: "4", firstName: "Aïcha", lastName: "Traoré", email: "aicha.traore@univ.mg", matricule: "ETU-2024-004" } },
      { id: "e10", student: { id: "18", firstName: "Fanja", lastName: "Rasolofo", email: "fanja.rasolofo@univ.mg", matricule: "ETU-2024-018" } },
      { id: "e11", student: { id: "25", firstName: "Cheikh", lastName: "Fall", email: "cheikh.fall@univ.mg", matricule: "ETU-2024-025" } },
      { id: "e12", student: { id: "1", firstName: "Amadou", lastName: "Diallo", email: "amadou.diallo@univ.mg", matricule: "ETU-2024-001" } },
    ],
    _count: { enrollments: 5, assignments: 1, announcements: 1 },
  },
  {
    id: "c4", name: "Intelligence Artificielle", code: "CS401",
    description: "Introduction à l'IA : apprentissage automatique, réseaux de neurones.",
    joinCode: "CS401AI", professorId: "2", departement: "CS", semester: "S2", createdAt: "2025-10-01",
    professor: { id: "2", firstName: "Jean", lastName: "Rakoto", email: "jean.rakoto@univ.mg" },
    enrollments: [
      { id: "e13", student: { id: "7", firstName: "Moussa", lastName: "Koné", email: "moussa.kone@univ.mg", matricule: "ETU-2024-007" } },
      { id: "e14", student: { id: "18", firstName: "Fanja", lastName: "Rasolofo", email: "fanja.rasolofo@univ.mg", matricule: "ETU-2024-018" } },
      { id: "e15", student: { id: "25", firstName: "Cheikh", lastName: "Fall", email: "cheikh.fall@univ.mg", matricule: "ETU-2024-025" } },
    ],
    _count: { enrollments: 3, assignments: 1, announcements: 2 },
  },
  {
    id: "c5", name: "Algèbre Linéaire", code: "MATH101",
    description: "Espaces vectoriels, matrices, déterminants, valeurs propres.",
    joinCode: "MAT1LN", professorId: "10", departement: "Math", semester: "S1", createdAt: "2025-09-01",
    professor: { id: "10", firstName: "Brice", lastName: "Randrianasolo", email: "brice.randrianasolo@univ.mg" },
    enrollments: [
      { id: "e16", student: { id: "2", firstName: "Fatima", lastName: "Benali", email: "fatima.benali@univ.mg", matricule: "ETU-2024-002" } },
      { id: "e17", student: { id: "8", firstName: "Hanta", lastName: "Razafi", email: "hanta.razafi@univ.mg", matricule: "ETU-2024-008" } },
      { id: "e18", student: { id: "19", firstName: "Sékou", lastName: "Touré", email: "sekou.toure@univ.mg", matricule: "ETU-2024-019" } },
    ],
    _count: { enrollments: 3, assignments: 0, announcements: 0 },
  },
  {
    id: "c6", name: "Mécanique Quantique", code: "PHY301",
    description: "Dualité onde-particule, équation de Schrödinger et atome d'hydrogène.",
    joinCode: "PHY3MQ", professorId: "11", departement: "Physics", semester: "S1", createdAt: "2025-09-01",
    professor: { id: "11", firstName: "Claire", lastName: "Razafimahefa", email: "claire.razafimahefa@univ.mg" },
    enrollments: [
      { id: "e19", student: { id: "9", firstName: "Ibrahim", lastName: "Sy", email: "ibrahim.sy@univ.mg", matricule: "ETU-2024-009" } },
      { id: "e20", student: { id: "15", firstName: "Youssouf", lastName: "Diarra", email: "youssouf.diarra@univ.mg", matricule: "ETU-2024-015" } },
      { id: "e21", student: { id: "20", firstName: "Hasina", lastName: "Ramana", email: "hasina.ramana@univ.mg", matricule: "ETU-2024-020" } },
    ],
    _count: { enrollments: 3, assignments: 0, announcements: 0 },
  },
];

const MockAnnouncements: Announcement[] = [
  {
    id: "a1", courseId: "c1", authorId: "2", content: "Bienvenue dans le cours d'Introduction à la Programmation ! Le premier TP aura lieu la semaine prochaine. Assurez-vous d'avoir installé Python 3.12 sur vos machines.",
    createdAt: "2025-09-02T09:00:00Z",
    author: { id: "2", firstName: "Jean", lastName: "Rakoto", role: "PROFESSOR" },
  },
  {
    id: "a2", courseId: "c1", authorId: "2", content: "Rappel : l'examen partiel de programmation aura lieu le 15 novembre. Il portera sur les chapitres 1 à 5 (variables, boucles, fonctions, listes, dictionnaires).",
    createdAt: "2025-10-28T14:30:00Z",
    author: { id: "2", firstName: "Jean", lastName: "Rakoto", role: "PROFESSOR" },
  },
  {
    id: "a3", courseId: "c1", authorId: "2", content: "Les notes du TP1 sont disponibles. La moyenne de la classe est de 14.2/20. Bon travail !",
    createdAt: "2025-11-05T10:00:00Z",
    author: { id: "2", firstName: "Jean", lastName: "Rakoto", role: "PROFESSOR" },
  },
  {
    id: "a4", courseId: "c2", authorId: "2", content: "Le cours sur les arbres binaires est reporté au mercredi. Révisez les listes chaînées en attendant.",
    createdAt: "2025-10-15T08:00:00Z",
    author: { id: "2", firstName: "Jean", lastName: "Rakoto", role: "PROFESSOR" },
  },
  {
    id: "a5", courseId: "c2", authorId: "2", content: "Nouveau support de cours disponible : 'Tables de hachage et résolution de collisions'. Consultez la section Travaux.",
    createdAt: "2025-11-10T16:00:00Z",
    author: { id: "2", firstName: "Jean", lastName: "Rakoto", role: "PROFESSOR" },
  },
  {
    id: "a6", courseId: "c3", authorId: "2", content: "Installation de PostgreSQL obligatoire avant le prochain TP. Suivez le guide partagé par email.",
    createdAt: "2025-10-01T09:00:00Z",
    author: { id: "2", firstName: "Jean", lastName: "Rakoto", role: "PROFESSOR" },
  },
  {
    id: "a7", courseId: "c4", authorId: "2", content: "Conférence invitée sur le Deep Learning ce vendredi à 14h en Amphi A. Présence fortement recommandée.",
    createdAt: "2025-11-18T11:00:00Z",
    author: { id: "2", firstName: "Jean", lastName: "Rakoto", role: "PROFESSOR" },
  },
  {
    id: "a8", courseId: "c4", authorId: "2", content: "Le projet final d'IA est à rendre pour le 20 décembre. Groupes de 2-3 étudiants. Sujets disponibles en section Travaux.",
    createdAt: "2025-11-25T09:30:00Z",
    author: { id: "2", firstName: "Jean", lastName: "Rakoto", role: "PROFESSOR" },
  },
];

const MockAssignments: Assignment[] = [
  {
    id: "as1", courseId: "c1", title: "TP1 — Variables et boucles",
    description: "Écrire un programme Python qui calcule la factorielle d'un nombre et affiche la table de multiplication.",
    dueDate: "2025-10-15T23:59:00Z", points: 20, createdAt: "2025-09-20T08:00:00Z",
    _count: { submissions: 4 },
  },
  {
    id: "as2", courseId: "c1", title: "TP2 — Fonctions et listes",
    description: "Implémenter les fonctions de tri (insertion, sélection) et une recherche dichotomique.",
    dueDate: "2025-11-30T23:59:00Z", points: 20, createdAt: "2025-11-01T08:00:00Z",
    _count: { submissions: 2 },
  },
  {
    id: "as3", courseId: "c2", title: "TP — Listes chaînées",
    description: "Implémenter une liste chaînée simple avec insertion, suppression et recherche.",
    dueDate: "2025-10-25T23:59:00Z", points: 20, createdAt: "2025-10-05T08:00:00Z",
    _count: { submissions: 3 },
  },
  {
    id: "as4", courseId: "c2", title: "TP — Arbres binaires de recherche",
    description: "Implémenter un ABR avec insertion, parcours (infixe, préfixe, postfixe) et suppression.",
    dueDate: "2026-04-01T23:59:00Z", points: 25, createdAt: "2025-11-15T08:00:00Z",
    _count: { submissions: 0 },
  },
  {
    id: "as5", courseId: "c3", title: "TP — Requêtes SQL avancées",
    description: "Écrire des requêtes avec jointures, sous-requêtes et fonctions d'agrégation sur la base universitaire.",
    dueDate: "2025-11-20T23:59:00Z", points: 20, createdAt: "2025-10-20T08:00:00Z",
    _count: { submissions: 3 },
  },
  {
    id: "as6", courseId: "c4", title: "Projet — Classification d'images",
    description: "Entraîner un réseau de neurones convolutif pour classifier des images CIFAR-10. Rapport + code à rendre.",
    dueDate: "2026-05-20T23:59:00Z", points: 40, createdAt: "2025-11-25T08:00:00Z",
    _count: { submissions: 1 },
  },
];

const MockSubmissions: Submission[] = [
  // Student demo (id "3") submissions
  {
    id: "s1", assignmentId: "as1", studentId: "3", content: "Voici mon code pour la factorielle et la table de multiplication.",
    submittedAt: "2025-10-14T18:30:00Z", grade: 16, feedback: "Bon travail, code propre. Attention à la gestion des entrées négatives.",
    student: { id: "3", firstName: "Aina", lastName: "Rasoanirina", matricule: "ETU-2024-003" },
  },
  {
    id: "s2", assignmentId: "as3", studentId: "3", content: "Implémentation de la liste chaînée avec tests unitaires.",
    submittedAt: "2025-10-24T20:00:00Z", grade: 18, feedback: "Excellent ! Tests très complets.",
    student: { id: "3", firstName: "Aina", lastName: "Rasoanirina", matricule: "ETU-2024-003" },
  },
  {
    id: "s3", assignmentId: "as5", studentId: "3", content: "Requêtes SQL avec jointures et agrégations.",
    submittedAt: "2025-11-19T22:00:00Z", grade: 14, feedback: "Correct mais les sous-requêtes pourraient être optimisées.",
    student: { id: "3", firstName: "Aina", lastName: "Rasoanirina", matricule: "ETU-2024-003" },
  },
  // Other students
  {
    id: "s4", assignmentId: "as1", studentId: "4", content: "Programme factorielle et table de multiplication.",
    submittedAt: "2025-10-15T10:00:00Z", grade: 14, feedback: "Bien mais manque de commentaires.",
    student: { id: "4", firstName: "Aïcha", lastName: "Traoré", matricule: "ETU-2024-004" },
  },
  {
    id: "s5", assignmentId: "as1", studentId: "7", content: "Factorielle récursive et itérative + table de multiplication.",
    submittedAt: "2025-10-13T15:00:00Z", grade: 19, feedback: "Travail remarquable, approche récursive très bien maîtrisée.",
    student: { id: "7", firstName: "Moussa", lastName: "Koné", matricule: "ETU-2024-007" },
  },
  {
    id: "s6", assignmentId: "as1", studentId: "18", content: "Mon programme Python pour le TP1.",
    submittedAt: "2025-10-15T22:45:00Z",
    student: { id: "18", firstName: "Fanja", lastName: "Rasolofo", matricule: "ETU-2024-018" },
  },
  {
    id: "s7", assignmentId: "as3", studentId: "1", content: "Liste chaînée en C avec allocation dynamique.",
    submittedAt: "2025-10-25T08:00:00Z", grade: 15, feedback: "Bien. Pensez à libérer la mémoire.",
    student: { id: "1", firstName: "Amadou", lastName: "Diallo", matricule: "ETU-2024-001" },
  },
  {
    id: "s8", assignmentId: "as3", studentId: "7", content: "Liste chaînée avec itérateur personnalisé.",
    submittedAt: "2025-10-23T14:00:00Z",
    student: { id: "7", firstName: "Moussa", lastName: "Koné", matricule: "ETU-2024-007" },
  },
  {
    id: "s9", assignmentId: "as2", studentId: "3", content: "Implémentation des algorithmes de tri et recherche dichotomique.",
    submittedAt: "2025-11-28T16:00:00Z",
    student: { id: "3", firstName: "Aina", lastName: "Rasoanirina", matricule: "ETU-2024-003" },
  },
  {
    id: "s10", assignmentId: "as2", studentId: "7", content: "Tri par insertion, sélection et recherche dichotomique avec complexité.",
    submittedAt: "2025-11-29T09:00:00Z", grade: 17, feedback: "Analyse de complexité bien faite.",
    student: { id: "7", firstName: "Moussa", lastName: "Koné", matricule: "ETU-2024-007" },
  },
  {
    id: "s11", assignmentId: "as5", studentId: "4", content: "Mes requêtes SQL pour le TP bases de données.",
    submittedAt: "2025-11-20T12:00:00Z",
    student: { id: "4", firstName: "Aïcha", lastName: "Traoré", matricule: "ETU-2024-004" },
  },
  {
    id: "s12", assignmentId: "as5", studentId: "1", content: "Requêtes SQL avec jointures complexes.",
    submittedAt: "2025-11-18T20:00:00Z", grade: 16, feedback: "Très bonnes jointures, bien structuré.",
    student: { id: "1", firstName: "Amadou", lastName: "Diallo", matricule: "ETU-2024-001" },
  },
  {
    id: "s13", assignmentId: "as6", studentId: "7", content: "Classification CIFAR-10 avec CNN — accuracy 87%.",
    submittedAt: "2026-01-15T18:00:00Z",
    student: { id: "7", firstName: "Moussa", lastName: "Koné", matricule: "ETU-2024-007" },
  },
];

// ============================================================
// NEW MOCK DATA
// ============================================================

const MockAcademicYears: AcademicYear[] = [
  { id: 1, name: "2023-2024", startDate: "2023-09-01", endDate: "2024-06-30", isCurrent: false },
  { id: 2, name: "2024-2025", startDate: "2024-09-01", endDate: "2025-06-30", isCurrent: false },
  { id: 3, name: "2025-2026", startDate: "2025-09-01", endDate: "2026-06-30", isCurrent: true },
  { id: 4, name: "2026-2027", startDate: "2026-09-01", endDate: "2027-06-30", isCurrent: false },
];

const MockDepartments: Department[] = [
  { id: 1, name: "Informatique", code: "CS", description: "Département d'informatique et sciences du numérique", headId: 1, headName: "Pr. Andry Rajoelina" },
  { id: 2, name: "Mathématiques", code: "Math", description: "Département de mathématiques pures et appliquées", headId: 7, headName: "Pr. Gisèle Rabemananjara" },
  { id: 3, name: "Physique", code: "Physics", description: "Département de physique fondamentale et appliquée", headId: 3, headName: "Pr. Claire Razafimahefa" },
  { id: 4, name: "Chimie", code: "Chemistry", description: "Département de chimie générale et organique", headId: 5, headName: "Dr. Emma Ratsimba" },
  { id: 5, name: "Biologie", code: "Biology", description: "Département de biologie et sciences de la vie", headId: 11, headName: "Dr. Ketaka Raveloson" },
];

const MockPrograms: Program[] = [
  { id: 1, name: "Licence Informatique", code: "L-INFO", departmentId: 1, departmentName: "Informatique", level: "Licence", description: "Formation en informatique couvrant programmation, algorithmique, bases de données et réseaux." },
  { id: 2, name: "Master Informatique", code: "M-INFO", departmentId: 1, departmentName: "Informatique", level: "Master", description: "Spécialisation en IA, génie logiciel ou cybersécurité avec stage en entreprise." },
  { id: 3, name: "Licence Mathématiques", code: "L-MATH", departmentId: 2, departmentName: "Mathématiques", level: "Licence", description: "Formation en algèbre, analyse, probabilités et statistiques." },
  { id: 4, name: "Master Mathématiques Appliquées", code: "M-MATH", departmentId: 2, departmentName: "Mathématiques", level: "Master", description: "Modélisation mathématique, calcul scientifique et data science." },
  { id: 5, name: "Licence Physique", code: "L-PHY", departmentId: 3, departmentName: "Physique", level: "Licence", description: "Formation en mécanique, électromagnétisme, optique et physique quantique." },
  { id: 6, name: "Licence Chimie", code: "L-CHIM", departmentId: 4, departmentName: "Chimie", level: "Licence", description: "Formation en chimie générale, organique, analytique et biochimie." },
  { id: 7, name: "Licence Biologie", code: "L-BIO", departmentId: 5, departmentName: "Biologie", level: "Licence", description: "Formation en biologie cellulaire, écologie, génétique et microbiologie." },
  { id: 8, name: "Master Physique", code: "M-PHY", departmentId: 3, departmentName: "Physique", level: "Master", description: "Recherche en physique théorique ou physique des matériaux." },
];

const MockGroups: Group[] = [
  { id: 1, name: "TD-CS101-A", type: "TD", courseId: "c1", courseName: "Introduction à la Programmation", professorId: 1, professorName: "Pr. Rajoelina", students: ["3", "4", "7"] },
  { id: 2, name: "TP-CS101-A", type: "TP", courseId: "c1", courseName: "Introduction à la Programmation", professorId: 4, professorName: "M. Rakotobe", students: ["3", "4"] },
  { id: 3, name: "TP-CS101-B", type: "TP", courseId: "c1", courseName: "Introduction à la Programmation", professorId: 4, professorName: "M. Rakotobe", students: ["7", "18"] },
  { id: 4, name: "TD-CS201-A", type: "TD", courseId: "c2", courseName: "Structures de Données", professorId: 1, professorName: "Pr. Rajoelina", students: ["3", "1", "7"] },
  { id: 5, name: "TP-CS201-A", type: "TP", courseId: "c2", courseName: "Structures de Données", professorId: 4, professorName: "M. Rakotobe", students: ["3", "1", "7"] },
  { id: 6, name: "TD-CS301-A", type: "TD", courseId: "c3", courseName: "Bases de Données", professorId: 12, professorName: "M. Andrianaivo", students: ["3", "4", "18", "25", "1"] },
  { id: 7, name: "TP-CS301-A", type: "TP", courseId: "c3", courseName: "Bases de Données", professorId: 12, professorName: "M. Andrianaivo", students: ["3", "4", "18"] },
  { id: 8, name: "TP-CS301-B", type: "TP", courseId: "c3", courseName: "Bases de Données", professorId: 12, professorName: "M. Andrianaivo", students: ["25", "1"] },
];

const MockAuditLogs: AuditLog[] = [
  { id: 1, userId: 1, userName: "Admin Système", action: "CREATE", resource: "User", resourceId: "25", details: "Création du compte étudiant Cheikh Fall", createdAt: "2026-02-28T10:15:00Z" },
  { id: 2, userId: 1, userName: "Admin Système", action: "UPDATE", resource: "Course", resourceId: "c4", details: "Modification de la description du cours CS401", createdAt: "2026-02-27T14:30:00Z" },
  { id: 3, userId: 2, userName: "Jean Rakoto", action: "CREATE", resource: "Assignment", resourceId: "as6", details: "Création du projet Classification d'images pour CS401", createdAt: "2026-02-26T09:00:00Z" },
  { id: 4, userId: 1, userName: "Admin Système", action: "DELETE", resource: "User", resourceId: "99", details: "Suppression du compte test temporaire", createdAt: "2026-02-25T16:45:00Z" },
  { id: 5, userId: 10, userName: "Brice Randrianasolo", action: "UPDATE", resource: "Grade", resourceId: "4", details: "Mise à jour de la note d'Algèbre Linéaire pour Fatima Benali", createdAt: "2026-02-24T11:20:00Z" },
  { id: 6, userId: 1, userName: "Admin Système", action: "UPDATE", resource: "Schedule", resourceId: "16", details: "Ajout du cours CS301 le samedi matin", createdAt: "2026-02-23T08:00:00Z" },
  { id: 7, userId: 3, userName: "Aina Rasoanirina", action: "CREATE", resource: "Submission", resourceId: "s3", details: "Soumission du TP SQL avancé pour CS301", createdAt: "2026-02-22T22:00:00Z" },
  { id: 8, userId: 11, userName: "Claire Razafimahefa", action: "CREATE", resource: "Announcement", resourceId: "a9", details: "Publication d'une annonce pour PHY301", createdAt: "2026-02-21T13:00:00Z" },
  { id: 9, userId: 1, userName: "Admin Système", action: "UPDATE", resource: "Department", resourceId: "1", details: "Mise à jour du responsable du département CS", createdAt: "2026-02-20T10:00:00Z" },
  { id: 10, userId: 2, userName: "Jean Rakoto", action: "UPDATE", resource: "Submission", resourceId: "s5", details: "Notation de la soumission de Moussa Koné (19/20)", createdAt: "2026-02-19T15:30:00Z" },
];

const MockRooms: Room[] = [
  { id: 1, name: "Amphi A", capacity: 300, type: "Amphi", building: "Bâtiment Principal", equipment: ["Vidéoprojecteur", "Microphone", "Tableau blanc"], status: "Disponible" },
  { id: 2, name: "Amphi B", capacity: 250, type: "Amphi", building: "Bâtiment Principal", equipment: ["Vidéoprojecteur", "Microphone", "Tableau interactif"], status: "Disponible" },
  { id: 3, name: "Amphi C", capacity: 200, type: "Amphi", building: "Bâtiment Sciences", equipment: ["Vidéoprojecteur", "Microphone"], status: "Occupée" },
  { id: 4, name: "Salle 102", capacity: 40, type: "Salle", building: "Bâtiment Principal", equipment: ["Vidéoprojecteur", "Tableau blanc"], status: "Disponible" },
  { id: 5, name: "Salle 201", capacity: 35, type: "Salle", building: "Bâtiment Principal", equipment: ["Vidéoprojecteur", "Tableau blanc"], status: "Disponible" },
  { id: 6, name: "Salle Info 1", capacity: 30, type: "Salle", building: "Bâtiment Informatique", equipment: ["30 PC", "Vidéoprojecteur", "Réseau filaire"], status: "Occupée" },
  { id: 7, name: "Salle Info 2", capacity: 25, type: "Salle", building: "Bâtiment Informatique", equipment: ["25 PC", "Vidéoprojecteur", "Réseau filaire"], status: "Disponible" },
  { id: 8, name: "Labo Physique", capacity: 20, type: "Labo", building: "Bâtiment Sciences", equipment: ["Oscilloscopes", "Multimètres", "Générateurs"], status: "Disponible" },
  { id: 9, name: "Labo Chimie", capacity: 20, type: "Labo", building: "Bâtiment Sciences", equipment: ["Hottes aspirantes", "Verrerie", "Balances de précision"], status: "Maintenance" },
  { id: 10, name: "Labo Bio", capacity: 20, type: "Labo", building: "Bâtiment Sciences", equipment: ["Microscopes", "Centrifugeuses", "Autoclaves"], status: "Disponible" },
];

const MockMessages: Message[] = [
  { id: 1, senderId: "2", senderName: "Jean Rakoto", senderRole: "PROFESSOR", receiverId: "3", receiverName: "Aina Rasoanirina", subject: "Votre soumission TP1", content: "Bonjour Aina, votre travail sur le TP1 est excellent. J'aimerais vous proposer de présenter votre solution en classe.", read: true, createdAt: "2026-02-20T09:30:00Z" },
  { id: 2, senderId: "3", senderName: "Aina Rasoanirina", senderRole: "STUDENT", receiverId: "2", receiverName: "Jean Rakoto", subject: "Re: Votre soumission TP1", content: "Merci beaucoup Professeur ! Ce serait un honneur de présenter mon travail devant la classe.", read: true, createdAt: "2026-02-20T14:15:00Z" },
  { id: 3, senderId: "1", senderName: "Admin Système", senderRole: "ADMIN", receiverId: "2", receiverName: "Jean Rakoto", subject: "Réunion pédagogique", content: "Cher Professeur, une réunion pédagogique est prévue le 15 mars à 10h en salle de conférences. Votre présence est requise.", read: false, createdAt: "2026-03-01T08:00:00Z" },
  { id: 4, senderId: "7", senderName: "Moussa Koné", senderRole: "STUDENT", receiverId: "2", receiverName: "Jean Rakoto", subject: "Question sur le projet IA", content: "Bonjour Professeur, est-il possible d'utiliser PyTorch au lieu de TensorFlow pour le projet de classification d'images ?", read: true, createdAt: "2026-02-25T16:00:00Z" },
  { id: 5, senderId: "2", senderName: "Jean Rakoto", senderRole: "PROFESSOR", receiverId: "7", receiverName: "Moussa Koné", subject: "Re: Question sur le projet IA", content: "Oui Moussa, vous pouvez utiliser PyTorch. L'important est la qualité du modèle et du rapport.", read: true, createdAt: "2026-02-25T18:30:00Z" },
  { id: 6, senderId: "3", senderName: "Aina Rasoanirina", senderRole: "STUDENT", receiverId: "1", receiverName: "Admin Système", subject: "Demande de relevé de notes", content: "Bonjour, je souhaite obtenir un relevé de notes officiel pour une candidature en master. Pouvez-vous m'indiquer la procédure ?", read: false, createdAt: "2026-03-02T10:00:00Z" },
  { id: 7, senderId: "10", senderName: "Brice Randrianasolo", senderRole: "PROFESSOR", receiverId: "2", receiverName: "Jean Rakoto", subject: "Collaboration inter-départements", content: "Bonjour Jean, seriez-vous intéressé par un cours commun Math/Info sur la data science le semestre prochain ?", read: false, createdAt: "2026-03-03T11:00:00Z" },
  { id: 8, senderId: "18", senderName: "Fanja Rasolofo", senderRole: "STUDENT", receiverId: "2", receiverName: "Jean Rakoto", subject: "Absence justifiée", content: "Bonjour Professeur, je serai absente au cours de lundi pour raison médicale. Je fournirai un certificat.", read: true, createdAt: "2026-03-04T07:30:00Z" },
];

const MockExams: Exam[] = [
  { id: 1, courseId: "c1", courseName: "Introduction à la Programmation", roomId: 1, roomName: "Amphi A", date: "2026-01-15", startTime: "08:00", endTime: "10:00", type: "Partiel", semester: "S1" },
  { id: 2, courseId: "c2", courseName: "Structures de Données", roomId: 2, roomName: "Amphi B", date: "2026-01-16", startTime: "10:00", endTime: "12:00", type: "Partiel", semester: "S1" },
  { id: 3, courseId: "c5", courseName: "Algèbre Linéaire", roomId: 1, roomName: "Amphi A", date: "2026-01-17", startTime: "08:00", endTime: "10:00", type: "Partiel", semester: "S1" },
  { id: 4, courseId: "c6", courseName: "Mécanique Quantique", roomId: 3, roomName: "Amphi C", date: "2026-01-18", startTime: "14:00", endTime: "17:00", type: "Partiel", semester: "S1" },
  { id: 5, courseId: "c1", courseName: "Introduction à la Programmation", roomId: 1, roomName: "Amphi A", date: "2026-05-20", startTime: "08:00", endTime: "11:00", type: "Final", semester: "S1" },
  { id: 6, courseId: "c3", courseName: "Bases de Données", roomId: 2, roomName: "Amphi B", date: "2026-05-21", startTime: "08:00", endTime: "11:00", type: "Final", semester: "S2" },
  { id: 7, courseId: "c4", courseName: "Intelligence Artificielle", roomId: 3, roomName: "Amphi C", date: "2026-05-22", startTime: "14:00", endTime: "17:00", type: "Final", semester: "S2" },
  { id: 8, courseId: "c2", courseName: "Structures de Données", roomId: 1, roomName: "Amphi A", date: "2026-06-15", startTime: "08:00", endTime: "10:00", type: "Rattrapage", semester: "S1" },
  { id: 9, courseId: "c6", courseName: "Mécanique Quantique", roomId: 3, roomName: "Amphi C", date: "2026-06-16", startTime: "10:00", endTime: "13:00", type: "Rattrapage", semester: "S1" },
];

const MockAdminRequests: AdminRequest[] = [
  { id: 1, studentId: "3", studentName: "Aina Rasoanirina", studentMatricule: "ETU-2024-003", type: "Relevé de notes", subject: "Demande de relevé officiel", description: "Demande de relevé de notes officiel pour candidature en master à l'étranger.", status: "Approuvée", response: "Relevé disponible au secrétariat à partir du 10 mars.", createdAt: "2026-02-15T10:00:00Z", updatedAt: "2026-02-18T14:00:00Z" },
  { id: 2, studentId: "4", studentName: "Aïcha Traoré", studentMatricule: "ETU-2024-004", type: "Changement de groupe", subject: "Transfert de groupe TP", description: "Je souhaite passer du groupe TP-B au groupe TP-A pour des raisons d'emploi du temps.", status: "En attente", createdAt: "2026-03-01T09:00:00Z", updatedAt: "2026-03-01T09:00:00Z" },
  { id: 3, studentId: "9", studentName: "Ibrahim Sy", studentMatricule: "ETU-2024-009", type: "Rattrapage", subject: "Demande de session de rattrapage", description: "Demande de rattrapage pour Mécanique Quantique suite à une absence justifiée lors du partiel.", status: "En cours", createdAt: "2026-02-20T11:30:00Z", updatedAt: "2026-02-22T10:00:00Z" },
  { id: 4, studentId: "14", studentName: "Lalao Raharison", studentMatricule: "ETU-2024-014", type: "Réinscription", subject: "Demande de réinscription", description: "Suite à ma suspension, je demande ma réinscription pour le semestre prochain.", status: "En attente", createdAt: "2026-03-02T08:00:00Z", updatedAt: "2026-03-02T08:00:00Z" },
  { id: 5, studentId: "1", studentName: "Amadou Diallo", studentMatricule: "ETU-2024-001", type: "Attestation", subject: "Attestation de scolarité", description: "Besoin d'une attestation de scolarité pour une demande de bourse.", status: "Approuvée", response: "Attestation prête, veuillez passer au bureau de la scolarité.", createdAt: "2026-02-10T14:00:00Z", updatedAt: "2026-02-12T09:00:00Z" },
  { id: 6, studentId: "7", studentName: "Moussa Koné", studentMatricule: "ETU-2024-007", type: "Convention de stage", subject: "Convention de stage M1", description: "Demande de convention de stage pour un stage en entreprise de 3 mois chez Pulse Technologies.", status: "Approuvée", response: "Convention signée et disponible au secrétariat.", createdAt: "2026-01-25T10:00:00Z", updatedAt: "2026-02-01T16:00:00Z" },
  { id: 7, studentId: "21", studentName: "Mamadou Camara", studentMatricule: "ETU-2024-021", type: "Contestation de note", subject: "Contestation note Structures de Données", description: "Je conteste ma note de 6/20 au partiel de Structures de Données. Je pense qu'il y a eu une erreur de correction.", status: "Rejetée", response: "Après vérification, la note est confirmée. La copie peut être consultée au secrétariat.", createdAt: "2026-02-05T09:00:00Z", updatedAt: "2026-02-10T14:00:00Z" },
  { id: 8, studentId: "18", studentName: "Fanja Rasolofo", studentMatricule: "ETU-2024-018", type: "Dispense", subject: "Dispense d'assiduité partielle", description: "Demande de dispense d'assiduité pour le cours du lundi matin (raison professionnelle).", status: "En cours", createdAt: "2026-02-28T08:30:00Z", updatedAt: "2026-03-01T10:00:00Z" },
];

const MockAttendances: Attendance[] = [
  { id: 1, courseId: "c1", courseName: "Introduction à la Programmation", studentId: "3", studentName: "Aina Rasoanirina", studentMatricule: "ETU-2024-003", date: "2026-03-03", status: "Présent", sessionType: "CM" },
  { id: 2, courseId: "c1", courseName: "Introduction à la Programmation", studentId: "4", studentName: "Aïcha Traoré", studentMatricule: "ETU-2024-004", date: "2026-03-03", status: "Présent", sessionType: "CM" },
  { id: 3, courseId: "c1", courseName: "Introduction à la Programmation", studentId: "7", studentName: "Moussa Koné", studentMatricule: "ETU-2024-007", date: "2026-03-03", status: "Retard", sessionType: "CM" },
  { id: 4, courseId: "c1", courseName: "Introduction à la Programmation", studentId: "18", studentName: "Fanja Rasolofo", studentMatricule: "ETU-2024-018", date: "2026-03-03", status: "Absent", sessionType: "CM" },
  { id: 5, courseId: "c2", courseName: "Structures de Données", studentId: "3", studentName: "Aina Rasoanirina", studentMatricule: "ETU-2024-003", date: "2026-03-04", status: "Présent", sessionType: "TD" },
  { id: 6, courseId: "c2", courseName: "Structures de Données", studentId: "1", studentName: "Amadou Diallo", studentMatricule: "ETU-2024-001", date: "2026-03-04", status: "Présent", sessionType: "TD" },
  { id: 7, courseId: "c2", courseName: "Structures de Données", studentId: "7", studentName: "Moussa Koné", studentMatricule: "ETU-2024-007", date: "2026-03-04", status: "Présent", sessionType: "TD" },
  { id: 8, courseId: "c3", courseName: "Bases de Données", studentId: "3", studentName: "Aina Rasoanirina", studentMatricule: "ETU-2024-003", date: "2026-03-05", status: "Présent", sessionType: "TP" },
  { id: 9, courseId: "c3", courseName: "Bases de Données", studentId: "25", studentName: "Cheikh Fall", studentMatricule: "ETU-2024-025", date: "2026-03-05", status: "Absent", sessionType: "TP" },
  { id: 10, courseId: "c6", courseName: "Mécanique Quantique", studentId: "9", studentName: "Ibrahim Sy", studentMatricule: "ETU-2024-009", date: "2026-03-03", status: "Absent", sessionType: "CM" },
];

const MockResources: Resource[] = [
  { id: 1, courseId: "c1", courseName: "Introduction à la Programmation", title: "Chapitre 1 — Variables et types", description: "Support de cours sur les variables, types de données et opérateurs en Python.", fileUrl: "/uploads/cs101_ch1.pdf", fileType: "pdf", uploadedById: "2", uploadedByName: "Jean Rakoto", createdAt: "2025-09-05T08:00:00Z" },
  { id: 2, courseId: "c1", courseName: "Introduction à la Programmation", title: "Chapitre 2 — Boucles et conditions", description: "Structures de contrôle : if/else, for, while avec exercices corrigés.", fileUrl: "/uploads/cs101_ch2.pdf", fileType: "pdf", uploadedById: "2", uploadedByName: "Jean Rakoto", createdAt: "2025-09-15T08:00:00Z" },
  { id: 3, courseId: "c2", courseName: "Structures de Données", title: "Cours — Listes chaînées", description: "Implémentation et complexité des listes chaînées simples et doublement chaînées.", fileUrl: "/uploads/cs201_listes.pdf", fileType: "pdf", uploadedById: "2", uploadedByName: "Jean Rakoto", createdAt: "2025-10-01T08:00:00Z" },
  { id: 4, courseId: "c2", courseName: "Structures de Données", title: "Cours — Tables de hachage", description: "Tables de hachage, fonctions de hachage et résolution de collisions.", fileUrl: "/uploads/cs201_hash.pdf", fileType: "pdf", uploadedById: "2", uploadedByName: "Jean Rakoto", createdAt: "2025-11-10T08:00:00Z" },
  { id: 5, courseId: "c3", courseName: "Bases de Données", title: "Guide PostgreSQL", description: "Guide d'installation et prise en main de PostgreSQL sur Ubuntu et macOS.", fileUrl: "/uploads/cs301_pg_guide.pdf", fileType: "pdf", uploadedById: "2", uploadedByName: "Jean Rakoto", createdAt: "2025-09-20T08:00:00Z" },
  { id: 6, courseId: "c3", courseName: "Bases de Données", title: "Schéma ER — Base universitaire", description: "Diagramme entité-relation de la base de données utilisée pour les TP.", fileUrl: "/uploads/cs301_er_diagram.png", fileType: "image", uploadedById: "2", uploadedByName: "Jean Rakoto", createdAt: "2025-10-15T08:00:00Z" },
  { id: 7, courseId: "c4", courseName: "Intelligence Artificielle", title: "Introduction au Deep Learning", description: "Slides de la conférence invitée sur les réseaux de neurones profonds.", fileUrl: "/uploads/cs401_dl_slides.pdf", fileType: "pdf", uploadedById: "2", uploadedByName: "Jean Rakoto", createdAt: "2025-11-20T08:00:00Z" },
  { id: 8, courseId: "c4", courseName: "Intelligence Artificielle", title: "Dataset CIFAR-10 — Instructions", description: "Instructions pour télécharger et préparer le dataset CIFAR-10 pour le projet.", fileUrl: "/uploads/cs401_cifar_instructions.pdf", fileType: "pdf", uploadedById: "2", uploadedByName: "Jean Rakoto", createdAt: "2025-11-25T08:00:00Z" },
];

const MockForumPosts: ForumPost[] = [
  {
    id: 1, courseId: "c1", courseName: "Introduction à la Programmation", authorId: "3", authorName: "Aina Rasoanirina", authorRole: "STUDENT",
    title: "Question sur les dictionnaires", content: "Bonjour, quelle est la différence entre un dictionnaire et une liste en Python ? Quand utiliser l'un plutôt que l'autre ?",
    createdAt: "2026-02-15T14:00:00Z",
    replies: [
      { id: 2, courseId: "c1", authorId: "7", authorName: "Moussa Koné", authorRole: "STUDENT", content: "Un dictionnaire utilise des clés pour accéder aux valeurs, alors qu'une liste utilise des indices. Utilise un dict quand tu as besoin d'accéder par nom/clé.", createdAt: "2026-02-15T15:30:00Z" },
      { id: 3, courseId: "c1", authorId: "2", authorName: "Jean Rakoto", authorRole: "PROFESSOR", content: "Bonne question ! En résumé : liste = collection ordonnée, dictionnaire = collection de paires clé-valeur. Le dictionnaire offre un accès O(1) par clé.", createdAt: "2026-02-15T17:00:00Z" },
    ],
  },
  {
    id: 4, courseId: "c2", courseName: "Structures de Données", authorId: "1", authorName: "Amadou Diallo", authorRole: "STUDENT",
    title: "Erreur de segmentation — liste chaînée", content: "J'obtiens une erreur de segmentation quand je supprime le dernier élément de ma liste chaînée. Quelqu'un a une idée ?",
    createdAt: "2026-02-20T10:00:00Z",
    replies: [
      { id: 5, courseId: "c2", authorId: "3", authorName: "Aina Rasoanirina", authorRole: "STUDENT", content: "Vérifie que tu mets bien le pointeur next du noeud précédent à NULL après suppression.", createdAt: "2026-02-20T11:00:00Z" },
      { id: 6, courseId: "c2", authorId: "2", authorName: "Jean Rakoto", authorRole: "PROFESSOR", content: "En effet, n'oubliez pas de gérer le cas où le noeud à supprimer est le dernier. Vérifiez aussi que vous libérez la mémoire correctement.", createdAt: "2026-02-20T14:00:00Z" },
    ],
  },
  {
    id: 7, courseId: "c3", courseName: "Bases de Données", authorId: "4", authorName: "Aïcha Traoré", authorRole: "STUDENT",
    title: "JOIN vs sous-requête", content: "Pour le TP, est-ce qu'on peut utiliser des sous-requêtes au lieu de JOIN ? Lequel est plus performant ?",
    createdAt: "2026-02-22T09:00:00Z",
    replies: [
      { id: 8, courseId: "c3", authorId: "2", authorName: "Jean Rakoto", authorRole: "PROFESSOR", content: "Les deux approches sont acceptées. En général, les JOIN sont plus performants car le moteur SQL les optimise mieux. Mais pour certaines requêtes, les sous-requêtes sont plus lisibles.", createdAt: "2026-02-22T11:00:00Z" },
    ],
  },
  {
    id: 9, courseId: "c4", courseName: "Intelligence Artificielle", authorId: "7", authorName: "Moussa Koné", authorRole: "STUDENT",
    title: "GPU requis pour le projet ?", content: "Faut-il obligatoirement un GPU pour entraîner le modèle CNN sur CIFAR-10 ? Mon laptop n'a pas de carte graphique dédiée.",
    createdAt: "2026-02-28T16:00:00Z",
    replies: [
      { id: 10, courseId: "c4", authorId: "2", authorName: "Jean Rakoto", authorRole: "PROFESSOR", content: "Non, ce n'est pas obligatoire. Vous pouvez utiliser Google Colab gratuitement qui offre un GPU. Sinon un CPU suffit avec un modèle plus petit et moins d'epochs.", createdAt: "2026-02-28T18:00:00Z" },
      { id: 11, courseId: "c4", authorId: "25", authorName: "Cheikh Fall", authorRole: "STUDENT", content: "Je confirme, Google Colab marche très bien pour ce type de projet.", createdAt: "2026-03-01T08:00:00Z" },
    ],
  },
  {
    id: 12, courseId: "c1", courseName: "Introduction à la Programmation", authorId: "4", authorName: "Aïcha Traoré", authorRole: "STUDENT",
    title: "Ressources supplémentaires Python", content: "Est-ce que quelqu'un a des recommandations de livres ou sites pour approfondir Python ?",
    createdAt: "2026-03-01T10:00:00Z",
    replies: [
      { id: 13, courseId: "c1", authorId: "18", authorName: "Fanja Rasolofo", authorRole: "STUDENT", content: "Je recommande 'Automate the Boring Stuff with Python' — c'est gratuit en ligne et très pratique.", createdAt: "2026-03-01T12:00:00Z" },
    ],
  },
];

const MockQuizzes: Quiz[] = [
  {
    id: 1, courseId: "c1", courseName: "Introduction à la Programmation",
    title: "Quiz — Variables et types Python", description: "Quiz rapide pour tester vos connaissances sur les variables et types de données en Python.",
    dueDate: "2026-03-15T23:59:00Z", duration: 20, createdAt: "2026-03-01T08:00:00Z",
    questions: [
      { id: 1, question: "Quel est le type de la valeur 3.14 en Python ?", options: ["int", "float", "str", "complex"], correctIndex: 1, points: 2 },
      { id: 2, question: "Quelle fonction permet de connaître le type d'une variable ?", options: ["typeof()", "type()", "isinstance()", "class()"], correctIndex: 1, points: 2 },
      { id: 3, question: "Quel est le résultat de 10 // 3 en Python ?", options: ["3.33", "3", "4", "3.0"], correctIndex: 1, points: 3 },
      { id: 4, question: "Comment déclarer une chaîne de caractères multiligne ?", options: ["Avec des guillemets simples", "Avec des guillemets doubles", "Avec des triples guillemets", "Ce n'est pas possible"], correctIndex: 2, points: 2 },
      { id: 5, question: "Quelle est la valeur de bool('') en Python ?", options: ["True", "False", "None", "Erreur"], correctIndex: 1, points: 3 },
    ],
  },
  {
    id: 2, courseId: "c2", courseName: "Structures de Données",
    title: "Quiz — Complexité algorithmique", description: "Testez vos connaissances sur la notation Big-O et la complexité des algorithmes.",
    dueDate: "2026-03-20T23:59:00Z", duration: 15, createdAt: "2026-03-05T08:00:00Z",
    questions: [
      { id: 6, question: "Quelle est la complexité de la recherche dans une liste chaînée ?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correctIndex: 2, points: 3 },
      { id: 7, question: "Quelle est la complexité de l'insertion en tête d'une liste chaînée ?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correctIndex: 0, points: 2 },
      { id: 8, question: "Quel algorithme de tri a une complexité O(n log n) dans le pire cas ?", options: ["Quicksort", "Tri par insertion", "Tri fusion (Mergesort)", "Tri à bulles"], correctIndex: 2, points: 3 },
      { id: 9, question: "Quelle structure de données offre un accès O(1) en moyenne par clé ?", options: ["Liste chaînée", "Arbre binaire", "Table de hachage", "Pile"], correctIndex: 2, points: 2 },
    ],
  },
  {
    id: 3, courseId: "c3", courseName: "Bases de Données",
    title: "Quiz — SQL et modèle relationnel", description: "Évaluez vos connaissances en SQL et modélisation relationnelle.",
    dueDate: "2026-03-25T23:59:00Z", duration: 25, createdAt: "2026-03-06T08:00:00Z",
    questions: [
      { id: 10, question: "Quelle commande SQL permet de supprimer une table ?", options: ["DELETE TABLE", "REMOVE TABLE", "DROP TABLE", "DESTROY TABLE"], correctIndex: 2, points: 2 },
      { id: 11, question: "Quelle clause SQL est utilisée pour filtrer les groupes ?", options: ["WHERE", "HAVING", "FILTER", "GROUP BY"], correctIndex: 1, points: 3 },
      { id: 12, question: "Quel type de jointure retourne toutes les lignes des deux tables ?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], correctIndex: 3, points: 3 },
      { id: 13, question: "Quelle forme normale élimine les dépendances transitives ?", options: ["1NF", "2NF", "3NF", "BCNF"], correctIndex: 2, points: 2 },
      { id: 14, question: "Quel mot-clé SQL permet d'éliminer les doublons ?", options: ["UNIQUE", "DISTINCT", "DIFFERENT", "NO DUPLICATE"], correctIndex: 1, points: 2 },
    ],
  },
];

const MockQuizAttempts: QuizAttempt[] = [
  { id: 1, quizId: 1, quizTitle: "Quiz — Variables et types Python", studentId: "3", studentName: "Aina Rasoanirina", answers: [1, 1, 1, 2, 1], score: 12, maxScore: 12, submittedAt: "2026-03-10T14:30:00Z" },
  { id: 2, quizId: 1, quizTitle: "Quiz — Variables et types Python", studentId: "4", studentName: "Aïcha Traoré", answers: [1, 1, 0, 2, 0], score: 7, maxScore: 12, submittedAt: "2026-03-11T09:15:00Z" },
  { id: 3, quizId: 1, quizTitle: "Quiz — Variables et types Python", studentId: "7", studentName: "Moussa Koné", answers: [1, 1, 1, 2, 0], score: 9, maxScore: 12, submittedAt: "2026-03-10T16:00:00Z" },
  { id: 4, quizId: 2, quizTitle: "Quiz — Complexité algorithmique", studentId: "3", studentName: "Aina Rasoanirina", answers: [2, 0, 2, 2], score: 10, maxScore: 10, submittedAt: "2026-03-15T10:00:00Z" },
  { id: 5, quizId: 2, quizTitle: "Quiz — Complexité algorithmique", studentId: "1", studentName: "Amadou Diallo", answers: [2, 0, 1, 2], score: 7, maxScore: 10, submittedAt: "2026-03-16T11:00:00Z" },
  { id: 6, quizId: 2, quizTitle: "Quiz — Complexité algorithmique", studentId: "7", studentName: "Moussa Koné", answers: [2, 0, 2, 1], score: 8, maxScore: 10, submittedAt: "2026-03-15T15:30:00Z" },
];

const MockPortfolios: Portfolio[] = [
  {
    id: 1, studentId: "3", title: "Portfolio de Aina Rasoanirina",
    description: "Mes projets, compétences et expériences en informatique.",
    items: [
      { id: 1, title: "Site web de gestion de bibliothèque", description: "Application web full-stack avec React et Express pour gérer une bibliothèque universitaire.", type: "project", date: "2025-12-15", url: "https://github.com/aina-r/biblio-app", tags: ["React", "Express", "PostgreSQL", "TypeScript"] },
      { id: 2, title: "Certificat Python — Coursera", description: "Certification 'Python for Everybody' délivrée par l'Université du Michigan via Coursera.", type: "certificate", date: "2025-06-20", url: "https://coursera.org/verify/abc123", tags: ["Python", "Coursera", "Certification"] },
      { id: 3, title: "Stage — Pulse Technologies", description: "Stage de 2 mois en développement web. Travail sur une API REST et un dashboard admin.", type: "experience", date: "2025-07-01", tags: ["Stage", "API REST", "React", "Node.js"] },
      { id: 4, title: "Compétences en bases de données", description: "Maîtrise de PostgreSQL, MySQL, MongoDB. Conception de schémas, optimisation de requêtes.", type: "skill", tags: ["PostgreSQL", "MySQL", "MongoDB", "SQL"] },
      { id: 5, title: "Chatbot IA pour FAQ universitaire", description: "Prototype de chatbot utilisant GPT pour répondre aux questions fréquentes des étudiants.", type: "project", date: "2026-01-10", url: "https://github.com/aina-r/univ-chatbot", tags: ["Python", "IA", "NLP", "FastAPI"] },
    ],
  },
  {
    id: 2, studentId: "7", title: "Portfolio de Moussa Koné",
    description: "Projets et réalisations en informatique et intelligence artificielle.",
    items: [
      { id: 6, title: "Classification d'images CIFAR-10", description: "Réseau de neurones convolutif atteignant 87% de précision sur CIFAR-10 avec PyTorch.", type: "project", date: "2026-01-15", url: "https://github.com/moussa-k/cifar10-cnn", tags: ["PyTorch", "CNN", "Deep Learning", "Python"] },
      { id: 7, title: "Hackathon AntsiraHack 2025 — 2e place", description: "Développement d'une application de suivi de santé en 48h. Équipe de 3 personnes.", type: "experience", date: "2025-11-20", tags: ["Hackathon", "React Native", "Firebase", "Santé"] },
      { id: 8, title: "Compétences en IA/ML", description: "Machine learning, deep learning, traitement du langage naturel, computer vision.", type: "skill", tags: ["TensorFlow", "PyTorch", "Scikit-learn", "NLP", "Computer Vision"] },
    ],
  },
];

const MockJuryDeliberations: JuryDeliberation[] = [
  {
    id: 1, academicYearId: 3, academicYearName: "2025-2026", departmentId: 1, departmentName: "Informatique",
    level: "L3", date: "2026-06-25", status: "Planifié",
    decisions: [
      { studentId: 1, studentName: "Amadou Diallo", studentMatricule: "ETU-2024-001", average: 15.0, credits: 60, decision: "Admis" },
      { studentId: 4, studentName: "Aïcha Traoré", studentMatricule: "ETU-2024-004", average: 16.5, credits: 60, decision: "Admis" },
      { studentId: 10, studentName: "Noëlla Andriana", studentMatricule: "ETU-2024-010", average: 18.0, credits: 60, decision: "Admis" },
      { studentId: 8, studentName: "Hanta Razafi", studentMatricule: "ETU-2024-008", average: 15.0, credits: 58, decision: "Admis" },
      { studentId: 14, studentName: "Lalao Raharison", studentMatricule: "ETU-2024-014", average: 8.5, credits: 30, decision: "Redoublant" },
      { studentId: 21, studentName: "Mamadou Camara", studentMatricule: "ETU-2024-021", average: 7.5, credits: 24, decision: "Ajourné" },
    ],
  },
  {
    id: 2, academicYearId: 2, academicYearName: "2024-2025", departmentId: 3, departmentName: "Physique",
    level: "M1", date: "2025-06-28", status: "Terminé",
    decisions: [
      { studentId: 3, studentName: "Jean Rakoto", studentMatricule: "ETU-2024-003", average: 11.5, credits: 54, decision: "Admis" },
      { studentId: 15, studentName: "Youssouf Diarra", studentMatricule: "ETU-2024-015", average: 13.0, credits: 58, decision: "Admis" },
      { studentId: 20, studentName: "Hasina Ramana", studentMatricule: "ETU-2024-020", average: 14.0, credits: 60, decision: "Admis" },
      { studentId: 9, studentName: "Ibrahim Sy", studentMatricule: "ETU-2024-009", average: 9.5, credits: 36, decision: "Ajourné" },
      { studentId: 22, studentName: "Mialy Andria", studentMatricule: "ETU-2024-022", average: 14.5, credits: 60, decision: "Admis" },
    ],
  },
];

const MockECTSRecords: ECTSRecord[] = [
  // Amadou Diallo (id 1, CS L3)
  { studentId: 1, subjectId: 1, subjectName: "Introduction à la Programmation", subjectCode: "CS101", credits: 6, validated: true, semester: "S1", academicYear: "2025-2026" },
  { studentId: 1, subjectId: 4, subjectName: "Structures de Données", subjectCode: "CS201", credits: 6, validated: true, semester: "S1", academicYear: "2025-2026" },
  { studentId: 1, subjectId: 5, subjectName: "Bases de Données", subjectCode: "CS301", credits: 6, validated: true, semester: "S1", academicYear: "2025-2026" },
  // Aina Rasoanirina (id 3, demo student)
  { studentId: 3, subjectId: 1, subjectName: "Introduction à la Programmation", subjectCode: "CS101", credits: 6, validated: true, semester: "S1", academicYear: "2025-2026" },
  { studentId: 3, subjectId: 4, subjectName: "Structures de Données", subjectCode: "CS201", credits: 6, validated: true, semester: "S1", academicYear: "2025-2026" },
  { studentId: 3, subjectId: 5, subjectName: "Bases de Données", subjectCode: "CS301", credits: 6, validated: true, semester: "S2", academicYear: "2025-2026" },
  { studentId: 3, subjectId: 10, subjectName: "Intelligence Artificielle", subjectCode: "CS401", credits: 6, validated: true, semester: "S2", academicYear: "2025-2026" },
  // Moussa Koné (id 7, CS M1)
  { studentId: 7, subjectId: 4, subjectName: "Structures de Données", subjectCode: "CS201", credits: 6, validated: true, semester: "S1", academicYear: "2025-2026" },
  { studentId: 7, subjectId: 10, subjectName: "Intelligence Artificielle", subjectCode: "CS401", credits: 6, validated: true, semester: "S1", academicYear: "2025-2026" },
  { studentId: 7, subjectId: 1, subjectName: "Introduction à la Programmation", subjectCode: "CS101", credits: 6, validated: true, semester: "S1", academicYear: "2024-2025" },
  // Ibrahim Sy (id 9, Physics L2)
  { studentId: 9, subjectId: 3, subjectName: "Mécanique Quantique", subjectCode: "PHY301", credits: 6, validated: false, semester: "S1", academicYear: "2025-2026" },
  { studentId: 9, subjectId: 7, subjectName: "Électromagnétisme", subjectCode: "PHY201", credits: 4, validated: true, semester: "S1", academicYear: "2025-2026" },
  // Lalao Raharison (id 14, CS L2 - suspended)
  { studentId: 14, subjectId: 1, subjectName: "Introduction à la Programmation", subjectCode: "CS101", credits: 6, validated: false, semester: "S1", academicYear: "2025-2026" },
  // Bakary Cissé (id 13, Math M2)
  { studentId: 13, subjectId: 2, subjectName: "Analyse Mathématique II", subjectCode: "MATH201", credits: 6, validated: true, semester: "S1", academicYear: "2025-2026" },
  { studentId: 13, subjectId: 11, subjectName: "Probabilités et Statistiques", subjectCode: "MATH301", credits: 6, validated: true, semester: "S1", academicYear: "2025-2026" },
];

export {
  MockSubjects, MockStudents, MockTeachers, MockSchedule, MockGrades, MockDashboardStats,
  MockCourses, MockAnnouncements, MockAssignments, MockSubmissions,
  MockAcademicYears, MockDepartments, MockPrograms, MockGroups, MockAuditLogs,
  MockRooms, MockMessages, MockExams, MockAdminRequests, MockAttendances,
  MockResources, MockForumPosts, MockQuizzes, MockQuizAttempts, MockPortfolios,
  MockJuryDeliberations, MockECTSRecords,
};
