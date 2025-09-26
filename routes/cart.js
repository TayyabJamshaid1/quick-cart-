import express from "express";
import { authMiddleware } from "../middlewares/isAuth.js";
import { addToCart, fetchCart, removeFromCart, updateCart } from "../controllers/cart.js";

const CartRouter=express()

CartRouter.post("/addCart",authMiddleware,addToCart)
CartRouter.get("/removeCart/:id",authMiddleware,removeFromCart)
CartRouter.put("/updateCart",authMiddleware,updateCart)
CartRouter.get("/fetchCart",authMiddleware,fetchCart)


export default CartRouter;