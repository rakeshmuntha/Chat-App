"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const connectDb = async () => {
    try {
        mongoose_1.default.connection.on('connected', () => { console.log(`Connected to MongoDB sucessfully ✅`); });
        await mongoose_1.default.connect(`${process.env.MONGODB_URI}/chat-app`);
    }
    catch (error) {
        console.log(`Failed to connect to MongoDB ❌`);
        console.log(error);
    }
};
exports.connectDb = connectDb;
