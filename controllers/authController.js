import AppError from "../utils/appError.js";
import User from "./../models/userModel.js";
import catchAsync from "./../utils/catchAsync.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { generateOTP, sendOTPEmail } from "../utils/email.js";


const signToken = id => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};


const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        ...(process.env.NODE_ENV === "production" && { secure: true }) // cleaner secure flag
    };

    res.cookie("jwt", token, cookieOptions);

    // remove password before sending
    user.password = undefined;

    // Send response with token and minimal user info
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        }
    });
};



export const signUp = catchAsync(async (req, res, next) => {

    const { name, email, password } = req.body;

    // Check if required fields are present
    if (!name || !email || !password) {
        return next(new AppError("Please provide name, email and password", 400));
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
        return next(new AppError("Email already registered", 400));
    }

    // Create unverified user with default student role
    const newUser = new User({ 
        name, 
        email, 
        password,
        role: 'student',  // Set default role as student
        isVerified: false 
    });

    // Generate OTP
    const otp = generateOTP();

    newUser.otp = otp;
    newUser.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min
    await newUser.save();

    // Send email
    await sendOTPEmail(email, otp);

    res.status(201).json({
        status: "success",
        message: "Signup successful. OTP sent to email for verification.",
    });
});



export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //1) check if email and password exists
    if (!email || !password) {
        return next(
            new AppError("Please Provide Email and Password!", 400)
        );
    }

    //2) check if user exists && passwords is correct ?
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401));
    };


    //3) checking if user is verified
    if (!user.isVerified) {
        return next(new AppError("Your email is not verified. Please verify to login.", 403));
    }


    //4) if everything is correct send token to cilent 
    createSendToken(user, 200, res);

});


export const protect = catchAsync(async (req, res, next) => {

    // 1) Get token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError("You are not logged in! Please log in to get access.", 401));
    }

    // 2) Verify token
    let decoded;
    try {
        decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (err) {
        return next(new AppError("Invalid or expired token. Please log in again.", 401));
    }

    // 3) Get user from payload 
    const currentUser = await User.findById(decoded.id);

    //3.a) check if user still exists
    if (!currentUser) {
        return next(new AppError("The user belonging to this token does no longer exist.", 401));
    };

    //3.b) verifing if user is verified
    if (!currentUser.isVerified) {
        return next(new AppError("Please verify your email to access this route.", 403));
    }

    // 4) Grant access to protected route
    req.user = currentUser;
    next();

});



export const verifyOTP = catchAsync(async (req, res, next) => {
    // 1. Get email and OTP from request
    const { email, otp } = req.body;
    
    // 2. Find user by email
    const user = await User.findOne({ email }).select("+otp +otpExpiry +isVerified");
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    
    if (user.isVerified) {
        return next(new AppError("User is already verified", 400));
    }
    
    if (!user.otp || !user.otpExpiry) {
        return next(new AppError("Invalid OTP, please try again.", 400));
    }
    
    
    // 3. Check if OTP is correct and not expired
    if (user.otpExpiry < Date.now()) {
        return next(new AppError("Expired OTP, please try again.", 400));
    }
    
    if (user.otp !== otp) {
        return next(new AppError("Invalid OTP, please try again.", 400));
    }
    // 4. Update user as verified
    
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    // 5. Send success response
    createSendToken(user, 200, res);
    
});


export const restrictTo = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return next(
                new AppError(`You don't have permission to perform this action`, 403)
            );
        }
        next();
    };
};