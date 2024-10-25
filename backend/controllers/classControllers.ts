import fs from "fs";
import { Request, Response } from "express";
import Class, { IClass } from "../models/Class";
import mongoose from "mongoose";
import csv from "csv-parser";

import parseExcel from "../helper/parseExcel";
import parseCSV from "../helper/pareseCSV";
import { logActivity } from "../helper/logActivity";
import { isScheduleUpdated } from "../helper/isScheduleUpdated";
import { io } from "../server";

export const classesRegister = async (
  req: any,
  res: Response
): Promise<Response> => {
  // Destructure properties from the request body
  const {
    name,
    teacher,
    subjects,
    start_date,
    end_date,
    classroom,
    max_students,
    status,
    weeklySchedule,
  }: IClass = req.body; // Type the destructured object as IClass

  try {
    // Check if the class already exists
    const isClassExist = await Class.findOne({ name });

    // If the class already exists, return an error
    if (isClassExist) {
      return res.status(400).json({ message: "Class already exists" });
    }

    // Create a new class
    const newClass: IClass = await Class.create({
      name,
      teacher,
      subjects,
      start_date,
      end_date,
      classroom,
      status,
      max_students,
      weeklySchedule,
    });

    await logActivity({
      action: "create",
      resource: "Class",
      resourceId: newClass._id.toString(),
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Created new class: ${newClass.name}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    return res
      .status(201)
      .json({ message: "Class registered successfully", newClass });
  } catch (error) {
    await logActivity({
      action: "create",
      resource: "Class",
      resourceId: "",
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Failed to create new class: ${error}`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "admin",
    });
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get all classes
export const getAllClasses = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1); // Ensure page is at least 1
    const limit = Math.max(parseInt(req.query.limit as string, 10) || 10, 1);
    const search = req.query.search || "";

    const totalclass = await Class.countDocuments();
    const totalPages = Math.ceil(totalclass / limit);

    const searchQuery = {
      $or: [{ name: { $regex: search, $options: "i" } }],
    };
    const classes = await Class.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit);
    return res.status(200).json({
      classes,
      page,
      limit,
      totalPages,
      totalclass,
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

// get single class
export const getSingleClass = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid class ID" });
    }

    const classs = await Class.findById(req.params.id)
      .populate({
        path: "subjects",
        select: "name _id",
      })
      .populate({
        path: "teacher",
        select: "name _id",
      });

    console.log("classs", classs);

    await logActivity({
      action: "read",
      resource: "Class",
      resourceId: req.params.id,
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Viewed class: ${classs?.name}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });
    if (!classs) {
      return res.status(404).json({ message: "Class not found" });
    }

    return res.status(200).json(classs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// update class
export const updateClass = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const classID = req.params.id; // or wherever the ID is coming from
    if (!classID || !mongoose.Types.ObjectId.isValid(classID)) {
      return res.status(400).send({ error: "Invalid or missing student ID" });
    }

    const currentClass = await Class.findById(classID);

    if (!currentClass) {
      return res.status(404).send({ error: "Class not found" });
    }

    // Check if the schedule is included in the update request
    let notifyScheduleUpdate = false;

    console.log("update", req.body.weeklySchedule);

    if (req.body.weeklySchedule && req.body.weeklySchedule.length > 0) {
      notifyScheduleUpdate = isScheduleUpdated(
        currentClass.weeklySchedule,
        req.body.weeklySchedule
      );
    }

    const updatedClass = await Class.findByIdAndUpdate(classID, req.body, {
      new: true,
    });

    await logActivity({
      action: "update",
      resource: "Class",
      resourceId: req.params.id,
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Updated class: ${currentClass.name}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    // Notify only if the schedule was updated
    if (notifyScheduleUpdate) {
      io.emit("classScheduleUpdated", {
        message: `Class ${updatedClass?.name}'s schedule has been updated.`,
        classId: updatedClass?._id,
        updatedSchedule: updatedClass?.weeklySchedule,
      });
    }

    return res.status(200).json({
      message: "Class updated successfully",
      updatedClass,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// delete class
export const deleteClass = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const classID = req.params.id; // or wherever the ID is coming from
    if (!classID || !mongoose.Types.ObjectId.isValid(classID)) {
      return res.status(400).send({ error: "Invalid or missing student ID" });
    }
    const deletedClass = await Class.findByIdAndDelete(classID);

    await logActivity({
      action: "delete",
      resource: "Class",
      resourceId: req.params.id,
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Deleted class: ${deletedClass?.name}`,
      status: "success",
      ipAddress: req.ip as string,
      performBy: "admin",
    });

    io.emit("classDeleted", {
      message: `Class ${deletedClass?.name} has been deleted.`,
      classId: deletedClass?._id,
    });

    return res.status(200).json({
      message: "Class deleted successfully",
      deletedClass,
    });
  } catch (error: any) {
    await logActivity({
      action: "delete",
      resource: "Class",
      resourceId: req.params.id,
      userId: req.user._id as string,
      userName: req.user.name as string,
      description: `Deleted class: ${error.message}`,
      status: "failed",
      ipAddress: req.ip as string,
      performBy: "admin",
    });
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const importClass = async (req: any, res: Response) => {
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
      if (typeof item.teacher === "string") {
        item.teacher = item.teacher.split(",").map((id: any) => id.trim());
      }

      if (typeof item.subjects === "string") {
        item.subjects = item.subjects.split(",").map((id: any) => id.trim());
      }

      await Class.create(item);
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

export const getClassLists = async (req: Request, res: Response) => {
  const classList = await Class.find();
  return res.json(classList);
};
