import "./config.js";   // loads dotenv first
import mongoose from "mongoose";
import { app } from "./app.js";
import { createServer } from 'http';
import { Server } from 'socket.io';
require('dotenv').config();


console.log(app.get('env'));

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(con => {
    console.log('Connection Successful !! 🎉');
});

// Create HTTP server and Socket.IO instance
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Import and setup socket handlers
import { setupSocketHandlers } from './utils/socketHandlers.js';
setupSocketHandlers(io);

// Make io accessible to other files
app.set('socketio', io);

const port = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
httpServer.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});