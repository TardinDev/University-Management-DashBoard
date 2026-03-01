import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import prisma from "../config/database.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["STUDENT", "PROFESSOR"]),
});

async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.session.create({
    data: { userId, token, expiresAt },
  });

  return { token, expiresAt };
}

function generateMatricule(role: string): string {
  const prefix = role === "STUDENT" ? "ETU" : "ENS";
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${year}-${rand}`;
}

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Email ou mot de passe incorrect" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ message: "Email ou mot de passe incorrect" });
      return;
    }

    const { token, expiresAt } = await createSession(user.id);

    res.cookie("session_token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    });

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      role: user.role,
      avatar: user.avatar,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Données invalides", errors: error.errors });
      return;
    }
    console.error("Login error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ message: "Cet email est déjà utilisé" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const matricule = generateMatricule(role);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role,
        matricule,
        enrollmentDate: role === "STUDENT" ? new Date().toISOString().split("T")[0] : undefined,
        hireDate: role === "PROFESSOR" ? new Date().toISOString().split("T")[0] : undefined,
        studentStatus: role === "STUDENT" ? "Actif" : undefined,
        professorStatus: role === "PROFESSOR" ? "Actif" : undefined,
      },
    });

    const { token } = await createSession(user.id);

    res.cookie("session_token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      role: user.role,
      avatar: user.avatar,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Données invalides", errors: error.errors });
      return;
    }
    console.error("Register error:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /auth/logout
router.post("/logout", requireAuth, async (req: AuthRequest, res) => {
  const token = req.cookies?.session_token;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  res.clearCookie("session_token");
  res.json({ message: "Déconnecté" });
});

// GET /auth/me
router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  res.json({
    id: req.user!.id,
    email: req.user!.email,
    firstName: req.user!.firstName,
    lastName: req.user!.lastName,
    fullName: `${req.user!.firstName} ${req.user!.lastName}`,
    role: req.user!.role,
    avatar: req.user!.avatar,
  });
});

export default router;
