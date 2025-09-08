import express from "express";
import { protect, restrictTo } from "./../controllers/authController.js";
import { 
    submitSongSuggestions, 
    getMySongSuggestions, 
    getAllSongSuggestions 
} from "../controllers/songController.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Routes for all authenticated users
router.post('/submit', submitSongSuggestions);
router.get('/my-suggestions', getMySongSuggestions);

// Admin only routes
router.get('/all', restrictTo('admin'), getAllSongSuggestions);

export default router;
