import mongoose, { Schema } from "mongoose";

export interface ContactDoc extends mongoose.Document {
  name: string;
  email: string;
  address?: string;
  phone?: string;
  message: string;
  createdAt: Date;
}

const ContactSchema = new Schema<ContactDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ContactModel =
  (mongoose.models.Contact as mongoose.Model<ContactDoc>) ||
  mongoose.model<ContactDoc>("Contact", ContactSchema);


