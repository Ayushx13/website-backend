import Candidate from "../models/candidateModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

// Create a new candidate
export const createCandidate = catchAsync(async (req, res, next) => {
    const { name, category } = req.body;

    // Validate required fields
    if (!name || !category) {
        return next(new AppError('Please provide name and category', 400));
    }

    // Validate category
    const validCategories = ['Mr_Fresher', 'Miss_Fresher']; // Add all your categories
    if (!validCategories.includes(category)) {
        return next(new AppError('Invalid category', 400));
    }

    const candidate = await Candidate.create({
        name,
        category,
        vote: 0
    });

    res.status(201).json({
        status: 'success',
        data: {
            candidate
        }
    });
});


// Get all candidates
export const getAllCandidates = catchAsync(async (req, res, next) => {
    const candidates = await Candidate.find()
        .select('name category vote')
        .sort({ category: 1, name: 1 });

    res.status(200).json({
        status: 'success',
        results: candidates.length,
        data: {
            candidates
        }
    });
});

// Get candidates by category
export const getCandidatesByCategory = catchAsync(async (req, res, next) => {
    const { category } = req.params;

    const validCategories = ['Mr_Fresher', 'Miss_Fresher']; // Add all your categories
    if (!validCategories.includes(category)) {
        return next(new AppError('Invalid category', 400));
    }

    const candidates = await Candidate.find({ category })
        .select('name category vote')
        .sort('name');

    res.status(200).json({
        status: 'success',
        results: candidates.length,
        data: {
            candidates
        }
    });
});

// Get single candidate
export const getCandidate = catchAsync(async (req, res, next) => {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
        return next(new AppError('No candidate found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            candidate
        }
    });
});

// Update candidate
export const updateCandidate = catchAsync(async (req, res, next) => {
    // Don't allow vote updates through this route
    if (req.body.vote !== undefined) {
        delete req.body.vote;
    }

    const candidate = await Candidate.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!candidate) {
        return next(new AppError('No candidate found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            candidate
        }
    });
});

// Delete candidate
export const deleteCandidate = catchAsync(async (req, res, next) => {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);

    if (!candidate) {
        return next(new AppError('No candidate found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
