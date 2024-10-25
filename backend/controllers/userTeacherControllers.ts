import { Request, Response } from "express";
import Teacher from "../models/Teacher";
import mongoose from "mongoose";

export const getTeacherClasses = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = req.params.id;

    console.log("id", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid class ID" });
    }

    const isExisted = await Teacher.findById(id);

    if (!isExisted) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const classes = await Teacher.findById(id)
      .populate({
        path: "classes",
        select: "name",
      })
      .populate({
        path: "subjects",
        select: "name",
      })
      .populate({
        path: "schedule.subject",
        select: "name",
      })
      .populate({
        path: "schedule.class",
        select: "name",
      });

    return res.status(200).json(classes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
