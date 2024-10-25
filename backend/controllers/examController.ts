import fs from "fs";
import { Request, Response } from "express";
import Exam from "../models/Exam";
import sendExamNotifications from "../helper/sendEmail";
import parseCSV from "../helper/pareseCSV";
import parseExcel from "../helper/parseExcel";
import { logActivity } from "../helper/logActivity";
import mongoose from "mongoose";

// Create a new exam
export const createExam = async (req: any, res: Response) => {
  try {
    // Check if the exam already exists
    const isExamExist = await Exam.findOne({ name: req.body.name });
    if (isExamExist) {
      return res.status(400).json({ message: "Exam already exists" });
    }

    const exam = await Exam.create(req.body);

    await sendExamNotifications(exam, "created");

    // Add the exam to the class
    await logActivity({
      action: "create",
      resource: "Exam",
      resourceId: exam._id as string,
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Created exam: ${exam.name}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    res.status(201).json({
      message: "Exam created successfully",
      exam: exam,
    });
  } catch (error: any) {
    await logActivity({
      action: "create",
      resource: "Exam",
      resourceId: "",
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Error creating exam: ${error.message}`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "admin",
    });
    console.log(error);
    res
      .status(500)
      .json({ message: "Error creating exam", error: error.message });
  }
};

// Get all exams
export const getExams = async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1); // Ensure page is at least 1
    const limit = Math.max(parseInt(req.query.limit as string, 10) || 10, 1);

    const search = req.query.search || "";
    const totalExams = await Exam.countDocuments();
    const totalPages = Math.ceil(totalExams / limit);

    const searchQuery = {
      $or: [{ examName: { $regex: search, $options: "i" } }],
    };

    const exams = await Exam.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "class",
        select: "name _id",
      })
      .populate({
        path: "subjects.subject",
        select: "name _id",
      })
      .populate({
        path: "subjects.teacher",
        select: "name _id",
      })
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json({
      exams,
      page,
      limit,
      totalPages,
      totalExams,
      currentPage: page,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching exams", error: error.message });
  }
};

// Get a single exam by ID
export const getExamById = async (req: Request, res: Response) => {
  try {
    console.log(req.params.id);
    const exam = await Exam.findById(req.params.id)
      .populate({
        path: "class",
        select: "name _id",
      })
      .populate({
        path: "subjects.subject",
        select: "name _id",
      })
      .populate({
        path: "subjects.teacher",
        select: "name _id",
      });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json(exam);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching exam", error: error.message });
  }
};

// Update an exam
export const updateExam = async (req: any, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid exam ID" });
    }

    // Check if the exam exists
    const isExamExist = await Exam.findById(req.params.id);
    if (!isExamExist) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    await sendExamNotifications(exam, "updated");

    await logActivity({
      action: "update",
      resource: "Exam",
      resourceId: req.params.id,
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Updated exam: ${exam.name}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    res.status(200).json({
      message: "Exam updated successfully",
      exam: exam,
    });
  } catch (error: any) {
    await logActivity({
      action: "update",
      resource: "Exam",
      resourceId: req.params.id,
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Error updating exam: ${error.message}`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "admin",
    });
    res
      .status(500)
      .json({ message: "Error updating exam", error: error.message });
  }
};

// Delete an exam
export const deleteExam = async (req: any, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid exam ID" });
    }

    // Check if the exam exists
    const isExamExist = await Exam.findById(req.params.id);
    if (!isExamExist) {
      return res.status(404).json({ message: "Exam not found" });
    }
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    await sendExamNotifications(exam, "deleted");

    await logActivity({
      action: "delete",
      resource: "Exam",
      resourceId: req.params.id,
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Deleted exam: ${exam.name}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    res.status(200).json({
      message: "Exam deleted successfully",
      exam: exam,
    });
  } catch (error: any) {
    await logActivity({
      action: "delete",
      resource: "Exam",
      resourceId: req.params.id,
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Error deleting exam: ${error.message}`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "admin",
    });
    res
      .status(500)
      .json({ message: "Error deleting exam", error: error.message });
  }
};

export const importExams = async (req: any, res: Response) => {
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

    console.log(dataToInsert);

    for (const item of dataToInsert) {
      await Exam.create(item);
      processedRecords++;
    }

    await logActivity({
      action: "import",
      resource: "Class",
      userId: req.user._id as string,
      resourceId: req.user._id as string,
      userName: req.user.name as string,
      description: `Imported ${totalRecords} classes`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    const progress = Math.round((processedRecords / totalRecords) * 100);
    res.json({ progress, message: "Students imported successfully" });
  } catch (error) {
    await logActivity({
      action: "import",
      resource: "Class",
      userId: req.user._id as string,
      resourceId: req.user._id as string,
      userName: req.user.name as string,
      description: `Import error: ${error}`,
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
