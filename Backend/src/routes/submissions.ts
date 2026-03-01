import { Router } from "express";
import prisma from "../config/database.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { parsePagination } from "../utils/pagination.js";

const router = Router();

// GET /submissions — filtered by assignmentId or studentId
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { skip, take, orderBy } = parsePagination(req);
    const assignmentId = req.query.assignmentId as string | undefined;
    const studentId = req.query.studentId as string | undefined;

    const where: Record<string, unknown> = {};
    if (assignmentId) where.assignmentId = assignmentId;

    // Students only see their own submissions
    if (req.user!.role === "STUDENT") {
      where.studentId = req.user!.id;
    } else if (studentId) {
      where.studentId = studentId;
    }

    const [data, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          student: { select: { id: true, firstName: true, lastName: true, matricule: true, avatar: true } },
          assignment: { select: { id: true, title: true, points: true, courseId: true } },
        },
      }),
      prisma.submission.count({ where }),
    ]);

    res.setHeader("x-total-count", total.toString());
    res.json(data);
  } catch (error) {
    console.error("Submissions list error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /submissions/:id
router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        student: { select: { id: true, firstName: true, lastName: true, matricule: true, avatar: true } },
        assignment: { select: { id: true, title: true, points: true, courseId: true, course: { select: { id: true, name: true } } } },
      },
    });

    if (!submission) {
      res.status(404).json({ message: "Soumission non trouvée" });
      return;
    }

    res.json(submission);
  } catch (error) {
    console.error("Submission get error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /submissions — student submits
router.post("/", requireAuth, requireRole("STUDENT"), async (req: AuthRequest, res) => {
  try {
    const { assignmentId, content, attachments } = req.body;

    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId: req.user!.id,
        content,
        attachments,
      },
      include: {
        student: { select: { id: true, firstName: true, lastName: true, matricule: true } },
        assignment: { select: { id: true, title: true, points: true } },
      },
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error("Submission create error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PATCH /submissions/:id — professor grades or student updates
router.patch("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { content, attachments, grade, feedback } = req.body;
    const updateData: Record<string, unknown> = {};

    if (req.user!.role === "STUDENT") {
      // Students can update content/attachments
      if (content !== undefined) updateData.content = content;
      if (attachments !== undefined) updateData.attachments = attachments;
    } else {
      // Professors can grade
      if (grade !== undefined) updateData.grade = grade;
      if (feedback !== undefined) updateData.feedback = feedback;
    }

    const id = req.params.id as string;
    const submission = await prisma.submission.update({
      where: { id },
      data: updateData,
      include: {
        student: { select: { id: true, firstName: true, lastName: true, matricule: true } },
        assignment: { select: { id: true, title: true, points: true } },
      },
    });

    res.json(submission);
  } catch (error) {
    console.error("Submission update error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /submissions/:id
router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const submission = await prisma.submission.delete({ where: { id } });
    res.json(submission);
  } catch (error) {
    console.error("Submission delete error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
