import mongoose from "mongoose";

// Connect to MongoDB
async function dbConect() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Databasse Connected sucessfully");
  } catch (error) {
    console.log(error);
  }
}

export default dbConect;
