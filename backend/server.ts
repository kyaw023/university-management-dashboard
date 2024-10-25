import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import http from "http";

import path from "path";
import ejs from "ejs";
import { transport } from "./helper/sendEmail";
const cookieParser = require("cookie-parser");

// Import your routes and middlewares
import authRoutes from "./routes/authRoutes";
import adminAuthRoutes from "./routes/adminAuthRoutes";
import authMiddleware from "./middleware/authMiddleware";
import adminMiddleware from "./middleware/adminMiddleware";
import studentRoutes from "./routes/studentRoutes";
import teacherRoutes from "./routes/teacherRoutes";
import classRoutes from "./routes/classRoutes";
import subjectRoutes from "./routes/subjectRoutes";
import activityLogRoutes from "./routes/activityLogRoutes";
import examRoutes from "./routes/examRoutes";
import reportRoutes from "./routes/reportRoutes";
import libraryRoutes from "./routes/libraryRoutes";
import eventRoutes from "./routes/eventRoutes";
import userTeacherRoutes from "./routes/userTeacherRoutes";
import TeacherAuthMiddleware from "./middleware/teacherAuthMiddleware";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5173",
];

// Set up Socket.IO
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Middleware setup
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "./views");

const port = process.env.PORT || 3000;

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/students", authMiddleware, adminMiddleware, studentRoutes);
app.use("/api/admin/teachers", authMiddleware, adminMiddleware, teacherRoutes);
app.use("/api/admin/classes", authMiddleware, adminMiddleware, classRoutes);
app.use("/api/admin/subjects", authMiddleware, adminMiddleware, subjectRoutes);
app.use(
  "/api/admin/activity-log",
  authMiddleware,
  adminMiddleware,
  activityLogRoutes
);
app.use("/api/admin/reports", authMiddleware, adminMiddleware, reportRoutes);
app.use(
  "/api/admin/exam-management",
  authMiddleware,
  adminMiddleware,
  examRoutes
);
app.use("/api/admin/library", authMiddleware, adminMiddleware, libraryRoutes);
app.use("/api/admin/events", authMiddleware, adminMiddleware, eventRoutes);
app.use("/api/teacher", TeacherAuthMiddleware, userTeacherRoutes);

// Socket.IO event listeners
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Handle join event for user-specific rooms
  socket.on("join", (userId) => {
    console.log(`User ${userId} joined`);
    socket.join(userId); // Create a room for the user
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
