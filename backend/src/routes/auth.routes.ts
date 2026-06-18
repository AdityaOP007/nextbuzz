import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from "../validators";

const router = Router();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);
router.get("/me", authenticate, authController.getMe);
router.put("/profile", authenticate, validateBody(updateProfileSchema), authController.updateProfile);

export default router;
