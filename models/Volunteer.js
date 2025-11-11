import mongoose from "mongoose";

const VolunteerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Removed unique
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  emergencyContact: String,
  experience: Number,
  skills: { type: String, required: true },
  motivation: { type: String, required: true },
  availability: [String],
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

// Remove any existing indexes
VolunteerSchema.index({ user: 1 }, { unique: false });

export default mongoose.models.Volunteer ||
  mongoose.model("Volunteer", VolunteerSchema);
