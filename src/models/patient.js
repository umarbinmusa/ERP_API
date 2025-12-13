import mongoose from "mongoose";

const { Schema, model } = mongoose;

const patientSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number },
    phone: { type: String },
    history: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default model("Patient", patientSchema);
