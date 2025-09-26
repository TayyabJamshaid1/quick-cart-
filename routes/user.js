import express from "express";
import { loginUser, userProfile, verifyUser } from "../controllers/user.js";
import { authMiddleware } from "../middlewares/isAuth.js";
const router=express()

router.post("/login",loginUser)
router.post("/verifyUser",verifyUser)
router.get("/user/me",authMiddleware,userProfile)
export default router;