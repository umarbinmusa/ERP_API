import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  full_name: {
    type: String,
    required: true,
    default: function () {
      return this.username || "Unnamed User";
    },
  },

  email: {
    type: String,
    required: true,
    default: function () {
      return `${this.username || "user"}@example.com`;
    },
  },

  role: {
    type: String,
    enum: ["ADMIN", "FINANCE", "MANAGER", "LABORATORY", "DIRECTOR"],
    required: true,
  },

  permissions: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: String,
});export default mongoose.model("User", userSchema);


