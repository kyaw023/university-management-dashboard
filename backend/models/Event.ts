import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IAttendee {
  attendeeId: Schema.Types.ObjectId; // ObjectId of either Teacher or Student
  role: "Teacher" | "Student"; // Role to distinguish the type
}
// Define the Event interface
interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  attendees: IAttendee[]; // Reference to User model
  status: "Scheduled" | "Completed" | "Cancelled";
  createdAt: Date;
}

// Event schema definition
const eventSchema: Schema<IEvent> = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  organizer: {
    type: String,
    required: true,
  },
  attendees: [
    {
      attendeeId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: "attendees.role",
      }, // Dynamic reference based on role
      role: { type: String, required: true, enum: ["Teacher", "Student"] }, // Stores the role
    },
  ],
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled",
  },
});

export default mongoose.model<IEvent>("Event", eventSchema);
