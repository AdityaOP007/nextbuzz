import { Router } from "express";
import * as bookingController from "../controllers/booking.controller";
import { authenticate } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { createBookingSchema } from "../validators";

const router = Router();

router.post("/", authenticate, validateBody(createBookingSchema), bookingController.createBooking);
router.get("/user", authenticate, bookingController.getUserBookings);
router.get("/:id", authenticate, bookingController.getBookingById);

export default router;
