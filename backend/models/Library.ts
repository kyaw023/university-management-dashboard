import mongoose, { Document, Schema } from "mongoose";

interface ILibraryResource extends Document {
  name: string;
  type: "book" | "equipment" | "room";
  category?: string;
  availability_status: "available" | "borrowed" | "reserved";
  quantity: number;
  description?: string;
  borrow_limit: number;
  late_fee_per_day: number;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LibraryResourceSchema: Schema<ILibraryResource> = new Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["book", "equipment", "room"],
      required: true,
    },
    category: { type: String },
    availability_status: {
      type: String,
      enum: ["available", "borrowed", "reserved"],
      default: "available",
    },
    quantity: { type: Number, default: 1 },
    description: { type: String },
    borrow_limit: { type: Number, default: 7 },
    late_fee_per_day: { type: Number, default: 1 },
    location: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ILibraryResource>(
  "LibraryResource",
  LibraryResourceSchema
);
