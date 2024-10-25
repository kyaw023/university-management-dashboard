import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  date_of_birth: Date;
  gender: "male" | "female" | "other";
  address: string;
  phone: string;
  image: string;
  bio?: string;
  role: "admin";
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin", required: true },
    bio: { type: String },
    date_of_birth: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
