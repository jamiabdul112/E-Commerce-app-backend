import express from "express";
import { buyNow } from "../controllers/buy.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/buy/:slug", protectRoute, buyNow);

export default router;
