import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity || 1;
        } else {
            cart.items.push({ product: productId, quantity: quantity || 1 });
        }

        await cart.save();
        res.status(200).json({ message: "Product added to cart", cart });
    } catch (error) {
        console.error("addToCart error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get cart
export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart) return res.status(200).json({ items: [] });

        res.status(200).json(cart);
    } catch (error) {
        console.error("getCart error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();
        res.status(200).json({ message: "Product removed from cart", cart });
    } catch (error) {
        console.error("removeFromCart error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Clear cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = [];
        await cart.save();

        res.status(200).json({ message: "Cart cleared", cart });
    } catch (error) {
        console.error("clearCart error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// controllers/cart.controllers.js
export const updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find(i => i.product.toString() === productId);
        if (!item) return res.status(404).json({ message: "Item not found in cart" });

        item.quantity = quantity;
        await cart.save();

        res.status(200).json({ message: "Quantity updated", cart });
    } catch (error) {
        console.error("updateCartQuantity error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
