import "./config.js";   // loads dotenv first
import mongoose from "mongoose";
import { app } from "./app.js";
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupSocketHandlers } from './utils/socketHandlers.js';


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

// setup socket handlers
setupSocketHandlers(io);

// Make io accessible to other files
app.set('socketio', io);

const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});