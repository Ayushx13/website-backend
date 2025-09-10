import nodemailer from "nodemailer";
import { generateOTPEmailTemplate } from "./emailTemplete.js";

// 🔹 Minimal & Fast Gmail Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_APP_USER,
        pass: process.env.GMAIL_APP_PASS, // Gmail App Password (not your Gmail password)
    },
    logger: true, // helps debug if delays occur
    debug: true
});

// 🔹 OTP Sender Function
export const sendOTPEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: `"Ayush Raj" <${process.env.GMAIL_APP_USER}>`,
            to: email,
            subject: "Verify Your Email - IIT Dharwad Fresher Party 2025",
            priority: "high",
            text: `Your OTP for IIT Dharwad Fresher Party registration is ${otp}. It expires in 5 minutes.`,
            html: generateOTPEmailTemplate(otp)
        });

        console.log(`✅ OTP email sent to ${email}`);
    } catch (error) {
        console.error("❌ Error sending OTP email:", error);
        throw new Error("Failed to send verification email");
    }
};


export const generateOTP = () =>
    String(Math.floor(100000 + Math.random() * 900000));