import AnonymousMessage from "../models/anonymousMessage.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";

// Send anonymous message
export const sendMessage = catchAsync(async (req, res, next) => {
    const { message } = req.body;

    if (!message) {
        return next(new AppError('Please provide a message', 400));
    }

    const anonymousMessage = await AnonymousMessage.create({
        user: req.user.id,
        message
    });

    res.status(201).json({
        status: 'success',
        data: {
            message: anonymousMessage.message
        }
    });
});

// Get all messages (admin only)
export const getAllMessages = catchAsync(async (req, res, next) => {
    const messages = await AnonymousMessage.find()
        .populate('user', 'name email')

    res.status(200).json({
        status: 'success',
        results: messages.length,
        data: {
            messages: messages.map(msg => ({
                message: msg.message
            }))
        }
    });
});

// Get my messages
export const getMyMessages = catchAsync(async (req, res, next) => {
    const messages = await AnonymousMessage.find({ user: req.user.id })

    res.status(200).json({
        status: 'success',
        results: messages.length,
        data: {
            messages
        }
    });
});

// Get messages by user email (admin only)
export const getMessagesByEmail = catchAsync(async (req, res, next) => {
    const { email } = req.params;

    // First find the user with this email
    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError('No user found with that email', 404));
    }

    // Find all messages by this user
    const messages = await AnonymousMessage.find({ user: user._id })
        .populate('user', 'name email');

    res.status(200).json({
        status: 'success',
        results: messages.length,
        data: {
            user: {
                name: user.name,
                email: user.email
            },
            messages: messages.map(msg => ({
                message: msg.message
            }))
        }
    });
});
