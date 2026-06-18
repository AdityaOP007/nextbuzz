import dotenv from "dotenv";

dotenv.config();

function envOr(key: string, fallback = ""): string {
  return process.env[key] || fallback;
}

export const env = {
  port: parseInt(process.env.PORT || "4000", 10),
  databaseUrl: envOr("DATABASE_URL", "postgresql://postgres:password@localhost:5432/nextbuzz?schema=public"),
  jwtSecret: envOr("JWT_SECRET", "dev-secret-change-in-production"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
};
