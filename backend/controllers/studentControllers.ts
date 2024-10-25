import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import Student, { IStudent } from "../models/Student";
import mongoose from "mongoose";

import fs from "fs";
import csv from "csv-parser";

import parseExcel from "../helper/parseExcel";
import parseCSV from "../helper/pareseCSV";
import { logActivity } from "../helper/logActivity";
import Class from "../models/Class";

export const getAllStudents = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1); // Ensure page is at least 1
    const limit = Math.max(parseInt(req.query.limit as string, 10) || 10, 1);
    const search = req.query.search || "";

    const totalStudents = await Student.countDocuments();
    const totalPages = Math.ceil(totalStudents / limit);

    const searchQuery = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
    const students = await Student.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit);
    return res.status(200).json({
      students,
      page,
      limit,
      totalPages,
      totalStudents,
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
// student register
export const studentRegister = async (
  req: any,
  res: Response
): Promise<Response> => {
  // Destructure properties from request body
  const {
    name,
    email,
    password,
    phone,
    address,
    image,
    date_of_birth,
    gender,
    enrollment_date,
    grade,
    roll_no,
    attendance,
    father_name,
    mother_name,
    class: studentClass, // Rename 'class' to 'studentClass' to avoid conflict with reserved keyword
    status,
    emergency_contact,
    medical_conditions,
    notes,
  }: IStudent = req.body; // Type the destructured object as IStudent

  try {
    // Check if email already exists
    const isEmailExist = await Student.findOne({ email });

    // If email already exists, return error
    if (isEmailExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (roll_no && roll_no < 0) {
      return res
        .status(400)
        .json({ message: "Roll number cannot be negative" });
    }

    if (attendance && attendance < 0) {
      return res.status(400).json({ message: "Attendance cannot be negative" });
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create new student user
    const student: IStudent = await Student.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      image,
      date_of_birth,
      gender,
      roll_no,
      enrollment_date,
      grade,
      emergency_contact,
      attendance,
      medical_conditions,
      notes,
      father_name,
      mother_name,
      class: studentClass, // Use renamed variable 'studentClass'
      status,
    });

    // Find the class the student is enrolling in
    const classes = await Class.find({ _id: { $in: studentClass } });

    if (!classes || classes.length === 0) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Add the student to the class's 'students' array
    await Class.updateMany(
      { _id: { $in: studentClass } }, // Find classes that match the provided studentClass IDs
      { $push: { students: student._id } } // Add the student's ID to the 'students' array
    );

    await logActivity({
      action: "create",
      resource: "Student",
      resourceId: student._id as any,
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Created student: ${student.name}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    return res
      .status(200)
      .json({ message: "Registration successful", student });
  } catch (error) {
    await logActivity({
      action: "create",
      resource: "Student",
      resourceId: "",
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Failed to create student: ${error}`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "admin",
    });
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// update student
export const updateStudent = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const studentId = req.params.id;

    // Validate student ID
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).send({ error: "Invalid or missing student ID" });
    }

    // Fetch the current student document
    const currentStudent = await Student.findById(studentId);
    if (!currentStudent) {
      return res.status(404).send({ error: "Student not found" });
    }

    const { class: studentClasses } = req.body;

    // Prepare the update data
    const updateData: any = {
      ...req.body,
      // Add new fields if they are not present
      roll_no: req.body.roll_no || currentStudent.roll_no || 0, // Default to 0 if not provided and not existing
      father_name:
        req.body.father_name || currentStudent.father_name || "Unknown", // Default value
      mother_name:
        req.body.mother_name || currentStudent.mother_name || "Unknown", // Default value
    };

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true, runValidators: true } // Ensure validators run on the update
    );

    // If classes are provided, add the student to the new class(es)
    if (studentClasses && studentClasses.length > 0) {
      // Remove the student from old classes, if necessary
      await Class.updateMany(
        { students: studentId },
        { $pull: { students: studentId } } // Remove the student ID from old classes
      );

      // Add the student to the new classes
      await Class.updateMany(
        { _id: { $in: studentClasses } },
        { $addToSet: { students: studentId } } // Add the student's ID to the new classes
      );
    }

    await logActivity({
      action: "update",
      resource: "Student",
      resourceId: studentId,
      userId: req.user._id as any,
      userName: req.user.name as string,
      description: `Updated student: ${currentStudent.name}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    return res
      .status(200)
      .json({ updatedStudent, message: "Student updated successfully" });
  } catch (error) {
    await logActivity({
      action: "update",
      resource: "Student",
      resourceId: req.params.id,
      userId: req.user._id as any,
      userName: req.user.name as string,
      description: `Failed to update student: ${req.params.id}`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "admin",
    });
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// delete student
export const deleteStudent = async (
  req: any,
  res: Response
): Promise<Response> => {
  const studentId = req.params.id; // or wherever the ID is coming from
  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).send({ error: "Invalid or missing student ID" });
  }
  const deletedStudent = await Student.findByIdAndDelete(studentId);
  try {
    await logActivity({
      action: "delete",
      resource: "Student",
      resourceId: studentId,
      userId: req.user._id as any,
      userName: req.user.name as string,
      description: `Deleted student: ${deletedStudent?.name}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    return res
      .status(200)
      .json({ deletedStudent, message: "Student deleted sucessfully" });
  } catch (error) {
    await logActivity({
      action: "delete",
      resource: "Student",
      resourceId: req.params.id,
      userId: req.user._id as any,
      userName: req.user.name as string,
      description: `Deleted student: ${deletedStudent?.name}`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "admin",
    });
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get single student
export const getSingleStudent = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const studentId = req.params.id; // or wherever the ID is coming from
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).send({ error: "Invalid or missing student ID" });
    }
    const student = await Student.findById(studentId).populate({
      path: "class",
      select: "name",
    });

    await logActivity({
      action: "read",
      resource: "Student",
      resourceId: studentId,
      userId: req.user._id as any,
      userName: req.user.name as string,
      description: `Viewed student: ${student?.name}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    return res.status(200).json(student);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// import students

export const importStudents = async (req: any, res: Response) => {
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
      await Student.create(item);
      processedRecords++;
    }

    await logActivity({
      action: "import",
      resource: "Student",
      userId: req.user._id as any,
      resourceId: req.user._id as any,
      userName: req.user.name as string,
      description: `Imported ${processedRecords} students`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    const progress = Math.round((processedRecords / totalRecords) * 100);
    res.json({ progress, message: "Students imported successfully" });
  } catch (error) {
    await logActivity({
      action: "import",
      resource: "Student",
      userId: req.user._id as any,
      resourceId: req.user._id as any,
      userName: req.user.name as string,
      description: `Imported  students`,
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
