import Product from "../models/product.model.js";

export const buyNow = async (req, res) => {
    try {
        const { slug } = req.params;
        const { quantity } = req.body;
        const qty = parseInt(quantity) || 1;

        const product = await Product.findOne({ slug });
        if (!product) return res.status(404).json({ message: "Product not found" });

        const shopUpiId = process.env.SHOP_UPI_ID; // e.g. name@okaxis
        const shopName = "Abdul Salam Store";

        const totalPrice = (product.price * qty).toFixed(2);
        const note = `Order for ${product.title} (x${qty})`;

        // Build Standard UPI Deep Link
        const upiLink = `upi://pay?pa=${shopUpiId}&pn=${encodeURIComponent(shopName)}&am=${totalPrice}&cu=INR&tn=${encodeURIComponent(note)}`;

        res.status(200).json({
            upiLink,
            totalPrice,
            product: product.title
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};