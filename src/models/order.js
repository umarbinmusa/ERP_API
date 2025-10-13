import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customer: {
        type: String,
        enum: ['Healthy Living Store','Fresh mart','Green valley']
    },
    order_date: {
        type: Date
    },
    delivery_date: {
        type: Date
    },
    product: {
        type: String,
        enum: ['pure water 500ml(20packs)','pure water 75cl(12packs)','pure water 1l(12packs)','pure water 1.5l(6packs)','pure water 5l(individual)']
    },
    quantity: {
        type: String
    },
    unit: {
        type: String
    },
    total: {
        type: String
    },
    note: {
        type: String
    }
}); export default mongoose.model("Order", orderSchema);