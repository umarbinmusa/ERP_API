import mongoose from "mongoose";

const productionSchema = new mongoose.Schema({
    date: {
        type: Date
    },
    shift: {
        type: String,
        enum: ['Morning(6am-2pm)','Afternoon(2pm-10pm)','Night(10pm-6am)']
    },
    product: {
        type: String,
        enum: ['500ml water bottel','1l water bottel','1.5l water bottle','5l water bottle']
    },
    planed_quantity: {
        type: String
    },
    supervisor: {
        type: String,
        enum: ['John','Sarah','michel']
    },
    note: {
        type: String
    }


}); export default mongoose.model("Production", productionSchema);