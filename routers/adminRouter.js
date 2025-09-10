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

// Route to verify all unverified accounts at once
router.patch("/verify-all-users", async (req, res) => {
    try {
        // First, let's see how many unverified users we have
        const unverifiedCount = await User.countDocuments({ isVerified: false });
        
        if (unverifiedCount === 0) {
            return res.json({
                status: "success",
                message: "No unverified users found",
                data: {
                    modifiedCount: 0,
                    totalVerifiedUsers: await User.countDocuments({ isVerified: true })
                }
            });
        }

        // Update users to verified and remove OTP fields
        const result = await User.updateMany(
            { isVerified: false }, // Find all unverified users
            { 
                $set: { 
                    isVerified: true
                },
                $unset: {
                    otp: "",
                    otpExpiry: ""
                }
            }
        );

        // Get count of all verified users after the operation
        const totalVerifiedUsers = await User.countDocuments({ isVerified: true });

        res.json({
            status: "success",
            message: `${result.modifiedCount} users verified successfully`,
            data: {
                modifiedCount: result.modifiedCount,
                totalVerifiedUsers: totalVerifiedUsers,
                previousUnverifiedCount: unverifiedCount
            }
        });
    } catch (err) {
        console.error("Error verifying users:", err);
        res.status(500).json({ 
            status: "error", 
            message: err.message 
        });
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