import mongoose from "mongoose";

const drugSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  unitPrice: { type: Number, default: 0 },
  stock: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Drug', drugSchema);
