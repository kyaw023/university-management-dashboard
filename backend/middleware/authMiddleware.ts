import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface JwtPayload {
  _id: string;
}

const AuthMiddleWare = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.adminAuthToken;

    if (!token) {
      res
        .status(400)
        .json({ message: "Token is required for authentication." });
      return;
    }

    // Verify the token and get the decoded token
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    console.log(decodedToken);

    // Find the user by the decoded token's ID
    const user = await User.findById(decodedToken._id);

    console.log(user);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (err: any) {
    console.log(err);
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      res.status(401).json({ message: "Invalid or expired token." });
    } else {
      console.error(err);
      res.status(500).json({ message: "Internal server error." });
    }
  }
};

export default AuthMiddleWare;
