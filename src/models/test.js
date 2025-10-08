import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
    batch_number: {
        type: String
    },
    sample_id: {
        type: String
    },
    date: {
        type: Date
    },
    product: {
        type: String,
        enum: ['500ml Water Bottle','1L Water Bottle','1.5L Water Bottle','5L Water Bottle']
    },
    ph_level: {
        type: String
    },
    tds_level: {
        type: String
    },
    chlorine: {
        type: String
    },
    turbidity: {
        type: String
    },
    conductivity: {
        type: String
    },
    temperature: {
        type: String
    },
    microbioligy_test: {
        type: String,
        enum: ['pass','fail','pending']
    },

    chemical_test: {
        type: String,
         enum: ['pass','fail','pending']
    },
    physical_test: {
        type: String,
         enum: ['pass','fail','pending']
    },
    note: {
        type: String
    }
});
export default mongoose.model("Test", testSchema)