import { Product } from "../models/product.js";
import bufferGenerator from "../utils/bufferGenerator.js";
import TryCatch from "../utils/tryCatch.js";
import cloudinary from "cloudinary";
const createProduct = TryCatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({
      message: "Unauthorized person",
    });
  }

  const { title, description, stock, price, category, about } = req.body;
  const files = req.files;
  if (!files || req.files.length == 0) {
    return res.status(400).json({
      message: "No files to upload",
    });
  }
  const uploadedImages = files.map(async (file) => {
    const bufferFile = bufferGenerator(file);
    const result = await cloudinary.v2.uploader.upload(bufferFile.content);
    return {
      id: result.public_id,
      url: result.secure_url,
    };
  });
  const uploadedAllResolvedImages = await Promise.all(uploadedImages);
  let product = await Product.create({
    title,
    description,
    stock,
    price,
    about,
    category,
    images: uploadedAllResolvedImages,
  });
  return res.status(200).json({
    message: "Product created successfully",
    product,
  });
});

const getAllProducts = TryCatch(async (req, res) => {
  const { search, category, page, sortByPrice } = req.query;
  let filters = {};
  if (search) {
    filters.title = {
      $regex: search,
      $options: "i", //for both capital & small
    };
  }
  if (category) {
    filters.category = category;
  }
  let limit = 8;
  let skip = (page - 1) * limit;
  let sortOption = {
    createdAt: -1, //it means jo product latest create huay wo filter kr k du
  };
  if (sortByPrice) {
    if (sortByPrice === "lowToHigh") {
      sortOption = {
        price: 1,
      };
    } else if (sortByPrice === "highToLow") {
      sortOption = {
        price: -1,
      };
    }
  }
  let products = await Product.find(filters)
    .sort(sortOption)
    .limit(limit)
    .skip(skip);
  const categories = await Product.distinct("category");
  const newProduct = await Product.find().sort("-createdAt").limit(4);
  const totalDocuments = await Product.countDocuments();
  const totalPages = Math.ceil(totalDocuments / limit);
  return res
    .status(200)
    .json({ products, categories, totalDocuments, totalPages, newProduct });
});

const getSingleProduct=TryCatch(async(req,res)=>{
    console.log(req.params.id);
    
    const product=await Product.findById(req.params.id)
    console.log(product);
    
    const relatedProducts=await Product.find({category:Product.category,_id:{$ne:Product._id}})
    res.json({product,relatedProducts})
})
const updateProductImage = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

  const { id } = req.params;
  const files = req.files;

  if (!files || files.length === 0)
    return res.status(400).json({
      message: "no files to upload",
    });

  const product = await Product.findById(id);

  if (!product)
    return res.status(404).json({
      message: "Product not found",
    });

  const oldImages = product.images || [];

  for (const img of oldImages) {
    if (img.id) {
      await cloudinary.v2.uploader.destroy(img.id);
    }
  }

  const imageUploadPromises = files.map(async (file) => {
    const fileBuffer = bufferGenerator(file);

    const result = await cloudinary.v2.uploader.upload(fileBuffer.content);

    return {
      id: result.public_id,
      url: result.secure_url,
    };
  });

  const uploadedImage = await Promise.all(imageUploadPromises);

  product.images = uploadedImage;

  await product.save();

  res.status(200).json({
    message: "Image updated",
    product,
  });
});
 const updateProduct = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

  const { title, about, category, price, stock } = req.body;

  const updateFields = {};

  if (title) updateFields.title = title;
  if (about) updateFields.about = about;
  if (stock) updateFields.stock = stock;
  if (price) updateFields.price = price;
  if (category) updateFields.category = category;

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { new: true, runValidators: true }
  );

  if (!updatedProduct)
    return res.status(404).json({
      message: "Product not found",
    });

  res.json({
    message: "Product Updated",
    updatedProduct,
  });
});
export { createProduct,getAllProducts ,getSingleProduct,updateProductImage,updateProduct};
