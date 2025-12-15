import mongoose from "mongoose";

const { Schema, model } = mongoose;

const drugPurchaseSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    drug: {
      type: Schema.Types.ObjectId,
      ref: "Drug",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export default model("DrugPurchase", drugPurchaseSchema);
