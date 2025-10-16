"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSoketMap = exports.io = void 0;
// server.ts (or server.js) - extended from your original file
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
exports.io = new socket_io_1.Server(server, {
    cors: { origin: "*" }
});
exports.userSoketMap = {}; // { userId: socketId }
const anonymousQueue = []; // queue of sockets waiting
const anonymousPairs = {}; // { socketId: partnerSocketId }
exports.io.on("connection", (socket) => {
    const userId = socket.handshake.query?.userId || null;
    const isAnonymous = socket.handshake.query?.isAnonymous === "true";
    const userName = socket.handshake.query?.userName || null;
    // if SignedIn
    if (userId && !isAnonymous) {
        console.log(`User connected ${userId} -> socket ${socket.id}`);
        exports.userSoketMap[userId] = socket.id;
        // emitting the online users
        exports.io.emit("getOnlineUsers", Object.keys(exports.userSoketMap));
    }
    if (isAnonymous) {
        console.log(`Anonymous socket connected: ${socket.id} and userName: ${userName}`);
        socket.name = userName;
        anonymousQueue.push(socket);
        changeOnline();
        tryPairAnonymousUsers();
    }
    // this will emit the message sent by the user to the room and the frontend
    socket.on("anonymous_message", ({ roomId, message }) => {
        // go to all the members in roomId
        exports.io.to(roomId).emit("anonymous_message", {
            message,
            senderSocketId: socket.id,
            createdAt: new Date().toISOString()
        });
    });
    socket.on("pair_with_newUser", ({ roomId }) => {
        console.log('hi ter');
        handleAnonymousLeave(socket, roomId);
        for (let i of anonymousQueue) {
            if (i.id === socket.id)
                return socket.emit("already_queued", "You are already in Queue...Please Wait");
        }
        anonymousQueue.push(socket);
        tryPairAnonymousUsers();
    });
    // if any of the user leaves, this leaves the other user too
    socket.on("anonymous_leave", ({ roomId }) => {
        handleAnonymousLeave(socket, roomId);
    });
    // if one user disconnected from the server disconnects the other user too
    socket.on("disconnect", (reason) => {
        console.log(`Socket disconnected ${socket.id} reason: ${reason}`);
        if (userId && !isAnonymous) {
            delete exports.userSoketMap[userId];
            exports.io.emit("getOnlineUsers", Object.keys(exports.userSoketMap));
        }
        // cleanup for anonymous: remove from queue, notify partner
        if (isAnonymous) {
            const idx = anonymousQueue.findIndex((s) => s.id === socket.id);
            if (idx !== -1)
                anonymousQueue.splice(idx, 1);
            const partnerId = anonymousPairs[socket.id];
            if (partnerId) {
                const partnerSocket = exports.io.sockets.sockets.get(partnerId);
                if (partnerSocket) {
                    partnerSocket.emit("anonymous_end", { reason: `${socket.name} Left` });
                }
                delete anonymousPairs[partnerId];
                delete anonymousPairs[socket.id];
            }
        }
        changeOnline();
    });
});
// ------------------------------------------------------------------------ HELPERS ------------------------------------------------------------------------------------------------ //
function changeOnline() {
    exports.io.emit("online_queue", anonymousQueue.length + Object.keys(anonymousPairs).length);
}
// pairs 2 users
function tryPairAnonymousUsers() {
    changeOnline();
    while (anonymousQueue.length >= 2) {
        const user1 = anonymousQueue.shift();
        const user2 = anonymousQueue.shift();
        if (!user1 || !user2)
            break; // safety
        const roomId = `anon_room_${user1.id}_${user2.id}`; // unique room
        user1.join(roomId);
        user2.join(roomId);
        anonymousPairs[user1.id] = user2.id;
        anonymousPairs[user2.id] = user1.id;
        user1.currentAnonRoom = roomId;
        user2.currentAnonRoom = roomId;
        user1.emit("anonymous_paired", { roomId, partnerSocketId: user2.id, partnerName: user2.name });
        user2.emit("anonymous_paired", { roomId, partnerSocketId: user1.id, partnerName: user1.name });
        console.log(`Paired anonymous: ${user1.id} ${user1.name} <-> ${user2.id} ${user2.name} (room: ${roomId})`);
    }
}
// exits the room 
function handleAnonymousLeave(socket, roomId) {
    const rId = roomId || socket.currentAnonRoom;
    if (!rId)
        return;
    socket.emit("anonymous_end", { reason: "Starting new chat...Please Wait" });
    // find partner and cleanup maps
    const partnerId = anonymousPairs[socket.id];
    if (partnerId) {
        delete anonymousPairs[partnerId];
        delete anonymousPairs[socket.id];
        const partnerSocket = exports.io.sockets.sockets.get(partnerId);
        if (partnerSocket) {
            partnerSocket.emit("anonymous_end", { reason: `${socket.name} Left` });
            partnerSocket.leave(rId);
            partnerSocket.currentAnonRoom = undefined;
        }
    }
    socket.leave(rId);
    socket.currentAnonRoom = undefined;
    changeOnline();
}
app.use(express_1.default.json({ limit: "4mb" }));
app.use((0, cors_1.default)());
// Routes
app.use("/api/auth", userRoutes_1.default);
app.use("/api/messages", messageRoutes_1.default);
(0, db_1.connectDb)();
app.get('/', (req, res) => {
    res.json('Backend running!');
});
// start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
