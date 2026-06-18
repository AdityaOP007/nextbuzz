import { Router } from "express";
import multer from "multer";
import * as uploadController from "../controllers/upload.controller";
import { authenticate } from "../middleware/auth";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const router = Router();

router.post("/", authenticate, upload.single("file"), uploadController.uploadImage);

export default router;
