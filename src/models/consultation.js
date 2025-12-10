import mongoose from "mongoose";
const consultationSchema = new mongoose.Schema({
patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
practitioner: { type: Schema.Types.ObjectId, ref: 'User' },
notes: { type: String },
diagnosis: { type: String },
prescription: [{
drug: { type: Schema.Types.ObjectId, ref: 'Drug' },
dose: { type: String },
frequency: { type: String },
duration: { type: String }
}],
followUpDate: { type: Date }
}, { timestamps: true });


export default mongoose.model('Consultation', consultationSchema);
