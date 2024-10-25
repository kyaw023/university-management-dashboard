import mongoose, { Schema, Document } from "mongoose";

export interface ITeacher extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  date_of_birth: Date;
  gender: "male" | "female" | "other";
  address: string;
  image: string;
  qualifications: string[];
  subjects: mongoose.Types.ObjectId[]; // Reference to Subject model
  classes: mongoose.Types.ObjectId[]; // Reference to Class model
  employment_status: "active" | "on_leave" | "retired";
  hire_date: Date;
  salary: number;
  schedule?: {
    day: string;
    start_time: string;
    end_time: string;
    class: mongoose.Types.ObjectId;
    subject: mongoose.Types.ObjectId;

  }[];
}

const TeacherSchema = new Schema<ITeacher>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    address: { type: String, required: true },
    image: { type: String },
    qualifications: [{ type: String, required: true }], // Array of qualification strings
    subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }], // Array of Subject references
    classes: [{ type: Schema.Types.ObjectId, ref: "Class" }], // Array of Class references
    employment_status: {
      type: String,
      enum: ["active", "on_leave", "retired"],
      default: "active",
    }, // Employment status of the teacher
    hire_date: { type: Date, default: Date.now }, // Date of hiring
    salary: { type: Number, required: true }, // Teacher's salary
    schedule: [
      {
        day: { type: String }, // Day of the class
        start_time: { type: String },
        end_time: { type: String },
        // Time of the class
        class: { type: Schema.Types.ObjectId, ref: "Class" },
        subject: { type: Schema.Types.ObjectId, ref: "Subject" }, // Reference to the class
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITeacher>("Teacher", TeacherSchema);
