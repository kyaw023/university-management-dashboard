

import mongoose, { Document, Schema } from "mongoose";

export interface IParent extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  relationship: "mother" | "father" | "guardian"; // Relationship to the student
  students: mongoose.Types.ObjectId[]; // References to Student model
  occupation?: string;
  notes?: string;
}

const ParentSchema = new Schema<IParent>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    relationship: {
      type: String,
      enum: ["mother", "father", "guardian"],
      required: true,
    },
    occupation: { type: String },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IParent>("Parent", ParentSchema);