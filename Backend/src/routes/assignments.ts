import { Router } from "express";
import prisma from "../config/database.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { parsePagination } from "../utils/pagination.js";

const router = Router();

// GET /assignments — filtered by courseId
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { skip, take, orderBy } = parsePagination(req);
    const courseId = req.query.courseId as string | undefined;

    const where: Record<string, unknown> = {};
    if (courseId) where.courseId = courseId;

    const [data, total] = await Promise.all([
      prisma.assignment.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          course: { select: { id: true, name: true, code: true } },
          _count: { select: { submissions: true } },
        },
      }),
      prisma.assignment.count({ where }),
    ]);

    res.setHeader("x-total-count", total.toString());
    res.json(data);
  } catch (error) {
    console.error("Assignments list error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /assignments/:id
router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, name: true, code: true, professorId: true } },
        submissions: {
          include: {
            student: { select: { id: true, firstName: true, lastName: true, matricule: true, avatar: true } },
          },
        },
        _count: { select: { submissions: true } },
      },
    });

    if (!assignment) {
      res.status(404).json({ message: "Devoir non trouvé" });
      return;
    }

    // Students only see their own submission
    if (req.user!.role === "STUDENT") {
      const filtered = assignment.submissions.filter(
        (s: { studentId: string }) => s.studentId === req.user!.id
      );
      res.json({ ...assignment, submissions: filtered });
      return;
    }

    res.json(assignment);
  } catch (error) {
    console.error("Assignment get error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /assignments — professor/admin
router.post("/", requireAuth, requireRole("ADMIN", "PROFESSOR"), async (req: AuthRequest, res) => {
  try {
    const { courseId, title, description, dueDate, points, attachments } = req.body;

    const assignment = await prisma.assignment.create({
      data: {
        courseId,
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        points,
        attachments,
      },
      include: {
        course: { select: { id: true, name: true, code: true } },
        _count: { select: { submissions: true } },
      },
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error("Assignment create error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PATCH /assignments/:id
router.patch("/:id", requireAuth, requireRole("ADMIN", "PROFESSOR"), async (req: AuthRequest, res) => {
  try {
    const { title, description, dueDate, points, attachments } = req.body;

    const id = req.params.id as string;
    const assignment = await prisma.assignment.update({
      where: { id },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        points,
        attachments,
      },
      include: {
        course: { select: { id: true, name: true, code: true } },
        _count: { select: { submissions: true } },
      },
    });

    res.json(assignment);
  } catch (error) {
    console.error("Assignment update error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /assignments/:id
router.delete("/:id", requireAuth, requireRole("ADMIN", "PROFESSOR"), async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const assignment = await prisma.assignment.delete({ where: { id } });
    res.json(assignment);
  } catch (error) {
    console.error("Assignment delete error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
