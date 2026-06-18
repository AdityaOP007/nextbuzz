import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder = "nextbuzz/events"
): Promise<string> {
  if (!env.cloudinary.cloudName) {
    throw new Error("Cloudinary is not configured");
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
          return;
        }
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
}

export { cloudinary };
