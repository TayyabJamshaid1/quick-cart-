import mongoose from "mongoose";

export const connectDB = async () => {
  try {
   
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "eccomercesep",
    });
          console.log("Connected to DB");

    //  mongoose.connection.on("connected", () => {
    //   console.log("Connected to DB");
    // });
    // await mongoose.connect("mongodb://localhost:27017/eccomercesep");
  } catch (err) {
    console.error("DB Connection Error:", err);
    process.exit(1); // Exit if DB connection fails
  }
};
