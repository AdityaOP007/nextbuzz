import { Router } from "express";
import * as debugController from "../controllers/debug.controller";

const router = Router();

router.get("/db-status", debugController.getDbStatus);

export default router;
