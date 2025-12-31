/* const express = require("express") */
import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import cookieParser from "cookie-parser"
import authRoute from "./routes/auth.route.js"
import connectDB from "./DB/connectionDB.js"
import productRoute from './routes/product.route.js'
import wishListRoute from './routes/wishlist.route.js'
import cartRoute from './routes/cart.route.js'
import buyRoute from './routes/buy.route.js'
import cloudinary from "cloudinary"

dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
})

const app = express()

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
)

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({
    extended:true
}))
app.use(express.json({ limit: "5mb" })); // Allow larger image uploads
app.use(express.urlencoded({ extended: true, limit: "5mb" }));



const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoute)
app.use("/api/product", productRoute)
app.use("/api/wishlist", wishListRoute)
app.use("/api/cart", cartRoute)
app.use("/api/payment", buyRoute)

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on ${PORT}`)
    connectDB()
})
