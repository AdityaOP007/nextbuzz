import { Router } from "express";
import * as cartController from "../controllers/cart.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, cartController.getCart);
router.put("/sync", authenticate, cartController.syncCart);
router.post("/:eventId", authenticate, cartController.addToCart);
router.delete("/:eventId", authenticate, cartController.removeFromCart);

export default router;
