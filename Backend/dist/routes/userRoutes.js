"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const auth_1 = require("../middleware/auth");
const userRouter = express_1.default.Router();
userRouter.post('/signup', userController_1.signup);
userRouter.post('/login', userController_1.login);
userRouter.get('/check', auth_1.protectRoute, userController_1.checkAuth);
userRouter.put('/update-profile', auth_1.protectRoute, userController_1.updateProfile);
exports.default = userRouter;
