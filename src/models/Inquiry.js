import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    role: { type: String, trim: true, maxlength: 40 },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    eventType: { type: String, required: true, trim: true, maxlength: 80 },
    eventDate: { type: String, trim: true, maxlength: 10 },
    venue: { type: String, trim: true, maxlength: 180 },
    guestCount: { type: String, trim: true, maxlength: 20 },
    budget: { type: String, trim: true, maxlength: 80 },
    message: { type: String, required: true, trim: true, maxlength: 3000 },
    status: {
      type: String,
      enum: ["new", "contacted", "consultation", "booked", "closed"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);
