import express from "express";
import { addToWishlist, removeFromWishlist, getWishlist } from "../controllers/wishlist.controllers.js";

import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getWishlist);
router.post("/add", protectRoute, addToWishlist);
router.post("/remove", protectRoute, removeFromWishlist);

export default router;
