import type { Request, Response, NextFunction } from "express";
import prisma from "../config/database.js";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar: string | null;
  };
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.session_token;

  if (!token) {
    res.status(401).json({ message: "Non authentifié" });
    return;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    res.clearCookie("session_token");
    res.status(401).json({ message: "Session expirée" });
    return;
  }

  req.user = {
    id: session.user.id,
    email: session.user.email,
    firstName: session.user.firstName,
    lastName: session.user.lastName,
    role: session.user.role,
    avatar: session.user.avatar,
  };

  next();
}
