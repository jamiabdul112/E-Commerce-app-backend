// POST create product
import Product from "../models/product.model.js";
import cloudinary from "cloudinary"


export const createProduct = async (req, res) => {
    try {
        const { title, slug, description, price, stock, categories, images } = req.body;

        // 1. Basic Validation
        if (!title || !slug || !price || !categories) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        // 2. Check if slug exists
        const existing = await Product.findOne({ slug });
        if (existing) return res.status(409).json({ message: "Slug already exists" });

        // 3. Upload to Cloudinary if image exists
        let imageUrl = "";
        if (images) {
            const uploadedResponse = await cloudinary.uploader.upload(images, {
                folder: "products", // Optional: organizes images in Cloudinary
            });
            imageUrl = uploadedResponse.secure_url;
        }

        // 4. Create Product
        const newProduct = new Product({
            title,
            slug,
            description,
            images: imageUrl,
            price: Number(price),
            stock: Number(stock) || 0,
            categories,
        });

        await newProduct.save();
        res.status(201).json({ message: "Product created successfully", product: newProduct });

    } catch (error) {
        console.error("createProduct error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};
// controllers/product.controllers.js
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.error("getAllProducts error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const product = await Product.findOne({ slug });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (error) {
        console.error("getProductBySlug error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
  
export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ categories: category }).sort({createdAt:-1});
        res.status(200).json(products);
    } catch (error) {
        console.error("getProductsByCategory error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const updateProduct = async (req, res) => {
    try {
        const { slug } = req.params;
        const updates = req.body;

        const product = await Product.findOne({ slug });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // ✅ Handle single image replacement
        if (updates.images) {
            if (product.images) {
                // destroy old image using its public_id or filename
                await cloudinary.uploader.destroy(
                    product.images.split("/").pop().split(".")[0]
                );
            }
            const uploadedResponse = await cloudinary.uploader.upload(updates.images);
            updates.images = uploadedResponse.secure_url;
        }

        // ✅ Apply updates
        const updatedProduct = await Product.findOneAndUpdate(
            { slug },
            { $set: updates },
            { new: true }
        );

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error("updateProduct error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { slug } = req.params;

        // Find product by slug
        const product = await Product.findOne({ slug });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // ✅ Destroy Cloudinary image if it exists
        if (product.images) {
            await cloudinary.uploader.destroy(
                product.images.split("/").pop().split(".")[0]
            );
        }

        // ✅ Delete product from DB
        await Product.deleteOne({ slug });

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("deleteProduct error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
