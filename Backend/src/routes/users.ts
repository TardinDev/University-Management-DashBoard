import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/database.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { parsePagination } from "../utils/pagination.js";

const router = Router();

// GET /users — admin only, list all users
router.get("/", requireAuth, requireRole("ADMIN"), async (req: AuthRequest, res) => {
  try {
    const { skip, take, orderBy } = parsePagination(req);
    const role = req.query.role as string | undefined;
    const departement = req.query.departement as string | undefined;

    const where: Record<string, unknown> = {};
    if (role) where.role = role;
    if (departement) where.departement = departement;

    const [data, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take, orderBy, select: { passwordHash: false, id: true, email: true, firstName: true, lastName: true, role: true, avatar: true, phone: true, departement: true, matricule: true, dateOfBirth: true, gender: true, level: true, studentStatus: true, enrollmentDate: true, address: true, specialization: true, professorGrade: true, professorStatus: true, hireDate: true, createdAt: true, updatedAt: true } }),
      prisma.user.count({ where }),
    ]);

    res.setHeader("x-total-count", total.toString());
    res.json(data);
  } catch (error) {
    console.error("Users list error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /users/:id
router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const user = await prisma.user.findUnique({
      where: { id },
      select: { passwordHash: false, id: true, email: true, firstName: true, lastName: true, role: true, avatar: true, phone: true, departement: true, matricule: true, dateOfBirth: true, gender: true, level: true, studentStatus: true, enrollmentDate: true, address: true, specialization: true, professorGrade: true, professorStatus: true, hireDate: true, createdAt: true, updatedAt: true },
    });
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error("User get error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /users — admin creates user
router.post("/", requireAuth, requireRole("ADMIN"), async (req: AuthRequest, res) => {
  try {
    const { email, password, firstName, lastName, role, ...rest } = req.body;
    const passwordHash = await bcrypt.hash(password || "password123", 10);

    const user = await prisma.user.create({
      data: { email, passwordHash, firstName, lastName, role, ...rest },
    });

    const { passwordHash: _, ...userData } = user;
    res.status(201).json(userData);
  } catch (error) {
    console.error("User create error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PATCH /users/:id
router.patch("/:id", requireAuth, requireRole("ADMIN"), async (req: AuthRequest, res) => {
  try {
    const { password, passwordHash: _ph, ...data } = req.body;
    const updateData: Record<string, unknown> = { ...data };

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const id = req.params.id as string;
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { passwordHash: _, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error("User update error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /users/:id
router.delete("/:id", requireAuth, requireRole("ADMIN"), async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const user = await prisma.user.delete({ where: { id } });
    const { passwordHash: _, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error("User delete error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
