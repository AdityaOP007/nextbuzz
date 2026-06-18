import { Response } from "express";
import { AuthRequest } from "../types";
import { uploadToCloudinary } from "../services/cloudinary.service";

export async function uploadImage(req: AuthRequest, res: Response): Promise<void> {
  if (!req.file) {
    res.status(400).json({ success: false, error: "No file uploaded" });
    return;
  }

  try {
    const url = await uploadToCloudinary(req.file.buffer);
    res.json({ success: true, data: { url } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    res.status(500).json({ success: false, error: message });
  }
}
