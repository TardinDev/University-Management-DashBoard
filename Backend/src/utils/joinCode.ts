import crypto from "crypto";

export function generateJoinCode(): string {
  return crypto.randomBytes(4).toString("hex").slice(0, 7).toUpperCase();
}
