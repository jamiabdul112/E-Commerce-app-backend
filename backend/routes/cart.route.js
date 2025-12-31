import express from "express";
import { addToCart, getCart, removeFromCart, clearCart, updateCartQuantity } from "../controllers/cart.controllers.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getCart);
router.post("/add", protectRoute, addToCart);
router.post("/remove", protectRoute, removeFromCart);
router.post("/clear", protectRoute, clearCart);
// routes/cart.routes.js
router.post("/update", protectRoute, updateCartQuantity);


export default router;
