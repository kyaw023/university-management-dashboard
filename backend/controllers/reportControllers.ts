import Student from "../models/Student";
import { Request, Response } from "express";
import Teacher from "../models/Teacher";
import Class from "../models/Class";
export const getStudentPerformance = async (req: Request, res: Response) => {
  try {
    const students = await Student.find().select("name grade").lean();
    res.json(
      students.map((student) => ({
        student: student.name,
        grade: student.grade,
      }))
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching student performance data" });
  }
};

export const getTeacherWorkload = async (req: Request, res: Response) => {
  try {
    const teachers = await Teacher.find().populate("classes").lean();
    res.json(
      teachers.map((teacher) => ({
        teacher: teacher.name,
        classes: teacher.classes.length,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Error fetching teacher workload data" });
  }
};

export const getClassCapacity = async (req: Request, res: Response) => {
  try {
    const classes = await Class.find().lean();
    res.json(
      classes.map((classItem) => ({
        class: classItem.name,
        capacity: classItem.max_students,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Error fetching class capacity data" });
  }
};
