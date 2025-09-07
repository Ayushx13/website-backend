import express from "express";
import { signUp , login, verifyOTP } from "./../controllers/authController.js";

const router = express.Router();


router.post('/signUp',signUp);
router.post('/login' ,login);
router.post('/verify-otp' ,verifyOTP);


export default router;

