import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}`);
    console.log("Database Connected");
  } catch (error) {
    console.log("Database Connection Failed");
    console.log(error.message);
    process.exit(1);
  }
};
