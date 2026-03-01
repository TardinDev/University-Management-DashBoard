import { Router } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import prisma from "../config/database.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /upload
router.post("/", requireAuth, upload.single("file"), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Aucun fichier fourni" });
      return;
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      res.status(503).json({ message: "Cloudinary n'est pas configuré" });
      return;
    }

    const result = await new Promise<{ secure_url: string; public_id: string; resource_type: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "university", resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as { secure_url: string; public_id: string; resource_type: string });
        }
      );
      stream.end(req.file!.buffer);
    });

    const media = await prisma.media.create({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        type: result.resource_type,
        filename: req.file.originalname,
        uploadedBy: req.user!.id,
      },
    });

    res.json({
      id: media.id,
      url: media.url,
      publicId: media.publicId,
      type: media.type,
      filename: media.filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Erreur lors de l'upload" });
  }
});

export default router;
