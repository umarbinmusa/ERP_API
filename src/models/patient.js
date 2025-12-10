import mongoose from "mongoose";


const patientSchema = new mongoose.Schema({
name: { type: String, required: true },
age: { type: Number },
phone: { type: String },
history: [{ type: String }],
createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });


export default mongoose.model('Patient', patientSchema);



