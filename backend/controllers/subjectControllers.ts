import fs from "fs";
import csv from "csv-parser";
import parseExcel from "../helper/parseExcel";
import parseCSV from "../helper/pareseCSV";
import { Request, Response } from "express";
import Subject, { ISubject } from "../models/Subject";
import { logActivity } from "../helper/logActivity";
import mongoose from "mongoose";

export const subjectsRegister = async (
  req: any,
  res: Response
): Promise<Response> => {
  // Destructure properties from the request body
  const {
    name,
    description,
    image,
    teacher,
    classes,
    credits,
    department,
    code,
  }: ISubject = req.body; // Type the destructured object as ISubject

  try {
    // Check if the subject already exists
    const isSubjectExist = await Subject.findOne({ name });

    // If the subject already exists, return an error
    if (isSubjectExist) {
      return res.status(400).json({ message: "Subject already exists" });
    }

    // Create a new subject
    const subject: ISubject = await Subject.create({
      name,
      description,
      image,
      teacher,
      classes,
      credits,
      department,
      code,
    });

    await logActivity({
      action: "create",
      resource: "Subject",
      resourceId: subject._id as any,
      userId: req.user._id as any,
      userName: req.user.name as string,
      description: `Created subject: ${subject.name}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    return res
      .status(201)
      .json({ message: "Subject registered successfully", subject });
  } catch (error) {
    await logActivity({
      action: "create",
      resource: "Subject",
      resourceId: "",
      userId: req.user._id as any,
      userName: req.user.name as string,
      description: `Failed to create subject: ${error}`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// get all subjects
export const getAllSubjects = async (
  req: Request & { user?: { _id: string; name: string } },
  res: Response
): Promise<Response> => {
  try {
    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1); // Ensure page is at least 1
    const limit = Math.max(parseInt(req.query.limit as string, 10) || 10, 1);
    const search = req.query.search || "";

    const totalSubject = await Subject.countDocuments();
    const totalPages = Math.ceil(totalSubject / limit);

    const searchQuery = {
      $or: [{ name: { $regex: search, $options: "i" } }],
    };
    const subjects = await Subject.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      subjects,
      page,
      limit,
      totalPages,
      totalSubject,
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

// get single subject
export const getSingleSubject = async (
  req: Request & { user?: { _id: string; name: string } },
  res: Response
): Promise<Response> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid subject ID" });
    }

    const isExisted = await Subject.findById(req.params.id);

    if (!isExisted) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const subject = await Subject.findById(req.params.id)
      .populate({
        path: "classes",
        select: "name",
      })
      .populate({
        path: "teacher",
        select: "name",
      });

    await logActivity({
      action: "read",
      resource: "Subject",
      resourceId: req.params.id,
      userId: req.user?._id as string,
      userName: req.user?.name || "Unknown",
      description: `Viewed subject: ${subject?.name}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    return res.status(200).json(subject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// update subject;

export const updateSubject = async (
  req: Request & { user?: { _id: string; name: string } }, // Extend the request type to include user
  res: Response
): Promise<Response> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid subject id" });
    }

    const isExisted = await Subject.findById(req.params.id);

    if (!isExisted) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Find and update the subject
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // Validate the updated data
    });

    // Check if the subject was found
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Log the activity
    await logActivity({
      action: "update",
      resource: "Subject",
      resourceId: req.params.id,
      userId: req.user?._id as string, // Use optional chaining
      userName: req.user?.name || "Unknown", // Default to "Unknown" if name is not available
      description: `Updated subject: ${subject.name}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin", // Ensure this field exists in the logActivity function
    });

    // Return the updated subject
    return res.status(200).json({
      message: "Subject updated successfully",
      subject,
    });
  } catch (error: any) {
    console.error("Error updating subject:", error);
    await logActivity({
      action: "update",
      resource: "Subject",
      resourceId: req.params.id,
      userId: req.user?._id as string, // Use optional chaining
      userName: req.user?.name || "Unknown", // Default to "Unknown" if name is not available
      description: `Failed to update subject: ${error.message}`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "admin", // Ensure this field exists in the logActivity function
    });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteSubject = async (
  req: Request & { user?: { _id: string; name: string } },
  res: Response
): Promise<Response> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid subject id" });
    }

    const isExisted = await Subject.findById(req.params.id);

    if (!isExisted) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const subject = await Subject.findByIdAndDelete(req.params.id);

    await logActivity({
      action: "delete",
      resource: "Subject",
      resourceId: req.params.id,
      userId: req.user?._id as string,
      userName: req.user?.name || "Unknown",
      description: `Deleted subject: ${subject?.name}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    return res.status(200).json({
      message: "Subject deleted successfully",
      subject,
    });
  } catch (error) {
    await logActivity({
      action: "delete",
      resource: "Subject",
      resourceId: req.params.id,
      userId: req.user?._id as string,
      userName: req.user?.name || "Unknown",
      description: `Failed to delete subject: ${error}`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "admin",
    });
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const importSubject = async (req: any, res: Response): Promise<void> => {
  // Check if a file was uploaded

  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  const fileExtension = req.file.originalname.split(".").pop()?.toLowerCase();
  const filePath = req.file.path;

  try {
    let dataToInsert = [];

    if (fileExtension === "csv") {
      dataToInsert = await parseCSV(filePath);
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      dataToInsert = await parseExcel(filePath);
    } else {
      throw new Error("Unsupported file format");
    }

    console.log(dataToInsert);

    const totalRecords = dataToInsert.length;
    let processedRecords = 0;
    const errors: string[] = [];

    for (const item of dataToInsert) {
      try {
        // Validate required fields
        if (
          !item.name ||
          !item.code ||
          !item.teacher ||
          !item.credits ||
          !item.classes
        ) {
          throw new Error(
            `Invalid data for subject: ${item.name || "Unknown"}`
          );
        }

        if (typeof item.classes === "string") {
          item.classes = item.classes.split(",").map((id: any) => id.trim());
        }

        // Validate ObjectIds

        // Create the subject
        await Subject.create(item);

        processedRecords++;
      } catch (error: any) {
        errors.push(
          `Error processing subject ${item.name || "Unknown"}: ${error.message}`
        );
      }
    }

    // Log the activity
    await logActivity({
      action: "import",
      resource: "Subject",
      resourceId: req.file.filename, // Using the uploaded filename as a unique identifier
      userId: req.user?._id,
      userName: req.user?.name || "Unknown",
      description: `Imported ${processedRecords} subjects. ${errors.length} errors occurred.`,
      status: errors.length === 0 ? "success" : "partial_success",
      ipAddress: req.ip,
      performBy: "admin",
    });

    const progress = Math.round((processedRecords / totalRecords) * 100);
    res.json({
      progress,
      message: `Subjects imported successfully. ${processedRecords} processed, ${errors.length} errors.`,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Import error:", error);
    res.status(500).json({
      message: "An error occurred during import",
      error: (error as Error).message,
    });

    // Log the failed activity
    await logActivity({
      action: "import",
      resource: "Subject",
      resourceId: req.file.filename,
      userId: req.user?._id,
      userName: req.user?.name || "Unknown",
      description: `Failed to import subjects: ${(error as Error).message}`,
      status: "failed",
      ipAddress: req.ip,
      performBy: "admin",
    });
  } finally {
    // Clean up the uploaded file
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
  }
};

export const getSubjectLists = async (req: any, res: Response) => {
  try {
    const subject = await Subject.find();
    return res.status(200).json(subject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
