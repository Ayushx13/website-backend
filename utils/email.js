import nodemailer from "nodemailer";
import { generateOTPEmailTemplate } from "./emailTemplete.js";

// 🔹 Optimized Fast Gmail Transporter with Better Error Handling
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_APP_USER,
        pass: process.env.GMAIL_APP_PASS, // Gmail App Password (not your Gmail password)
    },
    // Optimize for speed
    pool: true, // Use connection pooling
    maxConnections: 5, // Allow more concurrent connections
    maxMessages: Infinity, // No limit on messages per connection
    rateDelta: 0, // Remove rate limiting for faster sending
    rateLimit: false, // Disable rate limiting
    
    // Timeout settings for faster processing
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000, // 5 seconds
    socketTimeout: 30000, // 30 seconds
    
    // Enable debug for troubleshooting
    logger: false,
    debug: false
});

// Test transporter connection
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Gmail transporter setup failed:", error);
    } else {
        console.log("✅ Gmail transporter is ready to send emails");
    }
});

// 🔹 Fast OTP Sender Function
export const sendOTPEmail = async (email, otp) => {
    try {
        const info = await transporter.sendMail({
            from: `"IIT Dharwad Fresher Party" <${process.env.GMAIL_APP_USER}>`,
            to: email,
            subject: "Your OTP - IIT Dharwad Fresher Party 2025",
            priority: "high",
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high'
            },
            text: `Your OTP for IIT Dharwad Fresher Party registration is ${otp}. It expires in 5 minutes.`,
            html: generateOTPEmailTemplate(otp)
        });

        console.log(`✅ OTP email sent instantly to ${email} | Message ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("❌ Error sending OTP email:", error);
        throw new Error("Failed to send verification email");
    }
};

// 🔹 Generate OTP Function
export const generateOTP = () =>
    String(Math.floor(100000 + Math.random() * 900000));