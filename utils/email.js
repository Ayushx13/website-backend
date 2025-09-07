import nodemailer from 'nodemailer';
import { generateOTPEmailTemplate } from './emailTemplete.js';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_APP_USER,
        pass: process.env.GMAIL_APP_PASS, // Gmail App Password
    },
});

export const sendOTPEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: `"Ayush Raj" <${process.env.GMAIL_APP_USER}>`,
            to: email,
            subject: "✨ One Step Away from Joining the Party! 🎊 Verify Now !",
            text: `Your OTP is ${otp}. It expires in 5 minutes.`, // Plain text fallback
            html: generateOTPEmailTemplate(otp) // HTML version
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification email');
    }
};



export const generateOTP = () =>
    String(Math.floor(100000 + Math.random() * 900000));


