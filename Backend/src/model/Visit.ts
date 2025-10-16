import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
    count: {
        type: Number,
        default: 0
    },
    lastVisit: {
        type: Date,
        default: Date.now
    }
});

export const Visit = mongoose.model("Visit", visitSchema);