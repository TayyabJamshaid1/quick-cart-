import { Cart } from "../models/Cart.js";
import { Product } from "../models/product.js";
import TryCatch from "../utils/tryCatch.js";

const addToCart = TryCatch(async (req, res) => {
  const { product } = req.body;

  const cart = await Cart.findOne({
    product: product,
    user: req.userId,
  }).populate("product");

  if (cart) {
    if (cart.quantity === cart.product.stock) {
      return res.status(400).json({
        message: "Out of stock item",
      });
    }
    cart.quantity += 1;
    await cart.save();

    return res.json({
      message: "Added to cart",
    });
  }
  const cartProduct = await Product.findById(product);
  if (cartProduct.stock == 0) {
    return res.status(400).json({
      message: "Out of stock item",
    });
  }
  await Cart.create({ product, user: req.userId, quantity: 1 });
  return res.status(200).json({
    message: "Add to Cart",
  });
});
const removeFromCart = TryCatch(async (req, res) => {
  await Cart.findByIdAndDelete(req.params.id);
  return res.status(200).json({
    message: "Remove from Cart",
  });
});

const updateCart = TryCatch(async (req, res) => {
  const { action } = req.query;

  if (action == "inc") {
    const { id } = req.body;
    const cart = await Cart.findById(id).populate("product");

    if (cart.quantity < cart.product.stock) {
      cart.quantity++;
      await cart.save();
      return res.status(200).json({
        message: "Quantity updated",
      });
    } else {
      return res.status(400).json({
        message: "Out of stock item",
      });
    }
  } else if (action == "dec") {
    const { id } = req.body;
    const cart = await Cart.findById(id).populate("product");
    if (cart.quantity > 1) {
      cart.quantity--;
      await cart.save();
      return res.status(200).json({
        message: "Quantity updated",
      });
    } else {
      return res.status(400).json({
        message: "You have only one item",
      });
    }
  }
});
const fetchCart=TryCatch(async(req,res)=>{
  const cart=await Cart.find({user:req.userId}).populate("product")
  const sumOfQuantities=cart.reduce((acc,curr)=>{
    acc=acc+curr.quantity
    return acc
  },0)  
  const totalPrice=cart.reduce((acc,curr)=>{
    acc=acc+curr.quantity*curr.product.price
    return acc
  },0)  
  console.log(totalPrice);
  
  res.json({cart,sumOfQuantities,totalPrice})
})
export { addToCart, removeFromCart, updateCart,fetchCart };
