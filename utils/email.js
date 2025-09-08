import nodemailer from 'nodemailer';
import { generateOTPEmailTemplate } from './emailTemplete.js';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_APP_USER,
        pass: process.env.GMAIL_APP_PASS, // Gmail App Password
    },
    // Additional configuration for better deliverability
    pool: true, // Use pooled connections
    maxConnections: 3, // Limit concurrent connections
    rateDelta: 1000, // Minimum time between emails
    rateLimit: 3, // Max emails per rateDelta
    secure: true, // Use TLS
    tls: {
        rejectUnauthorized: true
    },
    // DKIM is recommended but requires domain setup
});

export const sendOTPEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: {
                name: "Ayush Raj",
                address: process.env.GMAIL_APP_USER
            },
            to: email,
            subject: "Verify Your Email - IIT Dharwad Fresher Party 2025",
            priority: "high",
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high',
                'List-Unsubscribe': `<mailto:${process.env.GMAIL_APP_USER}?subject=unsubscribe>`,
                'Feedback-ID': '1:fresherparty:nodemailer:IITDh'
            },
            text: `Your OTP for IIT Dharwad Fresher Party registration is ${otp}. It expires in 5 minutes.`, // Plain text fallback
            html: generateOTPEmailTemplate(otp), // HTML version
            headers: {
                'List-Unsubscribe': `<mailto:${process.env.GMAIL_APP_USER}?subject=unsubscribe>`,
                'Precedence': 'bulk',
                'X-Auto-Response-Suppress': 'OOF, AutoReply',
                'X-Entity-Ref-ID': `freshers-party-${Date.now()}`
            }
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification email');
    }
};



export const generateOTP = () =>
    String(Math.floor(100000 + Math.random() * 900000));


