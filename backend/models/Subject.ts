import mongoose, { Schema, Document } from "mongoose";

export interface ISubject extends Document {
  name: string;
  code: string;
  description?: string;
  image?: string;
  teacher: mongoose.Types.ObjectId; // Reference to Teacher model
  classes: mongoose.Types.ObjectId[] ; // Reference to Class model
  credits?: number; // Optional, if credits apply to the subject
  department?: string; // Department offering the subject
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true }, // Subject name
    code: { type: String, required: true, unique: true }, // Unique code for the subject
    description: { type: String }, // Optional description of the subject
    image: { type: String },
    teacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true }, // Reference to Teacher model
    classes: [{ type: Schema.Types.ObjectId, ref: "Class" }], // Array of Class references
    credits: { type: String, default: "0" }, // Optional field for the number of credits (if applicable)
    department: { type: String }, // Optional department or faculty offering the subject
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISubject>("Subject", SubjectSchema);
