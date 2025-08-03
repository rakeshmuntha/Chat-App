import mongoose, { Document } from "mongoose";
import { messageType } from "../types/userType";

const messageSchema = new mongoose.Schema<messageType & Document>({

    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: {type: String},
    image: {type: String},
    seen: {type: Boolean, default: false}

}, { timestamps: true })

const Message = mongoose.model<messageType & Document>("Message", messageSchema);
export default Message;