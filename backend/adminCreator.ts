import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User, { IUser } from "./models/User"; // Adjust the path accordingly

dotenv.config();

const createAdmin = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("Connected to MongoDB");

    // Check if the admin user already exists
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash("adminPassword123", 10);
    const admin: IUser = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    // Save the admin user to the database
    await admin.save();
    console.log("Admin user created successfully!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
};

// Execute the function
createAdmin();
