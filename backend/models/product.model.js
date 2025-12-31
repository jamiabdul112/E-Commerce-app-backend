import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true 
    },
    description: {
        type: String
    },
    images: {
        type: String,
        default : ""
    },
    price: { 
        type: Number, 
        required: true 
    
    },
    currency: { 
        type: String, 
        default: "INR" 
    },
    stock: { 
        type: Number, 
        default: 0 
    },

    // ✅ Categories as plain strings
    categories: { 
        type: String,
        
    },

    
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
