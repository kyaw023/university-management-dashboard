import mongoose, { Schema, Document } from "mongoose";

interface IExam extends Document {
  name: string;
  startDate: Date; // Overall exam start date
  endDate: Date; // Overall exam end date
  class: Schema.Types.ObjectId; // Reference to the class
  subjects: {
    subject: Schema.Types.ObjectId; // Subject reference
    teacher: Schema.Types.ObjectId; // Teacher reference
    startTime: String; // Start time of the subject's exam
    endTime: String; // End time of the subject's exam
    maxMarks: number; // Maximum marks for the subject
    examDate: Date; // Date of the exam
  }[];
  status: "scheduled" | "completed" | "cancelled"; // Current status of the exam
}

const ExamSchema = new Schema(
  {
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    subjects: [
      {
        subject: {
          type: Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },
        teacher: {
          type: Schema.Types.ObjectId,
          ref: "Teacher",
          required: true,
        },
        startTime: { type: String, required: true }, // Use Date for consistency
        endTime: { type: String, required: true },
        maxMarks: { type: Number, required: true },
        examDate: { type: Date, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IExam>("Exam", ExamSchema);
