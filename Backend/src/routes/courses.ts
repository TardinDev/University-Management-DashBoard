import { Router } from "express";
import prisma from "../config/database.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { parsePagination } from "../utils/pagination.js";
import { generateJoinCode } from "../utils/joinCode.js";

const router = Router();

// GET /courses — filtered by role
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { skip, take, orderBy } = parsePagination(req);
    const departement = req.query.departement as string | undefined;
    const semester = req.query.semester as string | undefined;

    const where: Record<string, unknown> = {};
    if (departement) where.departement = departement;
    if (semester) where.semester = semester;

    // Scope by role
    if (req.user!.role === "PROFESSOR") {
      where.professorId = req.user!.id;
    } else if (req.user!.role === "STUDENT") {
      where.enrollments = { some: { studentId: req.user!.id } };
    }

    const [data, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          professor: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          _count: { select: { enrollments: true, assignments: true, announcements: true } },
        },
      }),
      prisma.course.count({ where }),
    ]);

    res.setHeader("x-total-count", total.toString());
    res.json(data);
  } catch (error) {
    console.error("Courses list error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /courses/:id
router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        professor: { select: { id: true, firstName: true, lastName: true, avatar: true, email: true } },
        enrollments: {
          include: { student: { select: { id: true, firstName: true, lastName: true, avatar: true, email: true, matricule: true } } },
        },
        _count: { select: { enrollments: true, assignments: true, announcements: true } },
      },
    });

    if (!course) {
      res.status(404).json({ message: "Cours non trouvé" });
      return;
    }

    res.json(course);
  } catch (error) {
    console.error("Course get error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /courses — professor/admin
router.post("/", requireAuth, requireRole("ADMIN", "PROFESSOR"), async (req: AuthRequest, res) => {
  try {
    const { name, code, description, coverImage, departement, semester, section } = req.body;

    const course = await prisma.course.create({
      data: {
        name,
        code,
        description,
        coverImage,
        departement,
        semester,
        section,
        joinCode: generateJoinCode(),
        professorId: req.user!.id,
      },
      include: {
        professor: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        _count: { select: { enrollments: true, assignments: true, announcements: true } },
      },
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("Course create error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PATCH /courses/:id
router.patch("/:id", requireAuth, requireRole("ADMIN", "PROFESSOR"), async (req: AuthRequest, res) => {
  try {
    const { name, code, description, coverImage, departement, semester, section } = req.body;

    const id = req.params.id as string;
    const course = await prisma.course.update({
      where: { id },
      data: { name, code, description, coverImage, departement, semester, section },
      include: {
        professor: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        _count: { select: { enrollments: true, assignments: true, announcements: true } },
      },
    });

    res.json(course);
  } catch (error) {
    console.error("Course update error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /courses/:id
router.delete("/:id", requireAuth, requireRole("ADMIN", "PROFESSOR"), async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const course = await prisma.course.delete({ where: { id } });
    res.json(course);
  } catch (error) {
    console.error("Course delete error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /courses/join — student joins with code
router.post("/join", requireAuth, requireRole("STUDENT"), async (req: AuthRequest, res) => {
  try {
    const { joinCode } = req.body;

    const course = await prisma.course.findUnique({ where: { joinCode } });
    if (!course) {
      res.status(404).json({ message: "Code de cours invalide" });
      return;
    }

    // Check if already enrolled
    const existing = await prisma.courseEnrollment.findUnique({
      where: { courseId_studentId: { courseId: course.id, studentId: req.user!.id } },
    });
    if (existing) {
      res.status(409).json({ message: "Vous êtes déjà inscrit à ce cours" });
      return;
    }

    await prisma.courseEnrollment.create({
      data: { courseId: course.id, studentId: req.user!.id },
    });

    res.json({ message: "Inscrit avec succès", courseId: course.id });
  } catch (error) {
    console.error("Join course error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
