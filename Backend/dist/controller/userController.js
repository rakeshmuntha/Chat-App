"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.checkAuth = exports.login = exports.signup = void 0;
const User_1 = __importDefault(require("../model/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_1 = require("../lib/utils");
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
// SignUp a user http://localhost:3001/api/auth/signup
const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;
    try {
        if (!fullName || !email || !password || !bio)
            return res.status(404).json({ success: false, message: 'Missing Credentials' });
        const user = await User_1.default.findOne({ email });
        if (user)
            return res.status(404).json({ success: false, message: 'Account Already Exists' });
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const newUser = await User_1.default.create({ fullName, email, password: hashedPassword, bio });
        const token = (0, utils_1.generateToken)(newUser._id);
        res.json({ success: true, userData: newUser, token, message: 'Account created Successfully' });
    }
    catch (error) {
        console.log(error.message);
        res.status(404).json({ success: false, message: error.message });
    }
};
exports.signup = signup;
// Login a User http://localhost:3001/api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User_1.default.findOne({ email });
        if (userData == null)
            return res.status(404).json({ success: false, message: 'User does not Exists' });
        const ispasswordCorrect = await bcryptjs_1.default.compare(password, userData.password);
        if (!ispasswordCorrect)
            return res.status(404).json({ success: false, message: 'Wrong Password' });
        const token = (0, utils_1.generateToken)(userData._id);
        res.json({ success: true, userData: userData, token, message: 'Login Successful' });
    }
    catch (error) {
        console.log(error.message);
        res.status(404).json({ success: false, message: error.message });
    }
};
exports.login = login;
// Check if user is authenticated http://localhost:3001/api/auth/check
const checkAuth = async (req, res) => {
    res.json({ success: true, user: req.user });
};
exports.checkAuth = checkAuth;
// Update user Profile details http://localhost:3001/api/auth/update-profile
const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        if (!req.user) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        const userid = req.user._id;
        let updateduser;
        if (!profilePic) {
            updateduser = await User_1.default.findByIdAndUpdate(userid, { bio, fullName }, { new: true });
        }
        else {
            const upload = await cloudinary_1.default.uploader.upload(profilePic);
            updateduser = await User_1.default.findByIdAndUpdate(userid, { profilePic: upload.secure_url, bio, fullName }, { new: true });
        }
        res.json({ success: true, user: updateduser });
    }
    catch (error) {
        console.log(error.message);
        res.status(404).json({ success: false, message: error.message });
    }
};
exports.updateProfile = updateProfile;
