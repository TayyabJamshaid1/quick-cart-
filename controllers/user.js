import { OTP } from "../models/Otp.js";
import { User } from "../models/user.js";
import sendOtp from "../utils/sendOtp.js";
import TryCatch from "../utils/tryCatch.js";
import jwt from "jsonwebtoken";
const loginUser = TryCatch(async (req, res) => {
  const { email } = req.body;
  const subject = "Eccomerce App";
  const otp = Math.floor(Math.random() * 1000000);

  const previousOtp = await OTP.findOne({ email });
  if (previousOtp) {
    await previousOtp.deleteOne();
  }
  await sendOtp({ email, subject, otp });
  await OTP.create({ email, otp });

  res.json({ message: "OTP SENT SUCCESSfully" });
});
const verifyUser = TryCatch(async (req, res) => {
  const { email, otp } = req.body;
  const haveOtp = await OTP.findOne({
    email,
    otp,
  });
  if (!haveOtp) {
    return res.status(400).json({
      message: "Wrong Otp",
    });
  }
  let user = await User.findOne({ email });
  if (user) {
    let token = jwt.sign({ _id: user._id,email }, process.env.JWT_SEC, {
      expiresIn: "15d",
    });
    await haveOtp.deleteOne();
    return res.json({
      message: "User Logged In",
      token,
      user,
    });
  } else {
    user = await User.create({ email });
    let token = jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
      expiresIn: "15d",
    });
    await haveOtp.deleteOne();
    return res.json({
      message: "User Registered",
      token,
      user,
    });
  }
});
const userProfile=TryCatch(async(req,res)=>{
const user=await User.findById(req.userId);
if (user){
     return res.json({
     
      user,
    });
}
})
export { loginUser ,verifyUser,userProfile};
