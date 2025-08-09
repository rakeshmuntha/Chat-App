"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.markMessagesAsSeen = exports.getMessages = exports.getUsersForSidebar = void 0;
const User_1 = __importDefault(require("../model/User"));
const Message_1 = __importDefault(require("../model/Message"));
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const __1 = require("..");
// get all the users except the logged in user http://localhost:3001/api/messages/users
const getUsersForSidebar = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        const userid = req.user._id;
        const filteredUsers = await User_1.default.find({ _id: { $ne: userid } }).select("-password");
        const unseenMessages = {};
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message_1.default.find({ senderId: user._id, receiverId: userid, seen: false });
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        });
        await Promise.all(promises);
        res.json({ success: true, users: filteredUsers, unseenMessages });
    }
    catch (error) {
        console.log(error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getUsersForSidebar = getUsersForSidebar;
// get all the messages of selected user http://localhost:3001/api/messages/688cc8e57bae4106d8e22c51
const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params; // const selectedUserId = req.params.id
        if (!req.user) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        const myId = req.user._id;
        const messages = await Message_1.default.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId },
            ]
        });
        await Message_1.default.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true });
        res.json({ success: true, messages });
    }
    catch (error) {
        console.log(error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.getMessages = getMessages;
// api to mark message as seen using message id http://localhost:3001/api/messages/mark/688cc8e57bae4106d8e22c51
const markMessagesAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message_1.default.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true });
    }
    catch (error) {
        console.log(error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.markMessagesAsSeen = markMessagesAsSeen;
// send message to selected user
const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user?._id;
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary_1.default.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message_1.default.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        // Emit the new message to the receivers soket
        const receiverSocketId = __1.userSoketMap[receiverId];
        if (receiverSocketId) {
            __1.io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.json({ success: true, newMessage });
    }
    catch (error) {
        console.log(error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.sendMessage = sendMessage;
