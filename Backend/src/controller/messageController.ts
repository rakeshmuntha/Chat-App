import { Request, Response } from "express";
import { userType, messageType } from "../types/userType";
import { Document } from "mongoose";
import User from "../model/User";
import Message from "../model/Message";

interface reqUser extends Request {
    user?: userType & Document
}

// get all the users except the logged in user http://localhost:3001/api/messages/users
export const getUsersForSidebar = async (req: reqUser, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        const userid = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userid } }).select("-password");

        const unseenMessages: any = {};
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({ senderId: user._id, receiverId: userid, seen: false })
            if (messages.length > 0) {
                unseenMessages[user._id as string] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({ success: true, users: filteredUsers, unseenMessages })
    }
    catch (error: any) {
        console.log(error.message);
        res.status(400).json({ success: false, message: error.message })
    }
}

// get all the messages of selected user http://localhost:3001/api/messages/688cc8e57bae4106d8e22c51
export const getMessages = async (req: reqUser, res: Response) => {
    try {
        const { id: selectedUserId } = req.params; // const selectedUserId = req.params.id
        if (!req.user) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId },
            ]
        })
        await Message.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true });
        res.json({ success: true, messages });
    }
    catch (error: any) {
        console.log(error.message);
        res.status(400).json({ success: false, message: error.message });
    }
}

// api to mark message as seen using message id http://localhost:3001/api/messages/mark/688cc8e57bae4106d8e22c51
export const markMessagesAsSeen = async (req: reqUser, res: Response) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true });
    }
    catch (error: any) {
        console.log(error.message);
        res.status(400).json({ success: false, message: error.message });
    }
}