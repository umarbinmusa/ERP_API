import mongoose from "mongoose";
const { Schema, model } = mongoose;

const consultationSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    consultant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    symptoms: {
      type: String,
      required: true
    },

    diagnosis: {
      type: String,
      required: true
    },

    prescription: [
      {
        herbName: String,
        dosage: String,
        frequency: String,
        duration: String
      }
    ],

    followUpDate: {
      type: Date
    }
  },
  { timestamps: true }
);

export default model("Consultation", consultationSchema);
