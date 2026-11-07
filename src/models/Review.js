import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    // Optional: reviews entered by an admin don't have an email.
    email: { type: String, trim: true, lowercase: true, maxlength: 254, default: "" },
    source: { type: String, enum: ["website", "admin"], default: "website" },
    event: { type: String, required: true, trim: true, maxlength: 100 },
    review: { type: String, required: true, trim: true, maxlength: 1500 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
