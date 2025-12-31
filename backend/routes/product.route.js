import express from "express";
import {
    getAllProducts,
    getProductBySlug,
    getProductsByCategory, 
    createProduct,
    updateProduct,
    deleteProduct 
} from "../controllers/product.controllers.js";

import protectRoute from "../middleware/protectRoute.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug); 
router.get("/category/:category", getProductsByCategory);

router.post("/", protectRoute, adminOnly, createProduct); // only logged-in users (admin check optional)
router.put("/:slug", protectRoute, adminOnly, updateProduct);
router.delete("/:slug", protectRoute, adminOnly,  deleteProduct);

export default router;
