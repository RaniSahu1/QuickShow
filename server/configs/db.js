import mongoose from "mongoose";    

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("Database connected successfully") );
    await mongoose.connect(`${process.env.MONGODB_URI}/quickshow`)
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    
  }}

export default connectDB;   