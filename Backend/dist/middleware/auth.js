"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectRoute = void 0;
const User_1 = __importDefault(require("../model/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const protectRoute = async (req, res, next) => {
    try {
        // const authHeader = req.headers.authorization;
        // if (!authHeader || !authHeader.startsWith('Bearer ')) {
        //     return res.status(401).json({ success: false, message: 'No token provided' });
        // }
        // const token = authHeader.split(' ')[1];
        const token = req.headers.token;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        ;
        const user = await User_1.default.findById(decoded.userid).select("-password");
        if (!user)
            return res.json({ success: false, message: 'User does not Exists' });
        req.user = user;
        next();
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
exports.protectRoute = protectRoute;
