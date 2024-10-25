import mongoose, { Document, Schema } from "mongoose";

export interface IActivityLog extends Document {
  action:
    | "create"
    | "read"
    | "update"
    | "delete"
    | "import"
    | "login"
    | "logout"; // Directly using enum as a string literal
  resource: string;
  resourceId: string; // Use camelCase for consistency
  userId: mongoose.Types.ObjectId; // Assuming this refers to a User document
  userName: string; // Use camelCase for consistency
  description: string;
  status: "success" | "failure" | "partial_success"; // Consider using an enum if you have predefined statuses
  ipAddress: string; // Use camelCase for consistency
  performBy: "admin" | "teacher" | "student";
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    action: {
      type: String,
      required: true,
      enum: ["create", "read", "update", "delete", "import", "login", "logout"],
    },
    resource: { type: String, required: true },
    resourceId: { type: String }, // Updated to camelCase
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" }, // Assuming you have a User model
    userName: { type: String, required: true }, // Updated to camelCase
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["success", "error", "partial_success", "failure"],
      required: true,
    }, // Consider enum for fixed statuses
    ipAddress: { type: String, required: true }, // Updated to camelCase
    performBy: {
      type: String,
      enum: ["admin", "teacher", "student"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
