import mongoose, { Schema } from "mongoose";

export interface IClass extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  teacher: mongoose.Types.ObjectId[]; // Reference to Teacher model
  subjects: mongoose.Types.ObjectId[]; // Reference to Subject model
  start_date: Date;
  end_date: Date;
  classroom: string;
  max_students: number;
  status: "active" | "completed" | "cancelled";
  weeklySchedule: {
    day: string;
    start_time: string;
    end_time: string;
    subject: mongoose.Types.ObjectId;
    teacher: mongoose.Types.ObjectId;
  }[];
  students?: mongoose.Types.ObjectId[];
}

const ClassSchema = new Schema<IClass>(
  {
    name: { type: String, required: true },
    teacher: [{ type: Schema.Types.ObjectId, ref: "Teacher", required: true }],
    subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    classroom: { type: String, required: true },
    max_students: { type: Number, required: true, default: 30 },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    weeklySchedule: [
      {
        day: { type: String },
        start_time: { type: String },
        end_time: { type: String },
        subject: { type: Schema.Types.ObjectId, ref: "Subject" },
        teacher: { type: Schema.Types.ObjectId, ref: "Teacher" },
        // Reference to the class
      },
    ],
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  },

  {
    timestamps: true,
  }
);

export default mongoose.model<IClass>("Class", ClassSchema);
