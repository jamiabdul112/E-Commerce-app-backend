import User from "../models/user.model.js";
import Product from "../models/product.model.js";

// Add product to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.wishlist.includes(productId)) {
            return res.status(400).json({ message: "Product already in wishlist" });
        }

        user.wishlist.push(productId);
        await user.save();

        res.status(200).json({ message: "Product added to wishlist", wishlist: user.wishlist });
    } catch (error) {
        console.error("addToWishlist error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();

        res.status(200).json({ message: "Product removed from wishlist", wishlist: user.wishlist });
    } catch (error) {
        console.error("removeFromWishlist error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get user's wishlist
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate("wishlist");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user.wishlist);
    } catch (error) {
        console.error("getWishlist error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
