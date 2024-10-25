import bcrypt from "bcryptjs";
import { Request, Response } from "express";

import Teacher, { ITeacher } from "../models/Teacher";
import fs from "fs";
import csv from "csv-parser";

import parseExcel from "../helper/parseExcel";
import parseCSV from "../helper/pareseCSV";
import { logActivity } from "../helper/logActivity";
import mongoose from "mongoose";

// register a new teacher
export const teacherRegister = async (
  req: Request & { user?: { _id: string; name: string } },
  res: Response
): Promise<Response> => {
  // Destructure properties from the request body
  const {
    name,
    email,
    phone,
    password,
    date_of_birth,
    gender,
    address,
    image,
    qualifications,
    subjects,
    classes,
    salary,
    schedule,
  }: ITeacher = req.body; // Type the destructured object as ITeacher

  try {
    // Check if the email already exists
    const isEmailExist = await Teacher.findOne({ email });

    // If the email already exists, return an error
    if (isEmailExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create a new teacher
    const teacher: ITeacher = await Teacher.create({
      name,
      email,
      phone,
      password: hashedPassword, // Store the hashed password
      date_of_birth,
      gender,
      address,
      image,
      qualifications,
      subjects,
      classes,
      salary,
      employment_status: "active", // Set default employment status
      hire_date: new Date(),
      schedule,
      // Set the current date as hire date
    });

    await logActivity({
      action: "create",
      resource: "Teacher",
      resourceId: teacher._id as string,
      userId: req.user?._id as string,
      userName: req.user?.name || "Unknown",
      description: `Registered teacher: ${teacher.name}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    return res
      .status(201)
      .json({ message: "Teacher registered successfully", teacher });
  } catch (error) {
    await logActivity({
      action: "create",
      resource: "Teacher",
      resourceId: "",
      userId: req.user?._id as string,
      userName: req.user?.name || "Unknown",
      description: `Failed to register teacher: ${error}`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "admin",
    });
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get all teachers
export const getAllTeachers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1); // Ensure page is at least 1
    const limit = Math.max(parseInt(req.query.limit as string, 10) || 10, 1);
    const search = req.query.search || "";

    const totalTeachers = await Teacher.countDocuments();
    const totalPages = Math.ceil(totalTeachers / limit);

    const searchQuery = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
    const teachers = await Teacher.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "subjects",
        select: "name",
      })
      .populate({
        path: "classes",
        select: "name",
      })
      .populate({
        path: "schedule.class",
        select: "name",
      })
      .populate({
        path: "schedule.subject",
        select: "name",
      });

    return res.status(200).json({
      teachers,
      page,
      limit,
      totalPages,
      totalTeachers,
      currentPage: page,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get single teacher
export const getSingleTeacher = async (
  req: Request & { user?: { _id: string; name: string } },
  res: Response
): Promise<Response> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid teacher ID" });
    }

    const isExisted = await Teacher.findById(req.params.id);

    if (!isExisted) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const teacher = await Teacher.findById(req.params.id)
      .populate({
        path: "subjects",
        select: "name",
      })
      .populate({ path: "classes", select: "name" }); // Populate subjects

    await logActivity({
      action: "read",
      resource: "Teacher",
      resourceId: req.params.id,
      userId: req.user?._id as string,
      userName: req.user?.name || "Unknown",
      description: `Viewed teacher: ${teacher?.name}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    return res.status(200).json(teacher);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// update teacher
export const updateTeacher = async (
  req: Request & { user?: { _id: string; name: string } },
  res: Response
): Promise<Response> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid teacher id" });
    }

    const isExisted = await Teacher.findById(req.params.id);

    if (!isExisted) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    await logActivity({
      action: "update",
      resource: "Teacher",
      resourceId: req.params.id,
      userId: req.user?._id as string,
      userName: req.user?.name || "Unknown",
      description: `Updated teacher: ${updatedTeacher?.name}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    return res
      .status(200)
      .json({ updatedTeacher, message: "Teacher updated sucessfully" });
  } catch (error) {
    await logActivity({
      action: "update",
      resource: "Teacher",
      resourceId: req.params.id,
      userId: req.user?._id as string,
      userName: req.user?.name || "Unknown",
      description: `Failed to update teacher: ${error}`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// delete teacher
export const deleteTeacher = async (
  req: Request & { user?: { _id: string; name: string } },
  res: Response
): Promise<Response> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid teacher id" });
    }

    const isExisted = await Teacher.findById(req.params.id);

    if (!isExisted) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

    await logActivity({
      action: "delete",
      resource: "Teacher",
      resourceId: req.params.id,
      userId: req.user?._id as string,
      userName: req.user?.name || "Unknown",
      description: `Deleted teacher: ${deletedTeacher?.name}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    return res
      .status(200)
      .json({ deletedTeacher, message: "Teacher deleted sucessfully" });
  } catch (error) {
    await logActivity({
      action: "delete",
      resource: "Teacher",
      resourceId: req.params.id,
      userId: req.user?._id as string,
      userName: req.user?.name || "Unknown",
      description: `Failed to delete teacher: ${error}`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "admin",
    });
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const importTeachers = async (req: any, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileExtension = req.file.originalname.split(".").pop()?.toLowerCase();
  const filePath = req.file.path;

  try {
    let dataToInsert: any[] = [];

    if (fileExtension === "csv") {
      dataToInsert = await parseCSV(filePath);
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      dataToInsert = await parseExcel(filePath);
    } else {
      throw new Error("Unsupported file format");
    }

    const totalRecords = dataToInsert.length;
    let processedRecords = 0;

    for (const item of dataToInsert) {
      // Parse subjects and classes
      item.subjects = JSON.parse(item.subjects.replace(/'/g, '"'));
      item.classes = JSON.parse(item.classes.replace(/'/g, '"'));

      // Parse schedule
      item.schedule = JSON.parse(item.schedule.replace(/'/g, '"'));

      // Convert date strings to Date objects
      item.date_of_birth = new Date(item.date_of_birth);
      item.hire_date = new Date(item.hire_date);
      console.log(item);
      await Teacher.create(item);
      processedRecords++;
    }

    await logActivity({
      action: "import",
      resource: "Teacher",
      resourceId: req.params.id,
      userId: req.user?._id as string,
      userName: req.user?.name || "Unknown",
      description: `Imported ${processedRecords} teachers`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    const progress = Math.round((processedRecords / totalRecords) * 100);
    res.json({ progress, message: "Students imported successfully" });
  } catch (error) {
    await logActivity({
      action: "import",
      resource: "Teacher",
      resourceId: req.params.id,
      userId: req.user?._id as string,
      userName: req.user?.name || "Unknown",
      description: `Failed to import teachers: ${error}`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "admin",
    });
    console.error("Import error:", error);
    res.status(500).json({ message: "An error occurred during import" });
  } finally {
    fs.unlinkSync(filePath); // Clean up the uploaded file
  }
};

export const getTeacherLists = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const teachers = await Teacher.find();
    return res.status(200).json(teachers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
