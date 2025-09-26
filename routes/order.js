import express from "express";
import { authMiddleware } from "../middlewares/isAuth.js";
import { getAllOrders, getAllOrdersAdmin, getMyOrder, getStats, newOrderCod, newOrderOnline, updateStatus, verifyPayment } from "../controllers/order.js";

const OrderRouter=express()

OrderRouter.post("/cod",authMiddleware,newOrderCod)
OrderRouter.get("/all", authMiddleware, getAllOrders);
OrderRouter.get("/admin/all", authMiddleware, getAllOrdersAdmin);
OrderRouter.get("/:id", authMiddleware, getMyOrder);
OrderRouter.post("/:id", authMiddleware, updateStatus);
OrderRouter.get("/admin/stats", authMiddleware, getStats);

OrderRouter.post("/new/online", authMiddleware, newOrderOnline);
OrderRouter.post("/verify/payment", authMiddleware, verifyPayment);
export default OrderRouter;