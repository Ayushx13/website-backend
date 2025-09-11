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
import {
    getEmailRotationStatus,
    resetEmailRotation,
    testGmailAccounts
} from "../controllers/adminController.js";

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

// Route to delete users with expired OTPs (older than 5 minutes)
router.delete("/cleanup-expired-otp-users", async (req, res) => {
    try {
        // Calculate 5 minutes ago
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        // Find users with expired OTPs
        const expiredUsers = await User.find({
            otpExpiry: { $lt: fiveMinutesAgo },
            isVerified: false,
            otp: { $exists: true, $ne: null }
        });

        // Delete users with expired OTPs
        const result = await User.deleteMany({
            otpExpiry: { $lt: fiveMinutesAgo },
            isVerified: false,
            otp: { $exists: true, $ne: null }
        });

        res.json({
            status: "success",
            message: `Users with expired OTP removed: ${result.deletedCount}`,
            data: {
                deletedCount: result.deletedCount,
                expiredUsers: expiredUsers.map(user => ({
                    name: user.name,
                    email: user.email,
                    otpExpiry: user.otpExpiry,
                    minutesExpired: Math.floor((Date.now() - user.otpExpiry) / (1000 * 60))
                }))
            }
        });
    } catch (err) {
        console.error("Error cleaning up expired OTP users:", err);
        res.status(500).json({ 
            status: "error", 
            message: err.message 
        });
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

// Gmail rotation management routes
router.get('/email-rotation-status', getEmailRotationStatus);
router.post('/reset-email-rotation', resetEmailRotation);
router.get('/test-gmail-accounts', testGmailAccounts);


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