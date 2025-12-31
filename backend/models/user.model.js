import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    username: { 
        type: String,
        required: true, 
        unique: true 
    },
    fullName: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String,
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true, 
        minLength: 6 
    },
    role: { 
        type: String, 
        enum: ["customer", "admin"], 
        default: "customer" 
    },
    address:{ 
        type: String , 
        required: true
    },
    wishlist: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Product" 
        }
    ]
}, {timestamps : true})

const User = mongoose.model("User", UserSchema)
export default User