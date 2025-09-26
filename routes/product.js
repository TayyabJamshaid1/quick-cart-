import express from "express";
import { authMiddleware } from "../middlewares/isAuth.js";
import { createProduct, getAllProducts, getSingleProduct, updateProduct, updateProductImage } from "../controllers/product.js";
import uploadFiles from "../middlewares/multer.js";
const productRouter=express()

productRouter.post("/createProduct",authMiddleware,uploadFiles,createProduct)
productRouter.get("/getProducts",getAllProducts)
productRouter.get("/singleProduct/:id",getSingleProduct)
productRouter.put("/product/:id", authMiddleware, updateProduct);
productRouter.post("/product/:id", authMiddleware, uploadFiles, updateProductImage);

export default productRouter;