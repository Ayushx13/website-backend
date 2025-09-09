import express from "express";
import User from "../models/userModel.js";
import { protect, restrictTo } from "./../controllers/authController.js";
import {
    createCandidate,
    getAllCandidates,
    getCandidatesByCategory,
    getCandidate,
    updateCandidate,
    deleteCandidate
} from "../controllers/candiController.js";

const router = express.Router();

//to protect and restrict to admin only
router.use(protect);
router.use(restrictTo('admin'));


// All routes after this middleware are protected and restricted to admin only
router.delete("/cleanup-otp-users", async (req, res) => {
    try {
        const result = await User.deleteMany({
            otp: { $exists: true, $ne: null } // only users who have an OTP
        });

        res.json({
            status: "success",
            message: `Users with OTP removed: ${result.deletedCount}`
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});


router
    .route('/')
    .post(createCandidate);

router
    .route('/category/:category')
    .get(getCandidatesByCategory);

router
    .route('/:id')
    .get(getCandidate)
    .patch(updateCandidate)
    .delete(deleteCandidate);

export default router;