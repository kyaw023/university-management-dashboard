import { Request, Response } from "express";
import { logActivity } from "../helper/logActivity";
import parseCSV from "../helper/pareseCSV";
import parseExcel from "../helper/parseExcel";
import Library from "../models/Library";
import fs from "fs";
import mongoose from "mongoose";

export const createLibraryResource = async (req: any, res: Response) => {
  try {
    const library = await Library.create(req.body);

    await logActivity({
      action: "create",
      resource: "Library",
      resourceId: library._id as string,
      userId: req.user?._id as string,
      userName: req.user?.name || "Unknown",
      description: `Created library: ${library.name}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    return res.status(201).json({
      message: "Library created successfully",
      library: library,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error creating library",
      error: error,
    });
  }
};

export const getAllLibraryResources = async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1); // Ensure page is at least 1
    const limit = Math.max(parseInt(req.query.limit as string, 10) || 10, 1);

    const search = req.query.search || "";
    const totalLibrary = await Library.countDocuments();
    const totalPages = Math.ceil(totalLibrary / limit);

    const libraries = await Library.find()
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      libraries,
      page,
      limit,
      totalPages,
      totalLibrary,
      currentPage: page,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error getting libraries",
      error: error,
    });
  }
};

export const getSingleLibraryResource = async (req: Request, res: Response) => {
  try {
    const librarId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(librarId)) {
      return res.status(400).json({ message: "Invalid library ID" });
    }

    const library = await Library.findById(librarId);

    if (!library) {
      return res.status(404).json({ message: "Library not found" });
    }

    return res.status(200).json(library);
  } catch (error) {
    return res.status(500).json({
      message: "Error getting library",
      error: error,
    });
  }
};

export const updateLibraryResource = async (req: Request, res: Response) => {
  try {
    const libraryId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(libraryId)) {
      return res.status(400).json({ message: "Invalid library ID" });
    }

    const library = await Library.findByIdAndUpdate(libraryId, req.body, {
      new: true,
    });

    if (!library) {
      return res.status(404).json({ message: "Library not found" });
    }

    return res.status(200).json({
      message: "Library updated successfully",
      library: library,
    });
  } catch (error) {}
};

export const deleteLibraryResource = async (req: Request, res: Response) => {
  try {
    const libraryId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(libraryId)) {
      return res.status(400).json({ message: "Invalid library ID" });
    }

    const library = await Library.findByIdAndDelete(libraryId);

    if (!library) {
      return res.status(404).json({ message: "Library not found" });
    }

    return res.status(200).json({
      message: "Library deleted successfully",
      library: library,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting library",
      error: error,
    });
  }
};

export const importLibrary = async (req: any, res: Response) => {
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
      await Library.create(item);
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
