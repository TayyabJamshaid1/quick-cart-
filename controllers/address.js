import { Address } from "../models/Address.js";
import TryCatch from "../utils/tryCatch.js";

const addAddress = TryCatch(async (req, res) => {
  const { address, phone } = req.body;
  await Address.create({
    address,
    phone,
    user: req.userId,
  });
  res.json({
    message: "Address Created",
  });
});

const getAllAddresses = TryCatch(async (req, res) => {
  const addresses = await Address.find({ user: req.userId });
  res.json({ addresses });
});

const getSingleAddress = TryCatch(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.userId });
  res.json({address});
});

const deleteUserAddress = TryCatch(async (req, res) => {
  const address = await Address.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });
  res.json({ message: "Address deleted" });
});

export { addAddress, getAllAddresses, getSingleAddress, deleteUserAddress };
