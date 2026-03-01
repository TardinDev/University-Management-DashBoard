import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.js";

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: "Non authentifié" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: "Accès interdit" });
      return;
    }

    next();
  };
}
