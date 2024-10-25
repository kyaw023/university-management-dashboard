import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  name: string;
  email: string;
  password: string;
  date_of_birth: Date;
  gender: "male" | "female" | "other";
  address: string;
  phone: string;
  image: string;
  father_name?: string;
  mother_name?: string;
  class: mongoose.Types.ObjectId; // Refers to the Class model
  status: "active" | "graduated" | "dropped";
  enrollment_date?: Date;
  roll_no?: number;
  grade?: string;
  attendance?: number;
  emergency_contact?: {
    name: string;
    phone: string;
  };
  medical_conditions?: string;
  notes?: string;
}

const StudentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    roll_no: { type: Number, required: true, unique: true },
    image: { type: String },
    father_name: { type: String },
    mother_name: { type: String },
    class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    status: {
      type: String,
      enum: ["active", "graduated", "dropped"],
      default: "active",
    },
    enrollment_date: { type: Date, default: Date.now },
    grade: { type: String },
    attendance: { type: Number, default: 0 },
    emergency_contact: {
      name: { type: String },
      phone: { type: String },
    },
    medical_conditions: { type: String },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IStudent>("Student", StudentSchema);
