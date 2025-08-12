import mongoose, { Schema } from "mongoose";

export interface BookingDoc extends mongoose.Document {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  startTime: Date;
  endTime: Date;
  source?: string;
  whatsappTo?: string; // destination number we notify
  whatsappFrom?: string; // user's whatsapp if provided
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<BookingDoc>(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    notes: { type: String },
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true },
    source: { type: String },
    whatsappTo: { type: String },
    whatsappFrom: { type: String },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

BookingSchema.index({ startTime: 1, endTime: 1 });

export const BookingModel =
  (mongoose.models.Booking as mongoose.Model<BookingDoc>) ||
  mongoose.model<BookingDoc>("Booking", BookingSchema);


