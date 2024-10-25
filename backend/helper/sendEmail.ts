import nodemailer from "nodemailer";
import Class from "../models/Class";

import Student from "../models/Student"; // Assuming you have a Student model
import { io } from "../server";

// Setup Mailtrap transport
export const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "f4be6b00e9356c",
    pass: "e68fb506833556",
  },
});

// Function to send notifications and emails
const sendExamNotifications = async (exam: any, action: string) => {
  try {
    // Find class details and populate the teacher
    const classDetails: any = await Class.findById(exam.class).populate({
      path: "teacher",
      select: "name email _id",
    });

    if (!classDetails) {
      throw new Error(`Class not found for exam: ${exam._id}`);
    }

    const students = await Student.find({ class: classDetails?._id });

    const teacher = classDetails?.teacher;

    // Log the students and teachers for debugging
    

    // Emit notification to each student
    students.forEach((student: any) => {
      console.log(`Sending notification to student ID: ${student._id}`);
      io.to(student._id.toString()).emit("examNotification", {
        message: `Exam "${exam.name}" has been ${action}.`,
      });
    });

    // Emit notification to each teacher
    if (Array.isArray(teacher)) {
      teacher.forEach((teacher: any) => {
        console.log(`Sending notification to teacher ID: ${teacher._id}`);
        io.to(teacher._id.toString()).emit("examNotification", {
          message: `Exam "${exam.name}" has been ${action}.`,
        });
      });
    }

    // Notify the teacher via Socket.IO

    // Send email to each student asynchronously
    // for (const student of students) {
    //   await transport.sendMail({
    //     from: "reiverstoneuniversity@gmail.com",
    //     to: student.email,
    //     subject: `Exam Notification: ${exam.name}`,
    //     text: `Dear ${student.name},\n\nThe exam "${exam.name}" for your class has been ${action} on ${exam.date}. Please check the details.\n\nRegards,\nSchool Administration`,
    //   });
    // }

    // Send email to the teacher asynchronously

    // for (const tr of teacher) {
    //   await transport.sendMail({
    //     from: "reiverstoneuniversity@gmail.com",
    //     to: tr.email,
    //     subject: `Exam Notification: ${exam.name}`,
    //     text: `Dear ${tr.name},\n\nThe exam "${exam.name}" that you are responsible for has been ${action}.\n\nRegards,\nSchool Administration`,
    //   });
    // }

    // Send email to the teacher

    console.log("Notifications and emails sent successfully.");
  } catch (error) {
    console.error("Error sending notifications or emails:", error);
  }
};

export default sendExamNotifications;
