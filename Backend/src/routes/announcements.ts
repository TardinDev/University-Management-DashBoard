import { Router } from "express";
import prisma from "../config/database.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { parsePagination } from "../utils/pagination.js";

const router = Router();

// GET /announcements — filtered by courseId
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { skip, take, orderBy } = parsePagination(req);
    const courseId = req.query.courseId as string | undefined;

    const where: Record<string, unknown> = {};
    if (courseId) where.courseId = courseId;

    const [data, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          author: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } },
          course: { select: { id: true, name: true, code: true } },
        },
      }),
      prisma.announcement.count({ where }),
    ]);

    res.setHeader("x-total-count", total.toString());
    res.json(data);
  } catch (error) {
    console.error("Announcements list error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /announcements/:id
router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } },
        course: { select: { id: true, name: true, code: true } },
      },
    });

    if (!announcement) {
      res.status(404).json({ message: "Annonce non trouvée" });
      return;
    }

    res.json(announcement);
  } catch (error) {
    console.error("Announcement get error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /announcements — professor/admin
router.post("/", requireAuth, requireRole("ADMIN", "PROFESSOR"), async (req: AuthRequest, res) => {
  try {
    const { courseId, content, attachments } = req.body;

    const announcement = await prisma.announcement.create({
      data: {
        courseId,
        authorId: req.user!.id,
        content,
        attachments,
      },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } },
        course: { select: { id: true, name: true, code: true } },
      },
    });

    res.status(201).json(announcement);
  } catch (error) {
    console.error("Announcement create error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PATCH /announcements/:id
router.patch("/:id", requireAuth, requireRole("ADMIN", "PROFESSOR"), async (req: AuthRequest, res) => {
  try {
    const { content, attachments } = req.body;

    const id = req.params.id as string;
    const announcement = await prisma.announcement.update({
      where: { id },
      data: { content, attachments },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } },
        course: { select: { id: true, name: true, code: true } },
      },
    });

    res.json(announcement);
  } catch (error) {
    console.error("Announcement update error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /announcements/:id
router.delete("/:id", requireAuth, requireRole("ADMIN", "PROFESSOR"), async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const announcement = await prisma.announcement.delete({ where: { id } });
    res.json(announcement);
  } catch (error) {
    console.error("Announcement delete error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
