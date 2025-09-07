import Candidate from "../models/candidateModel.js";
import AppError from "../utils/appError.js";
import User from "./../models/userModel.js";
import Vote from "./../models/voteModel.js";
import catchAsync from "./../utils/catchAsync.js";

export const giveVote = catchAsync(async (req, res, next) => {
    const { candidateID } = req.body;

    const userId = req.user.id; // to protect from middleware 


    // 1) find candidate 
    const candidate = await Candidate.findById(candidateID);
    if (!candidate) {
        return next(new AppError('Candidate not found!', 404));
    }


    //2) create vote (will fail if already casted)
    try {
        await Vote.create({
            user: userId,
            candidate: candidate._id,
            category: candidate.category
        });
    } catch (err) {
        if (err.code === 11000) {
            return next(new AppError('You already voted in this category!', 400));
        }
        throw err;
    }

    // 3) Increment candidate vote count 
    candidate.vote += 1;
    await candidate.save({ validateBeforeSave: false });

    // Emit vote update event
    const io = req.app.get('socketio');
    io.emit('voteUpdate', {
        candidateId: candidate._id,
        category: candidate.category,
        newVoteCount: candidate.vote
    });

    res.status(200).json({
        status: "success",
        message: "Vote registered successfully ✅",
        candidate: {
            id: candidate._id,
            name: candidate.name,
            category: candidate.category,
            votes: candidate.vote,
        },
    });
});


// Get all votes of the current user
export const getMyVotes = catchAsync(async (req, res, next) => {
    const votes = await Vote.find({ user: req.user.id })
        .populate({
            path: 'candidate',
            select: 'name category'
        });
    
    res.status(200).json({
        status: 'success',
        data: {
            votes
        }
    });
});


// Get results for a specific category
export const getCategoryResults = catchAsync(async (req, res, next) => {
    const { category } = req.params;

    // Validate category
    const validCategories = ['Mr_Fresher', 'Miss_Fresher']; // Add all your categories
    if (!validCategories.includes(category)) {
        return next(new AppError('Invalid category', 400));
    }

    const results = await Candidate.find({ category })
        .select('name vote category')
        .sort('-vote');
    
    res.status(200).json({
        status: 'success',
        data: {
            category,
            totalCandidates: results.length,
            results
        }
    });
});


// Get overall voting statistics
export const getVotingStats = catchAsync(async (req, res, next) => {
    const stats = await Vote.aggregate([
        {
            $group: {
                _id: '$category',
                totalVotes: { $sum: 1 },
            }
        }
    ]);

    const totalVoters = await User.countDocuments({ isVerified: true });
    const totalVotes = await Vote.countDocuments();

    res.status(200).json({
        status: 'success',
        data: {
            totalVoters,
            totalVotes,
            categoryWiseStats: stats
        }
    });
});
