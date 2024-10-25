import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../models/User";
import createToken from "../helper/createToken";
import { logActivity } from "../helper/logActivity";
import mongoose from "mongoose";

export const adminLogin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // Get email and password from request body
  const { email, password } = req.body;

  try {
    // Check if email exists
    const user = await User.findOne({ email });

    // If email doesn't exist, return error
    if (!user) {
      return res.status(400).json({ message: "Email doesn't exist" });
    }

    // Check if user is an admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // If password is incorrect, return error
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    // create token
    const token = createToken(user._id as string);

    res.cookie("adminAuthToken", token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour expiration
    });

    await logActivity({
      action: "login",
      resource: "admin",
      resourceId: user._id as string,
      userId: user._id as string,
      userName: user.name,
      description: `Admin ${user.name} logged in successfully.`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,

        image: user.image,
        date_of_birth: user.date_of_birth,
        gender: user.gender,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    await logActivity({
      action: "login",
      resource: "admin",
      resourceId: "123",
      userId: "123",
      userName: "admin",
      description: `Admin login failed. Error: ${error}`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "admin",
    });
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkSession = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user; // Get user ID from the verified token
    const user = await User.findById(userId).select("-password"); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user); // Return user information
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const adminLogout = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    res.clearCookie("token");
    await logActivity({
      action: "logout",
      resource: "admin",
      resourceId: req.user._id as string,
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Admin ${req.user.name} logged out successfully.`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    await logActivity({
      action: "logout",
      resource: "admin",
      resourceId: req.user._id as string,
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Admin ${req.user.name} failed to log out.`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "admin",
    });
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCurrentAdmin = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    console.log(user);
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCurrentAdmin = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.params.id;
    console.log("userId", userId);
    console.log("req.body", req.body);

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ error: "Invalid or missing admin ID" });
    }

    const updateData = {
      name: req.body.name,
      email: req.body.email,
      bio: req.body.bio,
      date_of_birth: req.body.date_of_birth,
      gender: req.body.gender,
      address: req.body.address,
      phone: req.body.phone,
      image: req.body.image,
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    console.log("updatedUser", updatedUser);
    return res.status(200).json({
      message: "Admin Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
