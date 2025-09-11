import catchAsync from '../utils/catchAsync.js';
import { getRotationStatus, resetRotation, testAllGmailAccounts } from '../utils/email.js';

// Get Gmail rotation status
export const getEmailRotationStatus = catchAsync(async (req, res, next) => {
    const status = getRotationStatus();
    
    res.status(200).json({
        status: 'success',
        data: {
            rotation: status
        }
    });
});

// Reset Gmail rotation to first account
export const resetEmailRotation = catchAsync(async (req, res, next) => {
    resetRotation();
    
    res.status(200).json({
        status: 'success',
        message: 'Gmail account rotation reset to first account'
    });
});

// Test all Gmail accounts
export const testGmailAccounts = catchAsync(async (req, res, next) => {
    const results = await testAllGmailAccounts();
    
    res.status(200).json({
        status: 'success',
        data: {
            testResults: results
        }
    });
});
