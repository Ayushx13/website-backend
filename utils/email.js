import nodemailer from "nodemailer";
import { generateOTPEmailTemplate } from "./emailTemplete.js";

// Gmail accounts configuration
const gmailAccounts = [
    {
        user: process.env.GMAIL_APP_USER_1,
        pass: process.env.GMAIL_APP_PASS_1,
        name: 'IIT Dharwad Fresher Party Team 1'
    },
    {
        user: process.env.GMAIL_APP_USER_2,
        pass: process.env.GMAIL_APP_PASS_2,
        name: 'IIT Dharwad Fresher Party Team 2'
    },
    {
        user: process.env.GMAIL_APP_USER_3,
        pass: process.env.GMAIL_APP_PASS_3,
        name: 'IIT Dharwad Fresher Party Team 3'
    },
    {
        user: process.env.GMAIL_APP_USER_4,
        pass: process.env.GMAIL_APP_PASS_4,
        name: 'IIT Dharwad Fresher Party Team 4'
    },
    {
        user: process.env.GMAIL_APP_USER_5,
        pass: process.env.GMAIL_APP_PASS_5,
        name: 'IIT Dharwad Fresher Party Team 5'
    },
    {
        user: process.env.GMAIL_APP_USER_6,
        pass: process.env.GMAIL_APP_PASS_6,
        name: 'IIT Dharwad Fresher Party Team 6'
    },
    {
        user: process.env.GMAIL_APP_USER_7,
        pass: process.env.GMAIL_APP_PASS_7,
        name: 'IIT Dharwad Fresher Party Team 7'
    },
    {
        user: process.env.GMAIL_APP_USER_8,
        pass: process.env.GMAIL_APP_PASS_8,
        name: 'IIT Dharwad Fresher Party Team 8'
    }
].filter(account => account.user && account.pass); // Filter out undefined accounts

// Current account index for rotation
let currentAccountIndex = 0;

// Create optimized transporter for each Gmail account
const createGmailTransporter = (account) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: account.user,
            pass: account.pass, // Gmail App Password
        },
        // Optimize for speed
        pool: false, // Use connection pooling

        // Timeout settings for faster processing
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 5000, // 5 seconds
        socketTimeout: 30000, // 30 seconds
        
        // Disable logging for better performance
        logger: false,
        debug: false
    });

    // Test transporter connection
    transporter.verify((error, success) => {
        if (error) {
            console.error(`❌ Gmail transporter setup failed for ${account.user}:`, error.message);
        } else {
            console.log(`✅ Gmail transporter ready: ${account.user}`);
        }
    });

    return transporter;
};

// Initialize all Gmail transporters
const gmailTransporters = gmailAccounts.map(account => ({
    transporter: createGmailTransporter(account),
    user: account.user,
    name: account.name
}));

console.log(`📧 Initialized ${gmailTransporters.length} Gmail accounts for rotation`);

// Get next available Gmail account (circular rotation)
const getNextGmailAccount = () => {
    if (gmailTransporters.length === 0) {
        throw new Error('No Gmail accounts configured');
    }
    
    const account = gmailTransporters[currentAccountIndex];
    currentAccountIndex = (currentAccountIndex + 1) % gmailTransporters.length;
    
    console.log(`📧 Using Gmail account: ${account.user} (Account ${currentAccountIndex}/${gmailTransporters.length})`);
    return account;
};

// 🔹 Fast OTP Sender Function with Gmail Rotation
export const sendOTPEmail = async (email, otp, retries = 3) => {
    let lastError;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // Get next Gmail account in rotation
            const currentAccount = getNextGmailAccount();
            
            console.log(`📧 Attempt ${attempt}: Sending OTP to ${email} using ${currentAccount.user}`);
            
            const htmlContent = generateOTPEmailTemplate(otp);
            
            const mailOptions = {
                from: `"Ayush Raj" <${currentAccount.user}>`,
                to: email,
                subject: "Your OTP - IIT Dharwad Fresher Party 2025",
                priority: "high",
                headers: {
                    'X-Priority': '1',
                    'X-MSMail-Priority': 'High',
                    'Importance': 'high'
                },
                text: `Your verification code is: ${otp}. This code will expire in 5 minutes.`,
                html: htmlContent
            };

            const info = currentAccount.transporter.sendMail(mailOptions);
            
            console.log(`✅ OTP email sent successfully from ${currentAccount.user} to ${email} | Message ID: ${info.messageId}`);
            
            return {
                success: true,
                messageId: info.messageId,
                sentFrom: currentAccount.user,
                attempt: attempt
            };
        } catch (error) {
            lastError = error;
            console.error(`❌ Attempt ${attempt} failed with ${gmailTransporters[currentAccountIndex - 1]?.user}:`, {
                message: error.message,
                code: error.code,
                command: error.command
            });
            
            // If this isn't the last attempt, try next account
            if (attempt < retries) {
                console.log(`🔄 Trying next Gmail account...`);
                continue;
            }
        }
    }
    
    // If all attempts failed
    console.error('❌ All Gmail accounts failed to send email:', lastError);
    throw new Error(`Failed to send verification email after ${retries} attempts with different Gmail accounts`);
};

// 🔹 Generate OTP Function
export const generateOTP = () =>
    String(Math.floor(100000 + Math.random() * 900000));

// Function to get rotation status (for admin monitoring)
export const getRotationStatus = () => {
    return {
        service: 'Gmail',
        totalAccounts: gmailTransporters.length,
        currentIndex: currentAccountIndex,
        currentAccount: gmailTransporters[currentAccountIndex]?.user,
        dailyLimit: gmailTransporters.length * 500, // 500 emails per Gmail account per day
        totalDailyCapacity: `${gmailTransporters.length * 500} emails/day`,
        allAccounts: gmailTransporters.map((acc, index) => ({
            index,
            email: acc.user,
            name: acc.name,
            isActive: index === currentAccountIndex
        }))
    };
};

// Function to reset rotation (if needed)
export const resetRotation = () => {
    currentAccountIndex = 0;
    console.log('📧 Gmail account rotation reset to first account');
};

// Function to test all Gmail accounts
export const testAllGmailAccounts = async () => {
    const results = [];
    
    for (let i = 0; i < gmailTransporters.length; i++) {
        const account = gmailTransporters[i];
        try {
            // Verify connection without sending email
            const isConnected = await new Promise((resolve) => {
                account.transporter.verify((error, success) => {
                    resolve(!error);
                });
            });
            
            results.push({
                index: i,
                email: account.user,
                name: account.name,
                status: isConnected ? 'connected' : 'connection_failed'
            });
        } catch (error) {
            results.push({
                index: i,
                email: account.user,
                name: account.name,
                status: 'error',
                error: error.message
            });
        }
    }
    
    return results;
};