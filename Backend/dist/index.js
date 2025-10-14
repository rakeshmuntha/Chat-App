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
// initialize socket.io server 
exports.io = new socket_io_1.Server(server, {
    cors: { origin: "*" }
});
// store online users (logged-in)
exports.userSoketMap = {}; // { userId: socketId }
// anonymous structures
const anonymousQueue = []; // queue of sockets waiting
const anonymousPairs = {}; // { socketId: partnerSocketId }
// socket.io connection handler
exports.io.on("connection", (socket) => {
    // note: socket.handshake.query values are strings
    const userId = socket.handshake.query?.userId || null;
    const isAnonymous = socket.handshake.query?.isAnonymous === "true";
    const userName = socket.handshake.query?.userName || null;
    console.log(userId);
    console.log(isAnonymous);
    console.log(userName);
    // === Logged-in user handling (existing) ===
    if (userId && !isAnonymous) {
        console.log(`User connected ${userId} -> socket ${socket.id}`);
        exports.userSoketMap[userId] = socket.id;
        // broadcast online users
        exports.io.emit("getOnlineUsers", Object.keys(exports.userSoketMap));
    }
    // === Anonymous user handling ===
    if (isAnonymous) {
        console.log(`Anonymous socket connected: ${socket.id} and userName: ${userName}`);
        // push socket into waiting queue
        socket.name = userName;
        anonymousQueue.push(socket);
        // attempt to pair if >= 2 waiting
        tryPairAnonymousUsers();
    }
    // === Shared events ===
    // Anonymous message event (room-based)
    socket.on("anonymous_message", ({ roomId, message }) => {
        // broadcast to the room AND include senderSocketId so client can identify sender
        exports.io.to(roomId).emit("anonymous_message", {
            message,
            senderSocketId: socket.id,
            createdAt: new Date().toISOString()
        });
    });
    // Optional: Allow a client to explicitly leave anonymous chat (e.g., "Exit" button)
    socket.on("anonymous_leave", ({ roomId }) => {
        handleAnonymousLeave(socket, roomId);
    });
    // handle disconnect for both logged-in and anonymous
    socket.on("disconnect", (reason) => {
        console.log(`Socket disconnected ${socket.id} reason: ${reason}`);
        // cleanup for logged-in
        if (userId && !isAnonymous) {
            delete exports.userSoketMap[userId];
            exports.io.emit("getOnlineUsers", Object.keys(exports.userSoketMap));
        }
        // cleanup for anonymous: remove from queue, notify partner
        if (isAnonymous) {
            // remove from waiting queue (if present)
            const idx = anonymousQueue.findIndex((s) => s.id === socket.id);
            if (idx !== -1)
                anonymousQueue.splice(idx, 1);
            // if paired, notify partner
            const partnerId = anonymousPairs[socket.id];
            if (partnerId) {
                const partnerSocket = exports.io.sockets.sockets.get(partnerId);
                if (partnerSocket) {
                    partnerSocket.emit("anonymous_end", { reason: "Partner left" });
                    // optionally force partner to leave room
                    // You might want to cleanup partnerSocket.rooms manually if needed
                }
                // delete both sides mapping
                delete anonymousPairs[partnerId];
                delete anonymousPairs[socket.id];
            }
        }
    });
});
// ------------------------
// Helper functions
// ------------------------
function tryPairAnonymousUsers() {
    // pair as many as possible (FIFO)
    while (anonymousQueue.length >= 2) {
        const user1 = anonymousQueue.shift();
        const user2 = anonymousQueue.shift();
        if (!user1 || !user2)
            break; // safety
        const roomId = `anon_room_${user1.id}_${user2.id}`; // unique room
        user1.join(roomId);
        user2.join(roomId);
        // map partners for cleanup
        anonymousPairs[user1.id] = user2.id;
        anonymousPairs[user2.id] = user1.id;
        // store current room on sockets (optional helpful flag)
        user1.currentAnonRoom = roomId;
        user2.currentAnonRoom = roomId;
        // notify both clients
        user1.emit("anonymous_paired", { roomId, partnerSocketId: user2.id, partnerName: user2.name });
        user2.emit("anonymous_paired", { roomId, partnerSocketId: user1.id, partnerName: user1.name });
        console.log(`Paired anonymous: ${user1.id} ${user1.name} <-> ${user2.id} ${user2.name} (room: ${roomId})`);
    }
}
function handleAnonymousLeave(socket, roomId) {
    // if roomId provided, use it, otherwise check socket.currentAnonRoom
    const rId = roomId || socket.currentAnonRoom;
    if (!rId)
        return;
    // notify the room that chat is ending
    exports.io.to(rId).emit("anonymous_end", { reason: `${socket.name} left`, by: socket.id });
    // find partner and cleanup maps
    const partnerId = anonymousPairs[socket.id];
    if (partnerId) {
        delete anonymousPairs[partnerId];
        delete anonymousPairs[socket.id];
        const partnerSocket = exports.io.sockets.sockets.get(partnerId);
        if (partnerSocket) {
            // remove partner from room
            partnerSocket.leave(rId);
            partnerSocket.currentAnonRoom = undefined;
        }
    }
    // leave the room and cleanup
    socket.leave(rId);
    socket.currentAnonRoom = undefined;
}
// --------------------------------------------------
// Express config & routes (kept from your original)
// --------------------------------------------------
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
