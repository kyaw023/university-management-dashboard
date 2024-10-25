import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import createToken from "../helper/createToken";
import { logActivity } from "../helper/logActivity";
import Teacher from "../models/Teacher";

export const teacherLogin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // Get email and password from request body
  const { email, password } = req.body;

  try {
    // Check if email exists
    const user = await Teacher.findOne({ email });

    // If email doesn't exist, return error
    if (!user) {
      return res.status(400).json({ message: "Email doesn't exist" });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // If password is incorrect, return error
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    // create token
    const token = createToken(user._id as string);

    res.cookie("teacherAuthToken", token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour expiration
    });

    await logActivity({
      action: "login",
      resource: "teacher",
      resourceId: user._id as string,
      userId: user._id as string,
      userName: user.name,
      description: `Teacher ${user.name} logged in successfully.`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "teacher",
    });

    // remove password from user object

    const { password: _, ...rest } = user.toObject();

    return res.status(200).json({
      message: "Login successful",
      success: true,
      user: rest,
      token,
    });
  } catch (error) {
    await logActivity({
      action: "login",
      resource: "teacher",
      resourceId: "123",
      userId: "123",
      userName: "John Doe",
      description: `Teacher login failed. Error: ${error}`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "teacher",
    });
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkSession = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    console.log(req.user);
    const userId = req.user; // Get user ID from the verified token
    const user = await Teacher.findById(userId).select("-password");

    console.log(user); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user); // Return user information
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const teacherLogout = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
