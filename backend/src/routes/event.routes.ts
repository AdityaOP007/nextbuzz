import { Router } from "express";
import * as eventController from "../controllers/event.controller";
import { authenticate } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { createEventSchema, updateEventSchema } from "../validators";

const router = Router();

router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);
router.post("/", authenticate, validateBody(createEventSchema), eventController.createEvent);
router.put("/:id", authenticate, validateBody(updateEventSchema), eventController.updateEvent);
router.delete("/:id", authenticate, eventController.deleteEvent);

export default router;
