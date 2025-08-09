"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSoketMap = exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const db_1 = require("./lib/db");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// initialize soket.io server 
exports.io = new socket_io_1.Server(server, {
    cors: { origin: "*" }
});
// store online users
exports.userSoketMap = {}; // {userId : soketId}
// socket.io connection handler
exports.io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log(`user connected ${userId}`);
    if (userId)
        exports.userSoketMap[userId] = socket.id;
    // emit online users to all connected client
    exports.io.emit("getOnlineUsers", Object.keys(exports.userSoketMap));
    socket.on("disconnect", () => {
        console.log(`User Disconnected`, userId);
        delete exports.userSoketMap[userId];
        exports.io.emit("getOnlineUsers", Object.keys(exports.userSoketMap));
    });
});
app.use(express_1.default.json({ limit: "4mb" }));
app.use((0, cors_1.default)());
// Routes
app.use("/api/auth", userRoutes_1.default);
app.use("/api/messages", messageRoutes_1.default);
(0, db_1.connectDb)();
app.get('/', (req, res) => {
    res.json('Backend running!');
});
// in local host
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
// for vercel
// else export default server;
// • npm run dev – starts dev server with reload
// • npm run build – compiles TypeScript to JS
// • npm start – runs compiled backend
