import express from "express";
import { authMiddleware } from "../middlewares/isAuth.js";
import { addAddress, deleteUserAddress, getAllAddresses, getSingleAddress } from "../controllers/address.js";

const AddressRouter=express()

AddressRouter.post("/addAddress",authMiddleware,addAddress)
AddressRouter.get("/allAddresses",authMiddleware,getAllAddresses)
AddressRouter.get("/singleAddress/:id",authMiddleware,getSingleAddress)
AddressRouter.delete("/deleteAddress/:id",authMiddleware,deleteUserAddress)

export default AddressRouter;