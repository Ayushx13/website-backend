import express from "express";
import { protect, restrictTo } from "./../controllers/authController.js";
import { 
    sendMessage, 
    getAllMessages, 
    getMyMessages,
    getMessagesByEmail
} from "../controllers/messageController.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Routes for authenticated users
router.post('/send', sendMessage);
router.get('/my-messages', getMyMessages);

// Admin only routes
router.get('/all', restrictTo('admin'), getAllMessages);
router.get('/user/:email', restrictTo('admin'), getMessagesByEmail);

export default router;
