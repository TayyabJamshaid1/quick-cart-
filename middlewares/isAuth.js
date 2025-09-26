import jwt from "jsonwebtoken"
import { User } from "../models/user.js";

const authMiddleware=async(req,res,next)=>{
    try{
const token=req.header("Authorization");
if (!token){
    return res.status(401).json({message:"Unauthorized HTTP, Token not provided"})
}
const jwtToken=token.replace("Bearer","").trim();
const isVerified=jwt.verify(jwtToken,process.env.JWT_SEC)
const UserData=await User.findById(isVerified._id)
if (!UserData) return res.json({success:false,message:"User not found"});

req.user=UserData;
req.token=UserData.token;
req.userId=UserData._id;
next();
    }catch(err){
console.log(err);

    }
}
export {authMiddleware};