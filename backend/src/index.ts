import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import eventRoutes from "./routes/event.routes";
import bookingRoutes from "./routes/booking.routes";
import uploadRoutes from "./routes/upload.routes";
import cartRoutes from "./routes/cart.routes";
import debugRoutes from "./routes/debug.routes";
import { errorHandler } from "./middleware/validate";
import { env } from "./config/env";
import { logDatabaseConnection } from "./db/prisma";

const app = express();

const devOriginPattern =
  /^https?:\/\/(localhost|127\.0\.0\.1|\d{1,3}(?:\.\d{1,3}){3})(:\d+)?$/;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const allowed = [env.corsOrigin, "http://localhost:3000", "http://127.0.0.1:3000"];
      if (allowed.includes(origin) || devOriginPattern.test(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "NextBuzz API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/debug", debugRoutes);

app.use(errorHandler);

app.listen(env.port, async () => {
  console.log(`NextBuzz API running on http://localhost:${env.port}`);
  try {
    await logDatabaseConnection();
  } catch (error) {
    console.error("Failed to connect to database on startup:", error);
  }
});

export default app;
