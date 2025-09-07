import express from "express";
import { protect } from "./../controllers/authController.js";
import { 
    giveVote, 
    getMyVotes, 
    getCategoryResults, 
    getVotingStats 
} from "./../controllers/voteController.js";

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Routes
router.post('/', giveVote);
router.get('/my-votes', getMyVotes);
router.get('/category/:category', getCategoryResults);
router.get('/stats', getVotingStats);

export default router;