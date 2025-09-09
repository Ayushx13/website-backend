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
router.delete("/cleanup-fake-users", async (req, res) => {
    try {
        // same 3 deleteMany queries here
        await User.deleteMany({
            email: {
                $not: {
                    $regex: "^(cs|ee|ec|mc|me|ce|ep|is|ch)(24|25)(bm|bt)(0[0-6][0-9]|070)@iitdh\\.ac\\.in$",
                    $options: "i"
                }
            }
        });
        await User.deleteMany({
            email: { $regex: "^is(24|25)bt(0[0-6][0-9]|070)@iitdh\\.ac\\.in$", $options: "i" }
        });
        await User.deleteMany({
            email: { $regex: "^(cs|ee|ec|mc|me|ce|ep|ch)(24|25)bm(0[0-6][0-9]|070)@iitdh\\.ac\\.in$", $options: "i" }
        });

        res.json({ status: "success", message: "Fake users removed" });
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