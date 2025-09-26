import express from "express";
import dotenv from "dotenv"
dotenv.config();
import { connectDB } from "./db/db.js";
import cors from "cors"
import userRoutes from "./routes/user.js";
import cloudinary from 'cloudinary'
import productRoutes from "./routes/product.js";
import CartRouter from "./routes/cart.js";
import AddressRouter from "./routes/address.js";
import OrderRouter from "./routes/order.js";
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});


const app=express();
app.use(express.json())
app.use(cors())
//importing routes
app.use("/api/auth",userRoutes )
app.use("/api/product",productRoutes )
app.use("/api/cart",CartRouter )
app.use("/api/address",AddressRouter )
app.use("/api/order",OrderRouter )

const port=process.env.PORT;
//connect to db
await connectDB();
app.listen(port,()=>{
    console.log(`server is running on ${port}`);
    
})