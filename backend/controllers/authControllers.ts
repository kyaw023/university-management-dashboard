import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import createToken from "../helper/createToken";
import Teacher from "../models/Teacher";
import { logActivity } from "../helper/logActivity";

export const login = async (req: Request, res: Response): Promise<Response> => {
  // Get email and password from request body
  const { email, password } = req.body;

  try {
    // Check if email exists
    const user = await User.findOne({ email });

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

    return res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

