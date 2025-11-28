import mongoose from "mongoose";
import { User } from "models/user.js";

const MONGODB_URI = "mongodb+srv://ranisahu95590:ranisahu95590@cluster0.aeycrcd.mongodb.net/quickshow";

const connectAndInsert = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const user = await User.create({
      _id: "1",
      name: "Rani",
      email: "rani@example.com",
      image: "profile.jpg",
    });

    console.log("✅ User inserted:", user);
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error:", err);
  }
};

connectAndInsert();
