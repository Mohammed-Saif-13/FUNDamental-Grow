import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  amount: { type: Number, required: true },
  message: String,
  paymentMethod: { type: String, enum: ["razorpay", "stripe"], required: true },
  paymentId: String,
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  anonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Donation ||
  mongoose.model("Donation", DonationSchema);
